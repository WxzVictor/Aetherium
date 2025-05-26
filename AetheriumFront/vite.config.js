import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Configuración para que el servidor de desarrollo maneje bien rutas de React Router
  server: {
    // Esta opción abre automáticamente el navegador cuando levantas Vite
    open: true,
    // Habilita fallback para que todas las rutas caigan en index.html
    // (evita página en blanco al refrescar rutas)
    historyApiFallback: true
  },
  // Base para producción (puedes cambiar si vas a poner app en subcarpeta)
  base: '/',
})
