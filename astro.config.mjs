// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import react from '@astrojs/react';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), react()],
  site: 'https://vespa-academy.com',
  compressHTML: true,
  output: 'server', // Enable SSR for API routes
  adapter: node({
    mode: 'standalone'
  }),
});
