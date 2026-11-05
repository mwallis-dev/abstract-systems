import fs from 'node:fs/promises';
import path from 'node:path';
import { defineConfig, loadEnv } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { githubActivityPlugin } from './server/github-activity.js';
import activitySettings from './lab/config/github-activity.json' with { type: 'json' };

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

export default defineConfig(({ mode }) => ({
  plugins: [tailwindcss(), labSavePlugin(), githubActivityPlugin({
    token: process.env.GITHUB_TOKEN || loadEnv(mode, process.cwd(), 'GITHUB_').GITHUB_TOKEN,
    username: activitySettings.username,
  })],
  build: {
    rollupOptions: {
      input: {
        main: new URL('./index.html', import.meta.url).pathname,
        menuAlt2: new URL('./menu-alt-2.html', import.meta.url).pathname,
        lab: new URL('./lab.html', import.meta.url).pathname,
        icons: new URL('./icons.html', import.meta.url).pathname,
        location: new URL('./location.html', import.meta.url).pathname,
        profile: new URL('./profile.html', import.meta.url).pathname,
        fadeIn: new URL('./fade-in.html', import.meta.url).pathname,
        githubActivity: new URL('./github-activity.html', import.meta.url).pathname,
      },
    },
  },
}));
