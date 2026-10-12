"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { StoreSettingsMap, DEFAULT_STORE_SETTINGS } from "@/lib/settings";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

interface SettingsContextValue {
  settings: StoreSettingsMap;
  getWhatsAppUrl: (message: string) => string;
  whatsappNumber: string;
  storeName: string;
  refreshSettings: () => Promise<void>;
  updateSettings: (newSettings: Partial<StoreSettingsMap>) => void;
}

const SettingsContext = createContext<SettingsContextValue>({
  settings: DEFAULT_STORE_SETTINGS,
  getWhatsAppUrl: (message: string) => buildWhatsAppUrl(message, DEFAULT_STORE_SETTINGS.whatsapp_number),
  whatsappNumber: DEFAULT_STORE_SETTINGS.whatsapp_number,
  storeName: DEFAULT_STORE_SETTINGS.store_name,
  refreshSettings: async () => {},
  updateSettings: () => {},
});

const FONT_MAP: Record<string, string> = {
  bebas: "var(--font-bebas), 'Bebas Neue', Impact, sans-serif",
  oswald: "var(--font-oswald), 'Oswald', sans-serif",
  inter: "var(--font-inter), 'Inter', sans-serif",
  montserrat: "var(--font-montserrat), 'Montserrat', sans-serif",
  impact: "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif",
};

export function applyThemeStyles(s: Partial<StoreSettingsMap>) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;

  if (s.theme_primary_color) {
    root.style.setProperty("--brand-primary", s.theme_primary_color);
    root.style.setProperty("--brand-red", s.theme_primary_color);
  }
  if (s.theme_text_color) {
    root.style.setProperty("--text-primary", s.theme_text_color);
  }
  if (s.theme_muted_text_color) {
    root.style.setProperty("--text-secondary", s.theme_muted_text_color);
  }
  if (s.theme_heading_font) {
    const fontVal = FONT_MAP[s.theme_heading_font] || FONT_MAP.bebas;
    root.style.setProperty("--font-display-custom", fontVal);
  }
  if (s.theme_heading_style) {
    root.style.setProperty("--heading-style-custom", s.theme_heading_style);
  }
}

export function SettingsProvider({
  children,
  initialSettings,
}: {
  children: React.ReactNode;
  initialSettings?: StoreSettingsMap;
}) {
  const [settings, setSettings] = useState<StoreSettingsMap>(
    initialSettings || DEFAULT_STORE_SETTINGS
  );

  const refreshSettings = useCallback(async () => {
    try {
      const res = await fetch("/api/settings", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (data.settings) {
          setSettings(data.settings);
          applyThemeStyles(data.settings);
        }
      }
    } catch {
      // ignore network errors
    }
  }, []);

  const updateSettings = useCallback((newSettings: Partial<StoreSettingsMap>) => {
    setSettings((prev) => {
      const merged = { ...prev, ...newSettings };
      applyThemeStyles(merged);
      try {
        localStorage.setItem("tfs_settings_cache", JSON.stringify(merged));
        window.dispatchEvent(new CustomEvent("tfs:settings-updated", { detail: merged }));
        const bc = new BroadcastChannel("tfs_settings_sync");
        bc.postMessage({ settings: merged });
        bc.close();
      } catch {
        // ignore storage/channel failures
      }
      return merged;
    });
  }, []);

  // Sync when initialSettings from server changes
  useEffect(() => {
    if (initialSettings) {
      setSettings(initialSettings);
      applyThemeStyles(initialSettings);
      try {
        localStorage.setItem("tfs_settings_cache", JSON.stringify(initialSettings));
      } catch {}
    }
  }, [initialSettings]);

  // Set up real-time cross-tab and in-page listeners
  useEffect(() => {
    applyThemeStyles(settings);

    // If initialSettings from server is provided, keep it authoritative and sync to localStorage
    if (initialSettings) {
      try {
        localStorage.setItem("tfs_settings_cache", JSON.stringify(initialSettings));
      } catch {}
    } else {
      // Fallback to localStorage cache only when no server initialSettings was provided
      try {
        const cached = localStorage.getItem("tfs_settings_cache");
        if (cached) {
          const parsed = JSON.parse(cached);
          setSettings(parsed);
          applyThemeStyles(parsed);
        }
      } catch {}
    }

    // Fetch fresh settings on mount
    refreshSettings();

    // Listen to local event
    const handleLocalUpdate = (e: any) => {
      if (e?.detail) {
        setSettings(e.detail);
        applyThemeStyles(e.detail);
      } else {
        refreshSettings();
      }
    };
    window.addEventListener("tfs:settings-updated", handleLocalUpdate);

    // Listen to cross-tab storage changes
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "tfs_settings_cache" && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setSettings(parsed);
          applyThemeStyles(parsed);
        } catch {}
      }
    };
    window.addEventListener("storage", handleStorage);

    // Listen to BroadcastChannel across browser tabs
    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel("tfs_settings_sync");
      bc.onmessage = (event) => {
        if (event.data?.settings) {
          setSettings(event.data.settings);
          applyThemeStyles(event.data.settings);
        } else {
          refreshSettings();
        }
      };
    } catch {}

    return () => {
      window.removeEventListener("tfs:settings-updated", handleLocalUpdate);
      window.removeEventListener("storage", handleStorage);
      if (bc) bc.close();
    };
  }, [refreshSettings]);

  const whatsappNumber = settings.whatsapp_number || DEFAULT_STORE_SETTINGS.whatsapp_number;
  const storeName = settings.store_name || DEFAULT_STORE_SETTINGS.store_name;

  const getWhatsAppUrl = (message: string) => {
    return buildWhatsAppUrl(message, whatsappNumber);
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        getWhatsAppUrl,
        whatsappNumber,
        storeName,
        refreshSettings,
        updateSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
