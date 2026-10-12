"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { StoreSettingsMap, DEFAULT_STORE_SETTINGS } from "@/lib/settings";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

interface SettingsContextValue {
  settings: StoreSettingsMap;
  getWhatsAppUrl: (message: string) => string;
  whatsappNumber: string;
  storeName: string;
}

const SettingsContext = createContext<SettingsContextValue>({
  settings: DEFAULT_STORE_SETTINGS,
  getWhatsAppUrl: (message: string) => buildWhatsAppUrl(message, DEFAULT_STORE_SETTINGS.whatsapp_number),
  whatsappNumber: DEFAULT_STORE_SETTINGS.whatsapp_number,
  storeName: DEFAULT_STORE_SETTINGS.store_name,
});

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

  // Synchronize on mount and listen for storage/revalidation updates
  useEffect(() => {
    if (initialSettings) {
      setSettings(initialSettings);
    }
  }, [initialSettings]);

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
