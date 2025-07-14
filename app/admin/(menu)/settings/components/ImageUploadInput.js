"use client";
import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { uploadImageToImghippo, validateImageFile, generateUniqueFilename } from "../utils/imghippo";

export default function ImageUploadInput({ 
  value, 
  onChange, 
  label = "Background Image", 
  placeholder = "Pilih gambar atau masukkan URL...",
  accept = "image/*"
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef(null);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError("");

    try {
      // Validate file
      validateImageFile(file);
      
      // Generate unique filename
      const uniqueFilename = generateUniqueFilename(file.name, 'background');
      
      // Upload to ImgHippo
      const result = await uploadImageToImghippo(file, uniqueFilename);
      
      // Update parent component
      onChange(result.url);
      
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError(error.message || "Gagal mengupload gambar");
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleUrlChange = (e) => {
    onChange(e.target.value);
    setUploadError("");
  };

  const handleClearImage = () => {
    onChange("");
    setUploadError("");
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      
      {/* URL Input */}
      <div className="relative">
        <input
          type="url"
          value={value}
          onChange={handleUrlChange}
          placeholder={placeholder}
          className="w-full px-3 py-2 pr-24 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
        />
        
        {/* Clear button */}
        {value && (
          <button
            type="button"
            onClick={handleClearImage}
            className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        
        {/* Upload button */}
        <button
          type="button"
          onClick={handleFileSelect}
          disabled={isUploading}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
        >
          {isUploading ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <Upload className="h-3 w-3" />
          )}
          {isUploading ? "Uploading..." : "Upload"}
        </button>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Upload error */}
      {uploadError && (
        <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded p-2">
          {uploadError}
        </div>
      )}

      {/* Image preview */}
      {value && (
        <div className="relative">
          <div className="text-sm text-gray-600 mb-2">Preview:</div>
          <div className="relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden border">
            <Image
              src={value}
              alt="Background preview"
              fill
              className="object-cover"
              onError={() => {
                // Handle error by showing fallback
                console.log("Image failed to load:", value);
              }}
              unoptimized={true}
            />
          </div>
        </div>
      )}

      {/* Upload info */}
      <div className="text-xs text-gray-500">
        Anda dapat mengunggah gambar (JPEG, PNG, GIF, WebP) maksimal 5MB atau memasukkan URL gambar.
      </div>
    </div>
  );
}
