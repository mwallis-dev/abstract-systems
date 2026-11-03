import fs from 'node:fs/promises';
import path from 'node:path';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

function labSavePlugin() {
  return {
    name: 'lab-save',
    configureServer(server) {
      server.middlewares.use('/__lab/save', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end('Method not allowed');
          return;
        }

        let body = '';
        req.on('data', (chunk) => {
          body += chunk;
        });
        req.on('end', async () => {
          try {
            const { path: relativePath, contents } = JSON.parse(body);
            if (typeof relativePath !== 'string' || !relativePath.startsWith('lab/config/')) {
              res.statusCode = 400;
              res.end('Invalid path');
              return;
            }
            const absolute = path.resolve(process.cwd(), relativePath);
            await fs.mkdir(path.dirname(absolute), { recursive: true });
            await fs.writeFile(absolute, contents, 'utf8');
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ path: relativePath }));
          } catch (error) {
            res.statusCode = 500;
            res.end(String(error));
          }
        });
      });
    },
  };
}

export default defineConfig({
  plugins: [tailwindcss(), labSavePlugin()],
  build: {
    rollupOptions: {
      input: {
        main: new URL('./index.html', import.meta.url).pathname,
        lab: new URL('./lab.html', import.meta.url).pathname,
        icons: new URL('./icons.html', import.meta.url).pathname,
        location: new URL('./location.html', import.meta.url).pathname,
        profile: new URL('./profile.html', import.meta.url).pathname,
        fadeIn: new URL('./fade-in.html', import.meta.url).pathname,
      },
    },
  },
});
