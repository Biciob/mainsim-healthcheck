import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    define: {
      // Questo permette di usare process.env.API_KEY nel codice client-side dopo la build
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  };
});