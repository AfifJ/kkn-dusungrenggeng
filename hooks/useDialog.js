"use client";
import { useState, useCallback } from "react";

export const useDialog = () => {
  const [dialog, setDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
    showCancelButton: true,
    confirmText: "OK",
    cancelText: "Batal",
    onConfirm: null
  });

  const openDialog = useCallback((options) => {
    setDialog({
      isOpen: true,
      title: options.title || "Konfirmasi",
      message: options.message || "",
      type: options.type || "info",
      showCancelButton: options.showCancelButton !== false,
      confirmText: options.confirmText || "OK",
      cancelText: options.cancelText || "Batal",
      onConfirm: options.onConfirm || null
    });
  }, []);

  const closeDialog = useCallback(() => {
    setDialog(prev => ({ ...prev, isOpen: false }));
  }, []);

  const confirm = useCallback((message, onConfirm, options = {}) => {
    openDialog({
      title: options.title || "Konfirmasi",
      message,
      type: "warning",
      confirmText: options.confirmText || "Ya",
      cancelText: options.cancelText || "Batal",
      onConfirm: () => {
        onConfirm();
        closeDialog();
      },
      ...options
    });
  }, [openDialog, closeDialog]);

  const alert = useCallback((message, type = "info", options = {}) => {
    openDialog({
      title: options.title || (type === "error" ? "Error" : type === "success" ? "Berhasil" : "Informasi"),
      message,
      type,
      showCancelButton: false,
      confirmText: options.confirmText || "OK",
      ...options
    });
  }, [openDialog]);

  return {
    dialog,
    openDialog,
    closeDialog,
    confirm,
    alert
  };
};
