import { useState, useCallback } from "react";

type ToastType = "success" | "error";

type ToastData = {
  id: number;
  type: ToastType;
  message: string;
  isVisible: boolean;
};

export function useToast() {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const showToast = useCallback((type: ToastType, message: string) => {
    const id = Date.now();
    const newToast: ToastData = {
      id,
      type,
      message,
      isVisible: true,
    };

    setToasts((prev) => [...prev, newToast]);
    return id;
  }, []);

  const hideToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showSuccess = useCallback(
    (message: string) => {
      return showToast("success", message);
    },
    [showToast]
  );

  const showError = useCallback(
    (message: string) => {
      return showToast("error", message);
    },
    [showToast]
  );

  return {
    toasts,
    showToast,
    hideToast,
    showSuccess,
    showError,
  };
}
