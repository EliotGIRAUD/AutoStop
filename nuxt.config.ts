import { resolve } from 'pathe'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  srcDir: '.',
  pages: true,
  modules: ['@nuxtjs/tailwindcss'],
  css: [resolve('./assets/css/tailwind.css')],
  runtimeConfig: {
    public: {
      mapboxToken: process.env.NUXT_PUBLIC_MAPBOX_TOKEN || ''
    }
  },
  app: {
    head: {
      title: 'AutoStop',
      meta: [
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1'
        }
      ]
    }
  }
})