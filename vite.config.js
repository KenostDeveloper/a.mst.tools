import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import autoprefixer from 'autoprefixer'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  css: {
    postcss: {
      plugins: [
        autoprefixer({}) 
      ],
    }
  },
  server: {
    proxy: {
      // with options: http://localhost:5173/api/bar-> http://jsonplaceholder.typicode.com/bar
      '/rest': {
        target: 'https://a.dev.mst.tools/',
        changeOrigin: true,
        // rewrite: (path) => path.replace('^/rest', ''),
        secure: true
      }
    },
  },
})
