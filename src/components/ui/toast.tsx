/**
 * Toast Component
 * 
 * Uses Sonner toast library for notifications
 * Shows success, error, and info messages
 */

import { Toaster } from "sonner";

export function ToastProvider() {
  return (
    <Toaster
      theme="system"
      position="bottom-right"
      richColors
      closeButton
    />
  );
}
