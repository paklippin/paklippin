'use client';
import { create } from 'zustand';

export type StoreSettings = {
  shipping_threshold: number;
  delivery_fee: number;
  whatsapp: string;
  easypaisa_number: string;
  easypaisa_name: string;
  store_name: string;
  store_phone: string;
  store_email: string;
  store_address: string;
};

const DEFAULTS: StoreSettings = {
  shipping_threshold: 5000,
  delivery_fee: 300,
  whatsapp: '923397579547',
  easypaisa_number: '0339 7910131',
  easypaisa_name: 'Shouaib Imran',
  store_name: 'PAKLIPPIN',
  store_phone: '+92 339 7579547',
  store_email: 'info@paklippin.com',
  store_address: 'Hajvari Rd, Faisalabad',
};

type SettingsState = {
  settings: StoreSettings;
  loaded: boolean;
  load: () => Promise<void>;
};

export const useSettings = create<SettingsState>((set, get) => ({
  settings: DEFAULTS,
  loaded: false,
  load: async () => {
    if (get().loaded) return;
    try {
      const res = await fetch('/api/settings', { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        const s = json.settings || {};
        set({
          settings: {
            shipping_threshold: Number(s.shipping_threshold) || DEFAULTS.shipping_threshold,
            delivery_fee: Number(s.delivery_fee) || DEFAULTS.delivery_fee,
            whatsapp: s.whatsapp || DEFAULTS.whatsapp,
            easypaisa_number: s.easypaisa_number || DEFAULTS.easypaisa_number,
            easypaisa_name: s.easypaisa_name || DEFAULTS.easypaisa_name,
            store_name: s.store_name || DEFAULTS.store_name,
            store_phone: s.store_phone || DEFAULTS.store_phone,
            store_email: s.store_email || DEFAULTS.store_email,
            store_address: s.store_address || DEFAULTS.store_address,
          },
          loaded: true,
        });
        return;
      }
    } catch {}
    set({ loaded: true });
  },
}));
