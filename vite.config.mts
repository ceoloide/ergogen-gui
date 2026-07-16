import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// We will use standard React plugin and PWA plugin in injectManifest mode
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
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
          maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        },
      }),
    ],
    base: env.VITE_PUBLIC_URL || env.PUBLIC_URL || './',
    define: {
      'import.meta.env.VITE_ERGOGEN_VERSION': JSON.stringify(
        env.VITE_ERGOGEN_VERSION || env.ERGOGEN_VERSION || env.REACT_APP_ERGOGEN_VERSION || ''
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
    },
    worker: {
      format: 'iife',
    },
  };
});
