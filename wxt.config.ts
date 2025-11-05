import { defineConfig } from 'wxt';
import UnoCSS from 'unocss/vite';

export default defineConfig({
  modules: ['@wxt-dev/module-vue'],
  manifest: {
    name: 'Falcon Fetcher',
    permissions: [
      'downloads',
      'webRequest',
      '<all_urls>',
    ],
  },
  vite: (_) => ({
    plugins: [
      UnoCSS(),
    ],
  }),
});