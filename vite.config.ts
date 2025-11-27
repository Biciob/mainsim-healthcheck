import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Carica le variabili d'ambiente locali (.env) e di sistema (Vercel)
  const env = loadEnv(mode, '.', '');
  
  // Recupera l'API KEY: prova prima da loadEnv, poi direttamente da process.env (per Vercel)
  const apiKey = env.API_KEY || process.env.API_KEY;

  return {
    plugins: [react()],
    define: {
      // Iniettiamo la chiave nel codice client come una stringa statica
      'process.env.API_KEY': JSON.stringify(apiKey)
    }
  };
});