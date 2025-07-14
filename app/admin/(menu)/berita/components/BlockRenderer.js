"use client";

import React from "react";
import Image from "next/image";

const BlockRenderer = ({ content }) => {
  if (!content) return null;

  // Check if content is HTML (from rich text editor)
  const isHTML = content.includes('<') && content.includes('>');
  
  if (isHTML) {
    // Handle HTML content from rich text editor
    return (
      <div 
        className="prose prose-lg max-w-none rich-text-content"
        dangerouslySetInnerHTML={{ __html: content }}
        style={{
          // Ensure proper styling for rich text content
          lineHeight: '1.6',
          color: '#374151',
        }}
      />
    );
  }

  // Try to parse as JSON blocks (legacy format)
  let blocks;
  try {
    blocks = JSON.parse(content);
  } catch {
    // If not JSON and not HTML, treat as plain text
    return (
      <div className="prose prose-lg max-w-none">
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
          {content}
        </p>
      </div>
    );
  }

  if (!Array.isArray(blocks)) return null;

  const renderBlock = (block, index) => {
    switch (block.type) {
      case 'paragraph':
        return (
          <p key={block.id || index} className="mb-4 text-gray-700 leading-relaxed">
            {block.content}
          </p>
        );

      case 'heading1':
        return (
          <h1 key={block.id || index} className="text-3xl font-bold mb-6 text-gray-900">
            {block.content}
          </h1>
        );

      case 'heading2':
        return (
          <h2 key={block.id || index} className="text-2xl font-semibold mb-4 text-gray-900">
            {block.content}
          </h2>
        );

      case 'image':
        if (!block.content.src) return null;
        return (
          <div key={block.id || index} className="mb-6">
            <div className="relative w-full max-w-4xl mx-auto">
              <Image
                src={block.content.src}
                alt={block.content.alt || "Article image"}
                width={800}
                height={500}
                className="w-full h-auto rounded-lg shadow-md"
                style={{ objectFit: 'contain' }}
              />
            </div>
            {block.content.caption && (
              <p className="text-center text-sm text-gray-600 mt-2 italic">
                {block.content.caption}
              </p>
            )}
          </div>
        );

      case 'unordered-list':
        if (!block.content.trim()) return null;
        return (
          <ul key={block.id || index} className="list-disc list-inside mb-4 space-y-2 text-gray-700 ml-4">
            {block.content.split('\n').filter(item => item.trim()).map((item, i) => (
              <li key={i}>{item.trim()}</li>
            ))}
          </ul>
        );

      case 'ordered-list':
        if (!block.content.trim()) return null;
        return (
          <ol key={block.id || index} className="list-decimal list-inside mb-4 space-y-2 text-gray-700 ml-4">
            {block.content.split('\n').filter(item => item.trim()).map((item, i) => (
              <li key={i}>{item.trim()}</li>
            ))}
          </ol>
        );

      default:
        return null;
    }
  };

  return (
    <div className="prose prose-lg max-w-none">
      {blocks.map((block, index) => renderBlock(block, index))}
    </div>
  );
};

export default BlockRenderer;
