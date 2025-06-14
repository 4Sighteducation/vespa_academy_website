// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import react from '@astrojs/react';

// Static build configuration for traditional hosting
export default defineConfig({
  integrations: [tailwind(), react()],
  site: 'https://vespa.academy', // Your actual domain
  compressHTML: true,
  output: 'static', // Static site generation
  build: {
    format: 'directory' // Use directory structure for URLs
  }
}); 