import { viteStaticCopy } from 'vite-plugin-static-copy';
import { fileURLToPath } from 'node:url';
import { defineConfig, loadEnv, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// We will use standard React plugin and PWA plugin in injectManifest mode
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    resolve: {
      alias: [
        {
          find: /^ergogen(?=\/|$)/,
          replacement: fileURLToPath(
            new URL('./node_modules/.ergogen-engine', import.meta.url)
          ),
        },
      ],
    },
    plugins: [
      {
        name: 'validation-build-identity',
        generateBundle() {
          if (env.VITE_BUILD_ID) {
            this.emitFile({
              type: 'asset',
              fileName: 'build-id.txt',
              source: env.VITE_BUILD_ID,
            });
          }
        },
      },
      // Copy the pinned prebuilt editor instead of rebuilding its compiler.
      viteStaticCopy({
        targets: [{ src: 'node_modules/monaco-editor/min/vs', dest: 'monaco' }],
      }),
      // React support
      react(),

      // PWA / Service Worker support
      VitePWA({
        strategies: 'injectManifest',
        srcDir: 'src',
        filename: 'service-worker.ts',
        injectRegister: false, // We register manually in serviceWorkerRegistration.ts
        manifest: false, // We use the existing public/manifest.json
        injectManifest: {
          injectionPoint: 'self.__WB_MANIFEST',
          // Monaco's pinned TypeScript worker is about 7 MB. Keep all editor
          // assets precached so offline startup and language support work.
          maximumFileSizeToCacheInBytes: 8 * 1024 * 1024,
        },
      }),

      // Prefetch plugin for dynamic build chunks
      {
        name: 'vite-plugin-prefetch',
        transformIndexHtml(html, ctx) {
          if (!ctx.bundle) return html;
          const baseUrl = env.VITE_PUBLIC_URL || env.PUBLIC_URL || '/';
          const normalizeUrl = (path: string) => {
            const cleanBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
            const cleanPath = path.startsWith('/') ? path.slice(1) : path;
            return `${cleanBase}${cleanPath}`;
          };

          const prefetchLinks = Object.values(ctx.bundle)
            .filter(
              (chunk) =>
                chunk.type === 'chunk' &&
                (chunk.fileName.includes('three-') ||
                  chunk.fileName.includes('PcbPreview-'))
            )
            .map(
              (chunk) =>
                `  <link rel="prefetch" href="${normalizeUrl(chunk.fileName)}" as="script">`
            )
            .join('\n');

          return html.replace('</head>', `${prefetchLinks}\n</head>`);
        },
      } as Plugin,
    ],
    base: env.VITE_PUBLIC_URL || env.PUBLIC_URL || '/',
    define: {
      'import.meta.env.VITE_ERGOGEN_VERSION': JSON.stringify(
        env.VITE_ERGOGEN_VERSION ||
          env.ERGOGEN_VERSION ||
          env.REACT_APP_ERGOGEN_VERSION ||
          ''
      ),
      'import.meta.env.VITE_GTAG_ID': JSON.stringify(
        env.VITE_GTAG_ID || env.REACT_APP_GTAG_ID || ''
      ),
      'import.meta.env.VITE_FEATURE_TEMPLATES': JSON.stringify(
        env.VITE_FEATURE_TEMPLATES || env.REACT_APP_FEATURE_TEMPLATES || ''
      ),
      'import.meta.env.VITE_FEATURE_OUTLINES': JSON.stringify(
        env.VITE_FEATURE_OUTLINES || env.REACT_APP_FEATURE_OUTLINES || ''
      ),
    },
    server: {
      port: 3000,
      open: true,
    },
    build: {
      outDir: 'dist',
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (
                id.includes('three') ||
                id.includes('@react-three') ||
                id.includes('three-stdlib') ||
                id.includes('three-mesh-bvh')
              ) {
                return 'three';
              }
              if (id.includes('makerjs')) {
                return 'makerjs';
              }
              if (id.includes('jszip')) {
                return 'jszip';
              }
              if (id.includes('js-yaml')) {
                return 'js-yaml';
              }
              return 'vendor';
            }
          },
        },
      },
    },
    worker: {
      format: 'iife',
    },
  };
});
