import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  base: '/Figma-Design-to-HTML-Tailwind-CSS/',
  plugins: [tailwindcss()],
});
