// https://v3.nuxtjs.org/api/configuration/nuxt.config

const lifecycle = process.env.npm_lifecycle_event

export default defineNuxtConfig({
    css: ['assets/scss/index.scss'],
    build: {
        transpile: lifecycle === 'build' ? ['element-plus'] : []
    },
    builder: 'vite',
    vite: {
        build: {
            chunkSizeWarningLimit: 1000
        }
    }
})
