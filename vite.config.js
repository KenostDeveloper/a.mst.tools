import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
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
