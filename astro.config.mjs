import { defineConfig } from 'astro/config';

// Dos destinos con la misma base de código:
//   - Producción: la página vive en futurite.com, en la raíz.
//   - Vista previa: GitHub Pages sirve el repo bajo /futurite/.
// El workflow de despliegue activa el segundo con GITHUB_PAGES=true.
const enPages = process.env.GITHUB_PAGES === 'true';

export default defineConfig({
  site: enPages ? 'https://adriangarza84.github.io' : 'https://futurite.com',
  base: enPages ? '/futurite' : '/',
  build: { inlineStylesheets: 'auto' },
});
