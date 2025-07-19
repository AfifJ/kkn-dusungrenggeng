"use client";

import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import {
  EditorState,
  convertToRaw,
  convertFromRaw,
  ContentState,
  AtomicBlockUtils,
} from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { uploadImageToImghippo } from "../utils/imghippo";

// Dynamic import untuk react-draft-wysiwyg Editor
const Editor = dynamic(
  () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border border-gray-200">
        <div className="text-gray-500">Loading editor...</div>
      </div>
    ),
  }
);

const RichTextEditor = ({
  value,
  onChange,
  placeholder = "Mulai menulis...",
}) => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const [isClient, setIsClient] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const isMountedRef = useRef(false);
  const [internalHtml, setInternalHtml] = useState("");

  // Client-side mounting
  useEffect(() => {
    isMountedRef.current = true;
    setIsMounted(true);
    setIsClient(true);

    return () => {
      isMountedRef.current = false;
      setIsMounted(false);
    };
  }, []);

  // Convert HTML to Draft.js state when value changes
  useEffect(() => {
    if (!isMounted || !isClient) return;

    if (value && value.trim() !== "" && value !== internalHtml) {
      try {
        const contentBlock = htmlToDraft(value);
        if (contentBlock && contentBlock.contentBlocks) {
          const contentState = ContentState.createFromBlockArray(
            contentBlock.contentBlocks
          );
          const newEditorState = EditorState.createWithContent(contentState);
          setEditorState(newEditorState);
          setInternalHtml(value); // Sync internal state
        }
      } catch (error) {
        console.error("Error converting HTML to Draft.js state:", error);
        setEditorState(EditorState.createEmpty());
      }
    } else if ((!value || value.trim() === "") && internalHtml) {
      setEditorState(EditorState.createEmpty());
      setInternalHtml("");
    }
  }, [value, isClient, isMounted, internalHtml]);

  // Handle editor state change
  const handleEditorChange = (newEditorState) => {
    if (!isMountedRef.current || !isMounted || !isClient) return;

    setEditorState(newEditorState);

    // Convert Draft.js state to HTML
    const html = draftToHtml(convertToRaw(newEditorState.getCurrentContent()));

    // Clean up empty HTML
    const cleanHtml = html.replace(/<p><\/p>/g, "").trim();

    // Only call onChange if content has actually changed from the last synced value
    if (cleanHtml !== internalHtml && isMountedRef.current) {
      setInternalHtml(cleanHtml); // Update internal state first
      onChange(cleanHtml);
    }
  };

  const uploadImageCallBack = async (file) => {
    try {
      console.log("Uploading image:", file.name);
      const uploadedImage = await uploadImageToImghippo(file);
      console.log("Upload successful:", uploadedImage);
      return { 
        data: { 
          link: uploadedImage.url,
          alt: uploadedImage.title || file.name 
        } 
      };
    } catch (error) {
      console.error("Image upload failed:", error);
      return { error: "Image upload failed. Please try again." };
    }
  };

  // Don't render on server-side
  if (!isClient || !isMounted) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border border-gray-200">
        <div className="text-gray-500">Loading editor...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm ring-1 ring-gray-200 transition-all duration-200">
      <Editor
        editorState={editorState}
        onEditorStateChange={handleEditorChange}
        toolbar={{
          options: [
            "inline",
            "blockType",
            "list",
            "textAlign",
            "link",
            "embedded",
            "image",
            "history",
          ],
          inline: {
            inDropdown: false,
            options: [
              "bold",
              "italic",
              "underline",
              "strikethrough",
              "monospace",
              "superscript",
              "subscript",
            ],
          },
          blockType: {
            inDropdown: false,
            options: ["Normal", "H1", "H2", "H3"],
          },
          list: {
            inDropdown: false,
            options: ["unordered", "ordered"],
          },
          textAlign: {
            inDropdown: false,
            options: ["left", "center", "right", "justify"],
          },
          link: {
            inDropdown: false,
            showOpenOptionOnHover: true,
            defaultTargetOption: "_blank",
            options: ["link", "unlink"],
          },
          embedded: {
            embedCallback: (link) => {
              // Support for various embed types
              const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/;
              const vimeoRegex = /vimeo\.com\/([0-9]+)/;
              const facebookRegex = /facebook\.com\/(.+\/)?videos\/([0-9]+)/;
              const instagramRegex = /instagram\.com\/p\/([a-zA-Z0-9_-]+)/;
              const twitterRegex = /twitter\.com\/(.+)\/status\/([0-9]+)/;
              
              // YouTube
              const youtubeMatch = link.match(youtubeRegex);
              if (youtubeMatch) {
                const videoId = youtubeMatch[1];
                return `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`;
              }
              
              // Vimeo
              const vimeoMatch = link.match(vimeoRegex);
              if (vimeoMatch) {
                const videoId = vimeoMatch[1];
                return `<iframe src="https://player.vimeo.com/video/${videoId}" width="560" height="315" frameborder="0" allowfullscreen></iframe>`;
              }
              
              // General URL embedding
              const urlRegex = /^https?:\/\/[^\s$.?#].[^\s]*$/;
              if (urlRegex.test(link)) {
                return `<iframe src="${link}" width="100%" height="400" frameborder="0"></iframe>`;
              }
              
              return false;
            },
            defaultSize: {
              height: 'auto',
              width: '100%',
            },
          },
          image: {
            uploadCallback: uploadImageCallBack,
            alt: { present: true, mandatory: false },
            previewImage: true,
            inputAccept: "image/gif,image/jpeg,image/jpg,image/png,image/svg,image/webp",
            defaultSize: {
              height: 'auto',
              width: '100%',
            },
          },
          history: {
            inDropdown: false,
            options: ["undo", "redo"],
          },
        }}
        placeholder={placeholder}
        wrapperClassName="rich-text-editor-wrapper"
        toolbarClassName="rich-text-editor-toolbar"
        editorClassName="rich-text-editor-main"
      />
      <style jsx global>{`
        .rich-text-editor-wrapper {
          display: flex;
          flex-direction: column;
          min-height: 250px;
        }

        .rich-text-editor-toolbar {
          border-bottom: 1px solid #e5e7eb !important;
          background-color: #f9fafb !important;
          padding: 8px !important;
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
          border-top-left-radius: 0.5rem;
          border-top-right-radius: 0.5rem;
        }

        .rich-text-editor-main {
          flex-grow: 1;
          padding: 16px !important;
          font-size: 16px !important;
          line-height: 1.6 !important;
          cursor: text;
        }

        .rdw-option-wrapper,
        .rdw-dropdown-wrapper {
          border: 1px solid transparent !important;
          border-radius: 4px !important;
          margin: 0 !important;
          padding: 4px !important;
          background-color: transparent !important;
          min-width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.2s, border-color 0.2s;
        }

        .rdw-option-wrapper:hover,
        .rdw-dropdown-wrapper:hover {
          background-color: #f3f4f6 !important;
          border-color: #d1d5db !important;
        }

        .rdw-option-active {
          background-color: #e0e7ff !important;
          border-color: #a5b4fc !important;
        }

        .rdw-dropdown-optionwrapper {
          border: 1px solid #d1d5db !important;
          border-radius: 4px !important;
          background-color: white !important;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
        }

        .DraftEditor-root {
          height: 100%;
        }

        .public-DraftEditorPlaceholder-root {
          color: #9ca3af !important;
        }

        .rdw-editor-main h1 {
          font-size: 2em !important;
          font-weight: 700 !important;
          margin-bottom: 0.5em !important;
        }

        .rdw-editor-main h2 {
          font-size: 1.5em !important;
          font-weight: 600 !important;
          margin-bottom: 0.5em !important;
        }

        .rdw-editor-main h3 {
          font-size: 1.25em !important;
          font-weight: 600 !important;
          margin-bottom: 0.5em !important;
        }

        .rdw-editor-main blockquote {
          border-left: 4px solid #e5e7eb !important;
          padding-left: 1em !important;
          margin: 1em 0 !important;
          font-style: italic !important;
          color: #6b7280 !important;
        }

        .rdw-editor-main ul,
        .rdw-editor-main ol {
          padding-left: 1.5em !important;
          margin-bottom: 1em !important;
        }

        .rdw-editor-main iframe {
          max-width: 100% !important;
          height: 400px !important;
          border: 1px solid #e5e7eb !important;
          border-radius: 4px !important;
          margin: 1em 0 !important;
        }

        .rdw-editor-main img {
          max-width: 100% !important;
          height: auto !important;
          border-radius: 4px !important;
          margin: 1em 0 !important;
        }

        .rdw-editor-main a {
          color: #3b82f6 !important;
          text-decoration: underline !important;
        }

        .rdw-editor-main a:hover {
          color: #1d4ed8 !important;
        }

        /* Modal styles */
        .rdw-link-modal,
        .rdw-embedded-modal,
        .rdw-image-modal {
          background: white !important;
          border: 1px solid #d1d5db !important;
          border-radius: 8px !important;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
          padding: 12px !important;
          z-index: 1000 !important;
        }

        .rdw-link-modal-input,
        .rdw-embedded-modal-input,
        .rdw-image-modal-input {
          border: 1px solid #d1d5db !important;
          border-radius: 4px !important;
          padding: 8px !important;
          font-size: 14px !important;
          width: 100% !important;
          margin-bottom: 8px !important;
        }

        .rdw-link-modal-input:focus,
        .rdw-embedded-modal-input:focus,
        .rdw-image-modal-input:focus {
          outline: none !important;
          border-color: #3b82f6 !important;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
        }

        .rdw-link-modal-btn,
        .rdw-embedded-modal-btn,
        .rdw-image-modal-btn {
          background: #3b82f6 !important;
          color: white !important;
          border: none !important;
          padding: 8px 16px !important;
          border-radius: 4px !important;
          cursor: pointer !important;
          font-size: 14px !important;
          margin-right: 8px !important;
        }

        .rdw-link-modal-btn:hover,
        .rdw-embedded-modal-btn:hover,
        .rdw-image-modal-btn:hover {
          background: #2563eb !important;
        }

        /* Dropdown styles */
        .rdw-dropdown-carettoclose,
        .rdw-dropdown-carettoopen {
          margin-left: 4px !important;
        }

        .rdw-dropdown-optionwrapper {
          background: white !important;
          border: 1px solid #d1d5db !important;
          border-radius: 4px !important;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15) !important;
          z-index: 100 !important;
        }

        .rdw-dropdown-option {
          padding: 8px 12px !important;
          cursor: pointer !important;
          transition: background-color 0.2s !important;
        }

        .rdw-dropdown-option:hover {
          background-color: #f3f4f6 !important;
        }

        .rdw-dropdown-option:active {
          background-color: #e5e7eb !important;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
