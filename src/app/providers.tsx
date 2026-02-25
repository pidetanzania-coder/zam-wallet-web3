"use client";

import { useEffect, useState } from "react";
import { config, queryClient } from "@/config";
import { AlchemyClientState } from "@account-kit/core";
import { AlchemyAccountProvider } from "@account-kit/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/context/ThemeProvider";

const ONESIGNAL_APP_ID = "79d6628a-ff82-42c5-8ae3-79493d60a1fe";

export function Providers(
  props: PropsWithChildren<{ initialState?: AlchemyClientState }>
) {
  const [isOneSignalReady, setIsOneSignalReady] = useState(false);

  useEffect(() => {
    // Initialize OneSignal
    const initOneSignal = async () => {
      if (typeof window !== "undefined" && !("OneSignal" in window)) {
        // Load OneSignal script
        const script = document.createElement("script");
        script.src = "https://cdn.onesignal.com/sdks/OneSignalSDK.js";
        script.async = true;
        script.onload = () => {
          if (window.OneSignal) {
            window.OneSignal.init({
              appId: ONESIGNAL_APP_ID,
              allowLocalhostAsSecureOrigin: true,
              welcomeNotification: {
                disable: true,
              },
            }).then(() => {
              setIsOneSignalReady(true);
              console.log("OneSignal initialized successfully");
            });
          }
        };
        document.head.appendChild(script);
      }
    };

    initOneSignal();
  }, []);

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AlchemyAccountProvider
          config={config}
          queryClient={queryClient}
          initialState={props.initialState}
        >
          {props.children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              className: "!bg-white dark:!bg-slate-800 !text-slate-900 dark:!text-slate-100 !border !border-slate-200 dark:!border-slate-700 !rounded-xl !shadow-lg",
              success: {
                iconTheme: { primary: "#6366f1", secondary: "#fff" },
              },
            }}
          />
        </AlchemyAccountProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

// OneSignal utility functions
export async function subscribeToNotifications(): Promise<boolean> {
  if (window.OneSignal) {
    try {
      const permission = await window.OneSignal.Notifications.permission;
      if (permission === "granted") {
        const userId = await window.OneSignal.User.addAlias("external_id", 
          Math.random().toString(36).substring(7)
        );
        return true;
      } else if (permission === "default") {
        const permission = await window.OneSignal.Notifications.requestPermission();
        return permission === "granted";
      }
    } catch (error) {
      console.error("Error subscribing to notifications:", error);
    }
  }
  return false;
}

export async function unsubscribeFromNotifications(): Promise<boolean> {
  if (window.OneSignal) {
    try {
      await window.OneSignal.User.remove();
      return true;
    } catch (error) {
      console.error("Error unsubscribing from notifications:", error);
    }
  }
  return false;
}

export function isNotificationSupported(): boolean {
  return typeof window !== "undefined" && "OneSignal" in window;
}
