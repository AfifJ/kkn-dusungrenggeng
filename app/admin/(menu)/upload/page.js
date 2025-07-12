"use client";

import React, { useState } from "react";

const ImghippoUploader = () => {
  // State untuk fitur upload
  const [selectedFile, setSelectedFile] = useState(null);
  const [title, setTitle] = useState("");
  const [uploadData, setUploadData] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  // State untuk fitur delete
  const [deleteUrl, setDeleteUrl] = useState("");
  const [deleteData, setDeleteData] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  // Konfigurasi API
  const API_KEY = process.env.NEXT_PUBLIC_IMGHIPPO_API_KEY;
  const UPLOAD_ENDPOINT = "https://api.imghippo.com/v1/upload";
  const DELETE_ENDPOINT = "https://api.imghippo.com/v1/delete";

  // Handler untuk upload gambar
  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadError("Silakan pilih gambar terlebih dahulu");
      return;
    }

    setUploadLoading(true);
    setUploadError("");

    const formData = new FormData();
    formData.append("api_key", API_KEY);
    formData.append("file", selectedFile);
    if (title) formData.append("title", title);

    try {
      const response = await fetch(UPLOAD_ENDPOINT, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setUploadData(result.data);
      } else {
        setUploadError(result.message || "Upload gambar gagal");
      }
    } catch (err) {
      setUploadError("Terjadi kesalahan: " + err.message);
    } finally {
      setUploadLoading(false);
    }
  };

  // Handler untuk hapus gambar
  const handleDelete = async () => {
    if (!deleteUrl) {
      setDeleteError("Silakan masukkan URL gambar");
      return;
    }

    setDeleteLoading(true);
    setDeleteError("");

    const payload = {
      api_key: API_KEY,
      url: deleteUrl,
    };

    try {
      const response = await fetch(DELETE_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      let result;
      const contentType = response.headers.get("content-type");
      
      if (contentType && contentType.includes("application/json")) {
        result = await response.json();
      } else {
        const text = await response.text();
        result = { status: response.status, message: text };
      }

      if (result.status === 200 || response.ok) {
        setDeleteData(result);
      } else {
        setDeleteError(result.message || "Penghapusan gambar gagal");
      }
    } catch (err) {
      setDeleteError("Terjadi kesalahan: " + err.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "20px auto",
        fontFamily: "sans-serif",
      }}
    >
      <h1 style={{ textAlign: "center", color: "#2c3e50" }}>Imghippo API v1</h1>

      {/* Bagian Upload Gambar */}
      <div
        style={{
          background: "#f8f9fa",
          borderRadius: "8px",
          padding: "20px",
          marginBottom: "30px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
        }}
      >
        <h2
          style={{
            color: "#2c3e50",
            borderBottom: "2px solid #3498db",
            paddingBottom: "10px",
          }}
        >
          Unggah Gambar
        </h2>

        <div style={{ margin: "15px 0" }}>
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "bold",
            }}
          >
            Pilih Gambar (maks. 50MB)
          </label>
          <input
            type="file"
            onChange={(e) => setSelectedFile(e.target.files[0])}
            disabled={uploadLoading}
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div style={{ margin: "15px 0" }}>
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "bold",
            }}
          >
            Judul (opsional)
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Masukkan judul gambar"
            disabled={uploadLoading}
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <button
          onClick={handleUpload}
          disabled={uploadLoading || !selectedFile}
          style={{
            width: "100%",
            padding: "12px",
            background: "#3498db",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "bold",
            marginTop: "10px",
            opacity: uploadLoading || !selectedFile ? 0.7 : 1,
          }}
        >
          {uploadLoading ? "Mengunggah..." : "Unggah Gambar"}
        </button>

        {uploadError && (
          <div
            style={{
              color: "#e74c3c",
              padding: "10px",
              marginTop: "15px",
              background: "#fadbd8",
              borderRadius: "4px",
            }}
          >
            {uploadError}
          </div>
        )}

        {uploadData && (
          <div
            style={{
              marginTop: "20px",
              padding: "15px",
              background: "#eafaf1",
              borderRadius: "4px",
            }}
          >
            <h3 style={{ color: "#27ae60" }}>✔ Berhasil Diunggah!</h3>
            <div style={{ display: "flex", marginTop: "15px", gap: "20px" }}>
              <div style={{ flex: 1 }}>
                <img
                  src={uploadData.url}
                  alt={uploadData.title}
                  style={{
                    maxWidth: "100%",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <p>
                  <strong>Judul:</strong> {uploadData.title}
                </p>
                <p>
                  <strong>Ukuran:</strong> {(uploadData.size / 1024).toFixed(2)}{" "}
                  KB
                </p>
                <p>
                  <strong>Format:</strong> {uploadData.extension}
                </p>
                <p>
                  <strong>Tanggal:</strong>{" "}
                  {new Date(uploadData.created_at).toLocaleString()}
                </p>
                <p>
                  <strong>URL:</strong>{" "}
                  <a
                    href={uploadData.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#2980b9", wordBreak: "break-all" }}
                  >
                    {uploadData.url}
                  </a>
                </p>
                <p>
                  <strong>URL Viewer:</strong>{" "}
                  <a
                    href={uploadData.view_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#2980b9", wordBreak: "break-all" }}
                  >
                    {uploadData.view_url}
                  </a>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bagian Hapus Gambar */}
      <div
        style={{
          background: "#f8f9fa",
          borderRadius: "8px",
          padding: "20px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
        }}
      >
        <h2
          style={{
            color: "#2c3e50",
            borderBottom: "2px solid #e74c3c",
            paddingBottom: "10px",
          }}
        >
          Hapus Gambar
        </h2>

        <div style={{ margin: "15px 0" }}>
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "bold",
            }}
          >
            URL Gambar yang Akan Dihapus
          </label>
          <input
            type="text"
            value={deleteUrl}
            onChange={(e) => setDeleteUrl(e.target.value)}
            placeholder="https://i.imghippo.com/files/00a001111.jpg"
            disabled={deleteLoading}
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <button
          onClick={handleDelete}
          disabled={deleteLoading || !deleteUrl}
          style={{
            width: "100%",
            padding: "12px",
            background: "#e74c3c",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "bold",
            marginTop: "10px",
            opacity: deleteLoading || !deleteUrl ? 0.7 : 1,
          }}
        >
          {deleteLoading ? "Menghapus..." : "Hapus Gambar"}
        </button>

        {deleteError && (
          <div
            style={{
              color: "#e74c3c",
              padding: "10px",
              marginTop: "15px",
              background: "#fadbd8",
              borderRadius: "4px",
            }}
          >
            {deleteError}
          </div>
        )}

        {deleteData && (
          <div
            style={{
              marginTop: "20px",
              padding: "15px",
              background: "#fdebd0",
              borderRadius: "4px",
            }}
          >
            <h3 style={{ color: "#f39c12" }}>🗑️ Gambar Berhasil Dihapus!</h3>
            <p>
              <strong>Status:</strong> {deleteData.status}
            </p>
            <p>
              <strong>Pesan:</strong> {deleteData.message}
            </p>
            <p>
              <strong>URL yang Dihapus:</strong>{" "}
              <a
                href={deleteData.deleted_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#2980b9", wordBreak: "break-all" }}
              >
                {deleteData.deleted_url}
              </a>
            </p>
          </div>
        )}
      </div>

      <div
        style={{
          marginTop: "30px",
          textAlign: "center",
          color: "#7f8c8d",
          fontSize: "14px",
          borderTop: "1px solid #ecf0f1",
          paddingTop: "15px",
        }}
      >
        Menggunakan Imghippo API v1 | API Key: {API_KEY}
      </div>
    </div>
  );
};

export default ImghippoUploader;
