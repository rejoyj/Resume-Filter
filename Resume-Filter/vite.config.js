import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/Resume-Filter/',  // 👈 ADD THIS LINE
  plugins: [react()],
})
