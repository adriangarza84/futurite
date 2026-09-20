# Futurité — Página de Redes Sociales

Reemplazo completo de `/agencia-de-redes-sociales`, según el brief del
2026-09-19. Astro 5, HTML estático, sin framework de UI y sin JavaScript propio
de render.

```bash
npm install
npm run dev     # http://localhost:4321/agencia-de-redes-sociales
npm run build   # genera dist/agencia-de-redes-sociales/index.html
```

## Cómo se integra al sitio

Esto es un proyecto autónomo para poder verlo funcionando hoy. Para llevarlo al
repo de futurite.com:

1. Copiar `src/components/redes/`, `src/data/redes/`, `src/lib/jsonld.js`,
   `src/styles/redes.css` y `src/pages/agencia-de-redes-sociales.astro`.
2. Apuntar el import del layout al `BaseLayout` que ya exista en el repo.
3. **Borrar el bloque `@font-face` de `redes.css`**: `main.css` ya declara
   ProximaNova en producción.
4. Borrar `src/components/Header.astro` y `Footer.astro` de aquí y usar los
   compartidos del sitio. Si todavía no existen como componentes, estos dos
   sirven de base: ya traen "Software a la medida" en Servicios, el enlace a X
   (no Twitter) y el bloque de las seis ciudades.
5. Poner el ID real del contenedor de GTM en `src/layouts/BaseLayout.astro`
   (`GTM_ID`, hoy `GTM-XXXXXXX`).

## Paleta: de dónde salen los valores

El brief dejaba los hex pendientes. No se eligieron a ojo: se leyeron del CSS en
producción — `assets/css/main.css` (`:root`) y `assets/css/landing-ciudad.css`,
la hoja que visten las páginas nuevas. Viven en `:root` dentro de
`src/styles/redes.css`.

| Token | Valor | Origen |
| --- | --- | --- |
| `--color-marca` | `#003a5c` | `--dark-blue-01` |
| `--color-marca-oscuro` | `#011743` | cierre del degradado `.bg-dark-blue-gradient` |
| `--color-marca-medio` | `#256586` | `--dark-blue-02` |
| `--color-acento` | `#00cdff` | `--light-blue-01` |
| `--color-acento-suave` | `#80e4fc` | cierre del degradado de `.btn-cta` |
| `--color-acento-pastel` | `#f0fbff` | `--light-blue-02` |
| `--color-azul` | `#006fb8` | `--azul` |
| `--color-texto-suave` | `#4a5761` | color de párrafo de `landing-ciudad.css` |
| `--color-fondo-alt` | `#f4f6f8` | `.bg-gris` |
| `--color-borde` | `#e3e9ee` | borde de `.card-lc` |

También se heredan tal cual el botón primario (`.btn-cta`: degradado cian,
radio 30px), el botón contorno, la línea de 4×72 px bajo los titulares y los
números `01–04` a 52 px / 900 con opacidad .55.

Una sola desviación de estilo, deliberada: el botón contorno sobre fondo claro
usa el azul de marca y no el cian, porque `#00cdff` sobre blanco no llega al
4.5:1 que pide el brief.

## Estructura

```
src/
  layouts/BaseLayout.astro          head, JSON-LD, GTM, header y footer
  components/Header.astro           menú con "Software a la medida"
  components/Footer.astro           versión actual, X y seis ciudades
  components/redes/
    Hero.astro
    BloqueArgumento.astro           reutilizable, 3 usos (secciones 3, 4 y 5)
    Figura.astro                    ilustraciones SVG de los bloques
    IABloque.astro                  dos columnas, tratamiento propio
    Plataformas.astro               seis filas, lee plataformas.json
    LogoPlataforma.astro            glifos monocromáticos
    Proceso.astro                   cuatro pasos numerados
    FaqAccordion.astro              <details>/<summary>, lee faqs.json
    CierreCta.astro                 CTA final + cuatro enlaces cruzados
  data/redes/plataformas.json       las seis plataformas
  data/redes/faqs.json              las nueve preguntas
  lib/jsonld.js                     FAQPage y Service desde los mismos datos
  pages/agencia-de-redes-sociales.astro
  styles/redes.css                  tokens y base
```

El brief pedía los datos en `content/redes/`. Van en `data/redes/` porque Astro 5
reserva `src/content/` para content collections y genera una colección
automática (deprecada) con cualquier carpeta que encuentre ahí. Mismo criterio,
carpeta distinta: el equipo de contenido edita JSON sin abrir un `.astro`.

## Medición

La página no trae scripts de medición sueltos. Cada elemento medible expone
atributos `data-` y GTM engancha desde ahí:

| Evento | Selector | Parámetro |
| --- | --- | --- |
| `cta_click` | `[data-gtm-evento="cta_click"]` | `data-gtm-posicion`: `hero-primario`, `hero-secundario`, `bloque-3-dato`, `bloque-4-creativo`, `bloque-5-decisiones`, `cierre` |
| `faq_open` | `[data-gtm-evento="faq_open"]` | `data-gtm-pregunta` con el texto completo |
| `link_servicio` | `[data-gtm-evento="link_servicio"]` | `data-gtm-servicio`: `seo`, `google-ads`, `comercio-electronico`, `marketing-medico` |
| `scroll_depth` | — | con el trigger nativo de profundidad de GTM (25/50/75/100) |

`faq_open` se dispara con un click trigger sobre el `<summary>`. Como el
acordeón es nativo, el click es el único gesto que hay que escuchar.

## Verificado

- Build limpio, una sola página, cero JavaScript propio de render.
- Un solo `<h1>`; los diez H2 en orden; las preguntas del FAQ en H3.
- `FAQPage` (9 preguntas) y `Service` en el `<head>`, generados desde los JSON.
- Las nueve respuestas están en el HTML inicial con el acordeón cerrado.
- Canonical, robots y OG puestos; `meta-keywords` no existe.
- Los cuatro enlaces cruzados presentes en el cuerpo.
- Sin "Twitter" visible (solo la meta `twitter:card`, que es el nombre estándar
  del protocolo y no texto de la página).
- 360, 768, 1024 y 1440 sin desbordamiento horizontal; en 360 los dos botones
  del hero caen arriba del pliegue.

## Pendientes que siguen abiertos

1. **SVG oficiales** de Meta, TikTok, LinkedIn, YouTube, X y WhatsApp.
   `LogoPlataforma.astro` trae glifos simplificados, no los logotipos de marca.
2. **Badges** de Meta Business Partner y Google Partner Premier: hoy son un
   bloque tipográfico. Sustituir por los assets del home.
3. **Hero**: decidir astronauta o pieza nueva. El degradado funciona solo; en
   `Hero.astro` está lista la línea para la imagen (`hero-redes.webp`,
   `fetchpriority="high"`, sin carga diferida).
4. **OG image** 1200×630 en `/assets/img/og/og-redes-sociales.jpg`.
5. **Caso de éxito**: el hueco está previsto y comentado en la página, entre
   Credenciales y Preguntas frecuentes.
6. **Cifras del sitio**: el copy usa "+17 años" y "+40 giros". Otras páginas
   dicen otra cosa; conviene unificar antes de publicar.
7. **ID de GTM** real.
