"use client";
import { X, AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react";

const Dialog = ({
  isOpen,
  onClose,
  title,
  message,
  type = "info", // info, success, warning, error
  showCancelButton = true,
  confirmText = "OK",
  cancelText = "Batal",
  onConfirm,
  children
}) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getStyles = () => {
    switch (type) {
      case "success":
        return {
          iconBg: "bg-green-50",
          confirmButton: "bg-green-600 hover:bg-green-700 focus:ring-green-500 text-white",
          titleColor: "text-gray-900"
        };
      case "warning":
        return {
          iconBg: "bg-amber-50",
          confirmButton: "bg-amber-600 hover:bg-amber-700 focus:ring-amber-500 text-white",
          titleColor: "text-gray-900"
        };
      case "error":
        return {
          iconBg: "bg-red-50",
          confirmButton: "bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white",
          titleColor: "text-gray-900"
        };
      default:
        return {
          iconBg: "bg-blue-50",
          confirmButton: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 text-white",
          titleColor: "text-gray-900"
        };
    }
  };

  const styles = getStyles();

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div 
        className="bg-white rounded-xl shadow-2xl max-w-md w-full transform transition-all duration-200 scale-100 opacity-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className={`p-2 rounded-full ${styles.iconBg}`}>
                {getIcon()}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className={`text-lg font-semibold leading-6 ${styles.titleColor}`}>
                  {title}
                </h3>
                {message && (
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                    {message}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="ml-4 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        {children && (
          <div className="px-6 pb-4">
            {children}
          </div>
        )}

        {/* Footer */}
        <div className="px-6 pb-6 pt-2 flex justify-end space-x-3">
          {showCancelButton && (
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            >
              {cancelText}
            </button>
          )}
          <button
            onClick={() => {
              if (onConfirm) {
                onConfirm();
              } else {
                onClose();
              }
            }}
            className={`px-4 py-2 text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all ${styles.confirmButton}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dialog;
