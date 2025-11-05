import { defineConfig, presetAttributify, presetIcons, presetTypography, presetWebFonts, presetWind4 } from 'unocss'

export default defineConfig({
  shortcuts: [],
  presets: [
    presetWind4(),
    presetAttributify(),
    presetTypography(),
    presetWebFonts(),
    presetIcons({
      scale: 1.2,
      warn: true,
    }),
  ],
  // 对于扩展来说，有时需要将一些动态使用的类名加入安全列表，以防被 treeshake 掉
  // 比如你通过 js 动态添加 'i-mdi-check' 这个类，构建时 UnoCSS 看不到它就会忽略
  safelist: ['i-mdi-check', 'i-mdi-close'],
})
