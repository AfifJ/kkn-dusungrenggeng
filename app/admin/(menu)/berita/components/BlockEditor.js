"use client";

import React, { useState, useRef } from "react";
import { Plus, Type, Image as ImageIcon, List, ListOrdered, Heading1, Heading2, X, Upload, MoveUp, MoveDown } from "lucide-react";
import Image from "next/image";
import { uploadImageToImghippo, compressImage } from "../utils/imghippo";

const BlockEditor = ({ value, onChange, placeholder = "Mulai menulis..." }) => {
  const [blocks, setBlocks] = useState(() => {
    if (value && value.trim()) {
      try {
        return JSON.parse(value);
      } catch {
        // Jika value bukan JSON, anggap sebagai HTML lama dan convert ke block pertama
        return [{ id: Date.now(), type: 'paragraph', content: value }];
      }
    }
    return [{ id: Date.now(), type: 'paragraph', content: '' }];
  });

  const [showAddMenus, setShowAddMenus] = useState({});
  const [uploadingImages, setUploadingImages] = useState({});
  const fileInputRefs = useRef({});

  // Update parent ketika blocks berubah
  const updateBlocks = (newBlocks) => {
    setBlocks(newBlocks);
    onChange(JSON.stringify(newBlocks));
  };

  // Tambah block baru
  const addBlock = (type, index) => {
    const newBlock = {
      id: Date.now(),
      type,
      content: type === 'image' ? { src: '', alt: '', caption: '' } : ''
    };
    
    const newBlocks = [...blocks];
    newBlocks.splice(index + 1, 0, newBlock);
    updateBlocks(newBlocks);
    
    // Reset add menu state
    setShowAddMenus({});
  };

  // Hapus block
  const removeBlock = (index) => {
    if (blocks.length === 1) return; // Jangan hapus jika hanya ada 1 block
    
    const newBlocks = blocks.filter((_, i) => i !== index);
    updateBlocks(newBlocks);
  };

  // Update content block
  const updateBlockContent = (index, content) => {
    const newBlocks = [...blocks];
    newBlocks[index].content = content;
    updateBlocks(newBlocks);
  };

  // Pindah block
  const moveBlock = (index, direction) => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === blocks.length - 1)
    ) return;

    const newBlocks = [...blocks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];
    updateBlocks(newBlocks);
  };

  // Handle upload gambar
  const handleImageUpload = async (file, blockIndex) => {
    if (!file) return;

    // Validasi file
    if (!file.type.startsWith('image/')) {
      alert('File harus berupa gambar');
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      alert('Ukuran file terlalu besar. Maksimal 50MB');
      return;
    }

    try {
      setUploadingImages(prev => ({ ...prev, [blockIndex]: true }));

      let fileToUpload = file;
      
      // Compress jika file lebih dari 2MB
      if (file.size > 2 * 1024 * 1024) {
        fileToUpload = await compressImage(file);
      }

      const result = await uploadImageToImghippo(fileToUpload, `Block Image ${blockIndex + 1}`);

      const newBlocks = [...blocks];
      newBlocks[blockIndex].content = {
        src: result.url,
        alt: file.name,
        caption: ''
      };
      updateBlocks(newBlocks);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Gagal upload gambar: ' + error.message);
    } finally {
      setUploadingImages(prev => ({ ...prev, [blockIndex]: false }));
    }
  };

  // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, blockIndex) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleImageUpload(files[0], blockIndex);
    }
  };

  const AddBlockMenu = ({ onAdd, onClose }) => (
    <div className="absolute z-10 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-2">
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => { onAdd('paragraph'); onClose(); }}
          className="flex items-center gap-2 p-3 text-left hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Type size={16} />
          <span className="text-sm">Paragraf</span>
        </button>
        <button
          onClick={() => { onAdd('heading1'); onClose(); }}
          className="flex items-center gap-2 p-3 text-left hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Heading1 size={16} />
          <span className="text-sm">Heading 1</span>
        </button>
        <button
          onClick={() => { onAdd('heading2'); onClose(); }}
          className="flex items-center gap-2 p-3 text-left hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Heading2 size={16} />
          <span className="text-sm">Heading 2</span>
        </button>
        <button
          onClick={() => { onAdd('image'); onClose(); }}
          className="flex items-center gap-2 p-3 text-left hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ImageIcon size={16} />
          <span className="text-sm">Gambar</span>
        </button>
        <button
          onClick={() => { onAdd('unordered-list'); onClose(); }}
          className="flex items-center gap-2 p-3 text-left hover:bg-gray-100 rounded-lg transition-colors"
        >
          <List size={16} />
          <span className="text-sm">List (•)</span>
        </button>
        <button
          onClick={() => { onAdd('ordered-list'); onClose(); }}
          className="flex items-center gap-2 p-3 text-left hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ListOrdered size={16} />
          <span className="text-sm">List (1.)</span>
        </button>
      </div>
    </div>
  );

  const BlockControls = ({ index, onMove, onRemove }) => (
    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
      <button
        onClick={() => onMove(index, 'up')}
        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
        disabled={index === 0}
        title="Pindah ke atas"
      >
        <MoveUp size={14} />
      </button>
      <button
        onClick={() => onMove(index, 'down')}
        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
        disabled={index === blocks.length - 1}
        title="Pindah ke bawah"
      >
        <MoveDown size={14} />
      </button>
      <button
        onClick={() => onRemove(index)}
        className="p-1 text-gray-400 hover:text-red-600 disabled:opacity-30"
        disabled={blocks.length === 1}
        title="Hapus block"
      >
        <X size={14} />
      </button>
    </div>
  );

  const renderBlock = (block, index) => {
    const showAddMenu = showAddMenus[index] || false;
    const setShowAddMenu = (show) => {
      setShowAddMenus(prev => ({ ...prev, [index]: show }));
    };
    
    const isUploading = uploadingImages[index] || false;

    return (
      <div key={block.id} className="group relative">
        <div className="flex items-start gap-2">
          <div className="flex-1">
            {/* Render block berdasarkan type */}
            {block.type === 'paragraph' && (
              <textarea
                value={block.content}
                onChange={(e) => updateBlockContent(index, e.target.value)}
                placeholder={index === 0 ? placeholder : "Tulis paragraf..."}
                className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows="3"
                style={{ minHeight: '80px' }}
              />
            )}

            {block.type === 'heading1' && (
              <input
                type="text"
                value={block.content}
                onChange={(e) => updateBlockContent(index, e.target.value)}
                placeholder="Heading 1..."
                className="w-full p-3 text-2xl font-bold border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            )}

            {block.type === 'heading2' && (
              <input
                type="text"
                value={block.content}
                onChange={(e) => updateBlockContent(index, e.target.value)}
                placeholder="Heading 2..."
                className="w-full p-3 text-xl font-semibold border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            )}

            {block.type === 'image' && (
              <div className="border border-gray-200 rounded-lg p-4">
                {block.content.src ? (
                  <div className="space-y-3">
                    <div className="relative w-full max-w-md mx-auto">
                      <Image
                        src={block.content.src}
                        alt={block.content.alt || "Uploaded image"}
                        width={500}
                        height={300}
                        className="w-full h-auto rounded-lg"
                        style={{ objectFit: 'contain' }}
                      />
                    </div>
                    <input
                      type="text"
                      value={block.content.caption}
                      onChange={(e) => updateBlockContent(index, { ...block.content, caption: e.target.value })}
                      placeholder="Caption gambar (opsional)..."
                      className="w-full p-2 text-sm border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => updateBlockContent(index, { src: '', alt: '', caption: '' })}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Hapus gambar
                    </button>
                  </div>
                ) : (
                  <div 
                    className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index)}
                    onClick={() => !isUploading && fileInputRefs.current[index]?.click()}
                  >
                    {isUploading ? (
                      <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                        <p className="text-gray-600">Mengupload gambar...</p>
                      </div>
                    ) : (
                      <>
                        <Upload size={48} className="mx-auto text-gray-400 mb-4" />
                        <input
                          ref={(el) => fileInputRefs.current[index] = el}
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) handleImageUpload(file, index);
                          }}
                          className="hidden"
                        />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          Tambahkan Gambar
                        </h3>
                        <p className="text-sm text-gray-600">
                          Klik untuk upload atau drag & drop gambar
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          PNG, JPG, GIF hingga 50MB
                        </p>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}

            {(block.type === 'unordered-list' || block.type === 'ordered-list') && (
              <div className="border border-gray-200 rounded-lg p-3">
                <textarea
                  value={block.content}
                  onChange={(e) => updateBlockContent(index, e.target.value)}
                  placeholder={`Tulis list item (pisahkan dengan enter)...\nContoh:\nItem 1\nItem 2\nItem 3`}
                  className="w-full resize-none focus:outline-none"
                  rows="4"
                />
                <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                  <strong>Preview:</strong>
                  <div className="mt-1">
                    {block.type === 'unordered-list' ? (
                      <ul className="list-disc list-inside">
                        {block.content.split('\n').filter(item => item.trim()).map((item, i) => (
                          <li key={i}>{item.trim()}</li>
                        ))}
                      </ul>
                    ) : (
                      <ol className="list-decimal list-inside">
                        {block.content.split('\n').filter(item => item.trim()).map((item, i) => (
                          <li key={i}>{item.trim()}</li>
                        ))}
                      </ol>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Block Controls */}
          <BlockControls
            index={index}
            onMove={moveBlock}
            onRemove={removeBlock}
          />
        </div>

        {/* Add Block Button */}
        <div className="relative mt-4">
          <div className="flex justify-center">
            <button
              onClick={() => setShowAddMenu(!showAddMenu)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
            >
              <Plus size={16} />
              Tambah elemen
            </button>
          </div>

          {showAddMenu && (
            <AddBlockMenu
              onAdd={(type) => addBlock(type, index)}
              onClose={() => setShowAddMenu(false)}
            />
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {blocks.map((block, index) => renderBlock(block, index))}
    </div>
  );
};

export default BlockEditor;
