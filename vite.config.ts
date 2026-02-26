import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  // 必须与 GitHub 仓库名一致
  base: '/orr-simulator/',
  plugins: [react()],
  resolve: {
    alias: {
      // 扁平结构别名指向根目录
      '@': path.resolve(__dirname, '.'),
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
})