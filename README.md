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
    Hero.astro                      video de fondo + póster
    BloqueArgumento.astro           reutilizable, 3 usos (secciones 3, 4 y 5)
    Figura.astro                    ilustraciones SVG de los bloques
    IABloque.astro                  dos columnas, tratamiento propio
    Plataformas.astro               seis filas, lee plataformas.json
    LogoPlataforma.astro            glifos monocromáticos
    Proceso.astro                   cuatro pasos numerados
    Clientes.astro                  barra de logos, lee clientes.json
    FaqAccordion.astro              <details>/<summary>, lee faqs.json
    CierreCta.astro                 CTA final + cuatro enlaces cruzados
  data/redes/plataformas.json       las seis plataformas
  data/redes/clientes.json          los nueve logos de clientes
  data/redes/faqs.json              las nueve preguntas
  lib/jsonld.js                     FAQPage y Service desde los mismos datos
  pages/agencia-de-redes-sociales.astro
  styles/redes.css                  tokens y base
```

El brief pedía los datos en `content/redes/`. Van en `data/redes/` porque Astro 5
reserva `src/content/` para content collections y genera una colección
automática (deprecada) con cualquier carpeta que encuentre ahí. Mismo criterio,
carpeta distinta: el equipo de contenido edita JSON sin abrir un `.astro`.

## Video del hero

Se conserva el mismo clip que ya usa la página en producción, con las mismas
reglas de `hero-video.css`:

- `public/assets/video/hero-redes.mp4` (385 KB) y su póster
  `public/assets/img/heroes/hero-redes.jpg`, que es el primer cuadro del propio
  video: no hay salto cuando arranca y solo se descarga una imagen, no dos.
- El video es un adorno. Si no carga, si el navegador bloquea la reproducción o
  si el usuario pidió menos movimiento, queda el póster y la página se ve igual.
- **No se descarga en móvil ni tablet** (menos de 992 px) ni con
  `prefers-reduced-motion`. Ahí el costo de datos no se justifica y es donde el
  rendimiento está más apretado.
- Capa oscura encima del video para que el texto blanco del hero mantenga
  contraste AA.

Esto obliga a un script de 12 líneas dentro de `Hero.astro`: el `src` vive en
`data-src` y solo se activa cuando conviene. Es el único JavaScript propio de
la página además de GTM, y no renderiza nada — todo el texto sigue en el HTML
inicial.

## Barra de clientes

Va después de "Cómo trabajamos" y antes de Credenciales. Título a la izquierda,
rejilla de logos a la derecha (3 columnas en escritorio, 2 en móvil), con la
misma estructura que la banda de clientes del home.

Los logos viven en `public/assets/img/clientes/` y se listan en
`src/data/redes/clientes.json`. Agregar o quitar uno es editar ese JSON.

- Los cinco que ya estaban en el sitio (InverCap, Terza, Elizondo, Financiería
  Me-Xi y Tecmilenio) se tomaron de `/assets/img/portafolio/logo-clientes/` y se
  redujeron de 1667 px a 500 px de ancho: 305 KB → 48 KB.
- Infiniti y Hospitales MAC son SVG; Christus Muguerza, WebP.
- Hípico La Silla viene en blanco sobre transparente. En vez de reeditarlo, se
  pasa a gris oscuro con `filter: brightness(0) invert(.28)`, marcado con
  `"tono": "gris"` en el JSON. Si algún día llega la versión a color, se quita
  esa línea y ya.
- `"escala"` corrige los logos que quedan ópticamente chicos. El de MAC es casi
  cuadrado y a la misma altura que los demás se veía más pequeño; va en 1.3.

## Logotipos de plataformas

Venían recortados de sitios de terceros, con el fondo del sitio pegado en las
orillas. A cada uno se le midió la caja del contenido y se le comieron unos
píxeles de más para quitar el halo del antialias: los bordes quedan en blanco
limpio o en el color propio del icono, sin franja gris.

- **Meta**: se extrajo del SVG de Meta Business Partners que ya estaba en el
  repo, recortando el viewBox al glifo. Es vector, así que se ve nítido a
  cualquier tamaño; el PNG que se recibió medía 68 px de alto y se habría visto
  borroso en pantalla retina.
- **YouTube**: del lockup solo se conservó el botón de play, para que los cuatro
  iconos pesen parecido y no se repita el nombre que ya va en el H3.
- **TikTok y LinkedIn**: el icono de app completo, sin el margen blanco del
  recorte original.
- **WhatsApp**: el logotipo oficial en SVG. El archivo que se había recibido
  traía un "+" (era el icono de WhatsApp Plus, una app modificada), así que se
  descartó.

**X salió de la comparativa.** La sección quedó en cinco plataformas. No se
dice en ningún lado que no se trabaje con X: simplemente no aparece. El enlace
del footer a la cuenta de X de Futurité se queda, que es otra cosa.

`LogoPlataforma.astro` usa el archivo cuando `plataformas.json` trae `logo`, y
cae al glifo propio cuando no. Los logotipos van sin caja de color detrás; el
glifo sí la lleva, para que se lea como icono y no como logo a medias.

## Fondo del cierre

La banda del CTA final lleva una textura de iconos sociales
(`public/assets/img/redes/fondo-cierre.webp`, 20 KB) bajo una capa de marca de
93% a 78% de opacidad. La capa no es decorativa: el fondo tiene zonas casi
blancas y el texto es blanco. Medido sobre el píxel más claro de la imagen
compuesto con la parte más transparente de la capa, el contraste contra blanco
queda en **6.78:1** — arriba del 4.5:1 que pide el brief.

## Otras imágenes

- **Credenciales**: los logotipos oficiales de los dos programas, en
  `public/assets/img/credenciales/`. El de Google es un sello cuadrado y el de
  Meta un lockup horizontal, así que cada uno tiene su propia caja: se apilan en
  escritorio y van lado a lado en móvil, sin deformarse.
- **Medición verificada**: el panel del pixel y la API de Conversiones en
  `public/assets/img/redes/medicion-verificada.webp`, en el bloque "El dato
  antes que el contenido". Mismo tratamiento que la anterior: se midió el
  contenido (x 1081-1911, y 200-847) y se recortó con 30 px de margen.
- **Creativo por plataforma**: el mockup de los tres dispositivos en
  `public/assets/img/redes/creativo-por-plataforma.webp`, en el bloque "El
  creativo es la nueva segmentación". Es un recorte del archivo original, que
  traía la mitad derecha en blanco: se midió el contenido real (x 146-925,
  y 158-1088) y se cortó con 30 px de margen para no perder la sombra.
- **Central de Monitoreo**: la foto de las pantallas en
  `public/assets/img/redes/central-de-monitoreo.webp`, en el bloque "Decisiones,
  no reportes". Sustituye a la ilustración de línea que había ahí: el argumento
  del bloque son los dashboards, y ésos son los dashboards. Los otros dos
  bloques conservan su ilustración (`Figura.astro`).

Con esto los tres bloques de argumento ya usan foto. `Figura.astro` se queda
como respaldo del componente: si un bloque se queda sin `imagen`, dibuja la
ilustración de línea en vez de dejar el hueco vacío.

Las fotos son verticales u horizontales según el caso, así que
`BloqueArgumento` topa la imagen en 520 px de alto además del ancho: una pieza
vertical crecería más que la columna de texto y desbalancearía el bloque.

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

- Build limpio y cero JavaScript de render (el único script propio decide si
  descarga el video del hero).
- Un solo `<h1>`; los once H2 en orden; las preguntas del FAQ en H3.
- `FAQPage` (9 preguntas) y `Service` en el `<head>`, generados desde los JSON.
- Las nueve respuestas están en el HTML inicial con el acordeón cerrado.
- Canonical, robots y OG puestos; `meta-keywords` no existe.
- Los cuatro enlaces cruzados presentes en el cuerpo.
- Sin "Twitter" visible (solo la meta `twitter:card`, que es el nombre estándar
  del protocolo y no texto de la página).
- 360, 768, 1024 y 1440 sin desbordamiento horizontal; en 360 los dos botones
  del hero caen arriba del pliegue.
- El video arranca en escritorio y no se descarga en móvil: ahí queda el póster.
- Los nueve logos de clientes cargan y la rejilla reserva su espacio antes de
  que lleguen, así que no hay salto de layout.

## Pendientes que siguen abiertos

1. **OG image** 1200×630 en `/assets/img/og/og-redes-sociales.jpg`.
2. **Caso de éxito**: el hueco está previsto y comentado en la página, entre
   Credenciales y Preguntas frecuentes.
3. **Cifras del sitio**: el copy usa "+17 años" y "+40 giros". Otras páginas
   dicen otra cosa; conviene unificar antes de publicar.
4. **ID de GTM** real.
