"use client";

import { Dialog } from "@/components/admin/Dialog";

export default function DeleteModal({ item, onConfirm, onCancel }) {
  return (
    <Dialog
      isOpen={true}
      onClose={onCancel}
      title="Hapus Data Usaha"
      message={`Apakah Anda yakin ingin menghapus data usaha "${item?.nama || 'tanpa nama'}"?`}
      type="error"
      showCancelButton={true}
      confirmText="Hapus"
      cancelText="Batal"
      onConfirm={onConfirm}
    />
  );
}
