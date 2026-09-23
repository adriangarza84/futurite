import { defineConfig } from 'astro/config';

// Dos destinos con la misma base de código:
//   - Producción: la página vive en futurite.com, en la raíz.
//   - Vista previa: GitHub Pages sirve el repo bajo /futurite/.
// El workflow de despliegue activa el segundo con GITHUB_PAGES=true.
const enPages = process.env.GITHUB_PAGES === 'true';

export default defineConfig({
  site: enPages ? 'https://adriangarza84.github.io' : 'https://futurite.com',
  base: enPages ? '/futurite' : '/',
  // 'always' y no 'auto': con dos páginas compartiendo componentes, 'auto'
  // empieza a sacar el CSS a archivos aparte y mete dos peticiones
  // bloqueantes antes del primer pintado. Quien llega a una página de servicio
  // casi nunca visita la otra en la misma sesión, así que el CSS compartido
  // no se reaprovecha y la caché no compensa el viaje extra. Son ~29 KB sin
  // comprimir por página.
  build: { inlineStylesheets: 'always' },
});
