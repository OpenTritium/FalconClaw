import { defineConfig, presetAttributify, presetIcons, presetWebFonts, presetWind4 } from 'unocss'

export default defineConfig({
  shortcuts: {
    'btn-action': 'text-lg text-gray-600 hover:opacity-75 cursor-pointer transition-opacity',
  },
  theme: {
    colors: {
      progress: {
        running: '#4eb2ffff',
        paused: '#d7dde9ff',
        completed: '#2adc6bff',
      },
      status: {
        completed: '#18cd7cff',
        failed: '#da2222ff',
        cancelled: '#d77417ff',
      },
    },
  },
  preflights: [
    {
      getCSS: ({}) => `
        @keyframes shine-moving {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `,
    },
  ],
  rules: [['animate-shine', { animation: 'shine-moving 0.86s linear infinite' }]],
  presets: [
    presetWind4(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      warn: true,
      collections: {
        mdi: () => import('@iconify-json/mdi/icons.json').then(i => i.default),
      },
    }),
    presetWebFonts({
      provider: 'none',
      fonts: {
        sans: [
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          '"Noto Sans"',
          '"PingFang SC"',
          '"Hiragino Sans GB"',
          '"Microsoft YaHei UI"',
          '"Microsoft YaHei"',
          '"Source Han Sans SC"',
          '"Noto Sans CJK SC"',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
      },
    }),
  ],
})
