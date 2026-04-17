import mdx from '@astrojs/mdx'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'
import AutoImport from 'astro-auto-import'
import icon from 'astro-icon'

export default defineConfig({
  site: 'https://rajeshdas.dev',
  prefetch: true,
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    shikiConfig: {
      theme: 'css-variables',
      defaultColor: false,
    },
  },
  integrations: [
    icon({
      iconDir: 'src/assets/icons',
      svgoOptions: {
        plugins: [
          {
            name: 'convertColors',
            params: {
              currentColor: true,
            },
          },
        ],
      },
    }),
    AutoImport({
      imports: ['./src/components/core/Video.astro'],
    }),
    mdx(),
  ],
})
