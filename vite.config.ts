import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { join } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@myHooks': join(__dirname, 'src/hooks'),
      '@myComponents': join(__dirname, 'src/components'),
      '@myCommon': join(__dirname, 'src/common'),
      '@myStore': join(__dirname, 'src/store'),
      '@myTypes': join(__dirname, 'src/types'),
    }
  },
})
