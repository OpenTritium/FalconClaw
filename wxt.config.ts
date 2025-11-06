import { defineConfig } from 'wxt'
import UnoCSS from 'unocss/vite'

export default defineConfig({
  modules: ['@wxt-dev/module-vue', '@wxt-dev/i18n/module'],
  manifest: {
    name: '__MSG_extensionName__',
    description: '__MSG_extensionDescription__',
    permissions: ['downloads', 'webRequest'],
    host_permissions: ['<all_urls>'],
    default_locale: 'en',
  },
  vite: _ => ({
    plugins: [UnoCSS()],
    build: {
      minify: true,
      report: true,
    },
  }),
})
