import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { copyFileSync } from 'fs';

// GitHub Pages serves this project from /nomz_LPCapture/
export default defineConfig({
  base: '/',
  plugins: [
    react(),
    {
      // SPA fallback: GitHub Pages serves 404.html for unknown paths,
      // so deep links like /standings boot the app shell.
      name: 'spa-404',
      closeBundle() {
        try { copyFileSync('dist/index.html', 'dist/404.html'); } catch {}
      },
    },
  ],
  build: { outDir: 'dist', sourcemap: false },
});
