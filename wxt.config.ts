import { defineConfig } from 'wxt'
import UnoCSS from 'unocss/vite'

export default defineConfig({
  modules: ['@wxt-dev/module-vue', '@wxt-dev/i18n/module'],
  manifest: {
    name: '__MSG_extensionName__',
    description: '__MSG_extensionDescription__',
    permissions: ['downloads', 'webRequest', 'nativeMessaging'],
    host_permissions: ['<all_urls>'],
    default_locale: 'en',
  },
  vite: env => {
    const isProduction = env.mode === 'production'
    return {
      plugins: [UnoCSS()],
      // build: {
      //   minify: isProduction ? 'terser' : false,
      //   terserOptions: {
      //     ecma: 2020,
      //     compress: {
      //       drop_console: true,
      //       passes: 3,
      //     },
      //     mangle: {
      //       toplevel: true,
      //     },
      //     format: {
      //       quote_style: 1,
      //       comments: false,
      //     },
      //   },
      // },
    }
  },
})
