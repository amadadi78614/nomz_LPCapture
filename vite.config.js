import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { readFileSync, writeFileSync } from 'fs';
import { ROUTE_META, DEFAULT_META, SITE_URL, SITE_NAME } from './src/config/routeMeta.js';

const esc = (v) => String(v).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Put a route's title, description and share tags into the built HTML.
function renderHead(html, meta, path) {
  const m = { ...DEFAULT_META, ...meta };
  const url = SITE_URL + (path === '/' ? '/' : path);
  const image = m.image.startsWith('http') ? m.image : SITE_URL + m.image;
  const tags = [
    `<link rel="canonical" href="${esc(url)}" />`,
    `<meta property="og:site_name" content="${esc(SITE_NAME)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:title" content="${esc(m.title)}" />`,
    `<meta property="og:description" content="${esc(m.description)}" />`,
    `<meta property="og:url" content="${esc(url)}" />`,
    `<meta property="og:image" content="${esc(image)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
  ].join('\n    ');
  return html
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(m.title)}</title>`)
    .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${esc(m.description)}" />`)
    .replace('</head>', `    ${tags}\n  </head>`);
}

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    {
      // GitHub Pages: write one HTML file per known route (e.g. dist/register.html)
      // so deep links return 200 with the right title and share preview.
      // 404.html stays as the SPA fallback for dynamic routes (/player/:id etc.).
      name: 'route-pages',
      closeBundle() {
        const shell = readFileSync('dist/index.html', 'utf8');
        for (const [path, meta] of Object.entries(ROUTE_META)) {
          const file = path === '/' ? 'dist/index.html' : `dist${path}.html`;
          writeFileSync(file, renderHead(shell, meta, path));
        }
        writeFileSync('dist/404.html', renderHead(shell, DEFAULT_META, '/'));
      },
    },
  ],
  build: { outDir: 'dist', sourcemap: false },
});
