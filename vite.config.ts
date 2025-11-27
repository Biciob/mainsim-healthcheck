import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Carica le variabili d'ambiente, incluso API_KEY (anche se non ha prefisso VITE_)
  // Use '.' instead of process.cwd() to avoid type issues with Process interface
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react()],
    define: {
      // Mappa esplicitamente la variabile d'ambiente API_KEY su process.env.API_KEY
      // Questo è necessario perché il client usa process.env.API_KEY secondo le linee guida
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  };
});