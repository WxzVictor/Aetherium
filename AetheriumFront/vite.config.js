import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Configuración para que el servidor de desarrollo maneje bien rutas de React Router
  server: {
    open: true,
    historyApiFallback: true,
    proxy: {
    '/api': 'http://localhost:5120',
    },
  },
  // Base para producción (puedes cambiar si vas a poner app en subcarpeta)
  base: '/',
})
