import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// base './' keeps built files loadable from file:// (needed later for Electron)
export default defineConfig({
  base: './',
  plugins: [react()],
})
