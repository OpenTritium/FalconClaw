import { defineConfig, presetAttributify, presetIcons, presetTypography, presetWebFonts, presetWind4 } from 'unocss'
import { presetAnimations } from 'unocss-preset-animations'

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
  rules: [['animate-shine', { animation: 'shine-moving 2s linear infinite' }]],
  presets: [
    presetWind4(),
    presetAnimations(),
    presetAttributify(),
    presetTypography(),
    presetWebFonts(),
    presetIcons({
      scale: 1.2,
      warn: true,
    }),
  ],
  safelist: ['i-mdi-check', 'i-mdi-close'],
})
