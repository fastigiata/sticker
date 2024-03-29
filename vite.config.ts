import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'node:path'

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => ({
    plugins: [ react() ],

    // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
    //
    // 1. prevent vite from obscuring rust errors
    clearScreen: false,
    // 2. tauri expects a fixed port, fail if that port is not available
    server: {
        port: 1420,
        strictPort: true,
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src')
        }
    },
    base: './',
    build: {
        // default to 'dist', but allow overriding via 'mode'
        outDir: mode === 'web' ? 'web_impl' : 'dist',
    },
}))
