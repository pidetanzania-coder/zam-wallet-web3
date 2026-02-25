"use client";

import { useEffect, useRef, useCallback } from "react";

// Simple notification hook that doesn't require account context
// This can be enabled later when the account context is properly set up
export function useTransactionNotifications() {
  const isEnabledRef = useRef(true);

  // Enable/disable notifications
  const setNotificationsEnabled = useCallback((enabled: boolean) => {
    isEnabledRef.current = enabled;
  }, []);

  // Request notification permission on mount
  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission();
      }
    }
  }, []);

  return { setNotificationsEnabled };
}
