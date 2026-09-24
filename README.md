# Futurité — Páginas de servicio

Reemplazo completo de dos páginas del sitio, con el mismo sistema visual y los
mismos componentes. Astro 5, HTML estático, sin framework de UI y sin
JavaScript propio de render.

| Página | Brief | Estado |
| --- | --- | --- |
| `/agencia-de-redes-sociales` | 2026-09-19 | Completa |
| `/google-ads` | 2026-09-22 | Completa, con cifras de ejemplo en el portafolio |

```bash
npm install
npm run dev     # http://localhost:4321/agencia-de-redes-sociales
                # http://localhost:4321/google-ads
npm run build   # genera las dos en dist/
```

Las cuatro fuentes ProximaNova dan 404 en local: viven en el sitio de
producción, no en este repo. La página cae al sans del sistema y no se rompe
nada.

## Cómo se integra al sitio

Esto es un proyecto autónomo para poder verlo funcionando hoy. Para llevarlo al
repo de futurite.com:

1. Copiar `src/components/`, `src/data/`, `src/lib/jsonld.js`,
   `src/styles/sitio.css` y las dos páginas de `src/pages/`.
2. Apuntar el import del layout al `BaseLayout` que ya exista en el repo.
3. **Borrar el bloque `@font-face` de `sitio.css`**: `main.css` ya declara
   ProximaNova en producción. La precarga del peso Black que lleva
   `BaseLayout` sí se conserva: es lo que sostiene el LCP del H1.
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
`src/styles/sitio.css` y **no se redefinen por página**: si un valor falta, se
agrega al global.

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

  components/comunes/               lo que usan las dos páginas
    Hero.astro                      video de fondo + póster, por prop
    BloqueArgumento.astro           kicker, H2, entrada opcional, bullets, CTA
    Figura.astro                    ilustraciones de línea: 3 de redes, 3 de ads
    Clientes.astro                  barra de logos, lee comunes/clientes.json
    Credenciales.astro              los dos sellos; `destacado` cambia cuál manda
    FaqAccordion.astro              <details>/<summary>, recibe las preguntas
    CierreCta.astro                 CTA final, teléfono opcional, enlaces cruzados

  components/redes/                 solo /agencia-de-redes-sociales
    IABloque.astro                  secuencia de 7 puntos con pestañas ARIA
    Plataformas.astro · LogoPlataforma.astro · Proceso.astro

  components/google-ads/            solo /google-ads
    FranjaDatos.astro               los cuatro datos de credibilidad
    IATarjetas.astro                tres tarjetas, sin JS
    CasosMetricas.astro             casos con CPA antes/después

  data/comunes/clientes.json        los nueve logos de clientes
  data/redes/                       intro, ia, plataformas y faqs de redes
  data/google-ads/                  stats, ia, casos y faqs de Google Ads
  lib/jsonld.js                     FAQPage, Service y BreadcrumbList
  pages/agencia-de-redes-sociales.astro
  pages/google-ads.astro
  styles/sitio.css                  tokens y base, compartidos
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
`src/data/comunes/clientes.json`. Agregar o quitar uno es editar ese JSON.

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

## Bloque de IA

Secuencia de siete puntos con patrón de pestañas ARIA: índice vertical arriba
de 1024 px, chips con scroll horizontal abajo. Nunca acordeón. El contenido
vive en `src/data/redes/ia.json`.

Tres cosas que se apartaron del documento de especificación, y por qué:

- **Los tokens de color.** El documento los daba muestreados de una captura
  (`#153959`, `#234563`, `#5DCAFA`) y no coinciden con los de la página. Se
  usan los reales —`#003a5c`, `#011743`, `#00cdff`— para que la sección empate
  con el hero y el cierre. Las opacidades del documento (.78, .62, .18, .06) sí
  se respetan: son las que definen la jerarquía del índice.
- **`--ia-grupo` a .55 y no a .45.** A .45 el encabezado de grupo da 3.66:1
  sobre este fondo y no llega al AA que pide el propio checklist. A .55 da
  4.69:1 y sigue leyéndose por debajo de los títulos del índice, que van a .62.
- **La altura del panel.** En vez de confiar solo en un `min-height` calculado
  a mano, los siete paneles ocupan la misma celda de una retícula y los
  inactivos se apagan con `visibility`, no con `display`. La caja mide siempre
  lo que el panel más largo y no brinca aunque cambie el copy o la tipografía.
  El `min-height` del documento se queda como piso. Dato para el acta: con el
  copy montado el panel más largo en escritorio es el **04** (371 px), no el 06.

Medido en el navegador: sin salto de altura en ninguna de las siete vistas,
navegación con las cuatro flechas más Home y End, un solo tab en el orden de
tabulación, chip activo centrado con el siguiente asomando, y con
`ia--interactivo` desactivado los siete paneles quedan visibles y apilados.

## Fondo del cierre

La banda del CTA final lleva una textura de iconos sociales
(`public/assets/img/comunes/fondo-cierre.webp`, 20 KB) bajo una capa de marca de
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
- `FAQPage` (8 preguntas) y `Service` en el `<head>`, generados desde los JSON.
- Las ocho respuestas están en el HTML inicial con el acordeón cerrado, y los
  siete paneles del bloque de IA también.
- Canonical, robots y OG puestos; `meta-keywords` no existe.
- Los cuatro enlaces cruzados presentes en el cuerpo.
- Sin "Twitter" visible (solo la meta `twitter:card`, que es el nombre estándar
  del protocolo y no texto de la página).
- 360, 768, 1024 y 1440 sin desbordamiento horizontal; en 360 los dos botones
  del hero caen arriba del pliegue.
- El video arranca en escritorio y no se descarga en móvil: ahí queda el póster.
- Los nueve logos de clientes cargan y la rejilla reserva su espacio antes de
  que lleguen, así que no hay salto de layout.

## Página de Google Ads

Siete secciones: hero, franja de credibilidad, tres bloques de "Cómo
trabajamos", tarjetas de IA, clientes y credenciales, preguntas frecuentes, y
cierre con los enlaces cruzados.

El portafolio con métricas del brief **no se publica en esta versión**, porque
todavía no hay casos reales. El componente y los datos siguen en el repo y el
hueco está comentado en la página, entre el bloque de IA y la barra de
clientes: cuando lleguen las cifras se sustituyen, se pone `"ejemplo": false`
y se descomentan las cuatro líneas.

### Lo que hubo que tocar de la página de redes

El brief decía "reutilizar sin tocar" ocho componentes. En el repo real no era
posible: `FaqAccordion`, `Clientes` y `CierreCta` importaban los datos de
`data/redes/` por su cuenta, `Hero` traía el video escrito dentro y los cuatro
enlaces cruzados estaban fijos en el markup — uno de ellos apuntando justo a
`/google-ads`.

Se resolvió como pide el propio brief: con props, nunca duplicando el
componente. Los compartidos se movieron a `components/comunes/` y el bloque de
credenciales, que vivía suelto dentro de la página de redes, salió a
`Credenciales.astro`.

**La página de redes no cambió.** El HTML generado antes y después del refactor
es idéntico salvo el bloque de credenciales, donde el texto pasó a entrar por
prop: los `<strong>` ya no llevan el atributo de ámbito de Astro, así que la
regla que los pinta de azul de marca es ahora `:global(strong)` dentro del
componente. Verificado comparando las dos compilaciones.

Dos cambios más que alcanzan a las dos páginas, los dos a favor:

- `[id] { scroll-margin-top: 92px }` en el CSS global. El header es sticky y
  mide 72 px: sin esto, el salto de "Ver cómo trabajamos" dejaba el titular
  debajo del menú. Faltaba también en redes.
- `inlineStylesheets: 'always'` en `astro.config.mjs`. Con dos páginas
  compartiendo componentes, `'auto'` empezó a sacar el CSS a archivos aparte y
  a meter dos peticiones bloqueantes antes del primer pintado. Quien llega a
  una página de servicio casi nunca visita la otra en la misma sesión, así que
  la caché compartida no compensaba el viaje extra.

### Decisiones de esta página

- **El explicador de IA va en tarjetas, no en pasos.** Son tres puntos, no
  siete: el índice navegable no orienta a nadie y obligaba a hidratar
  JavaScript. La página entera queda sin JS propio salvo el del video del hero.
- **El sello de Google manda.** Mismo componente de credenciales que en redes,
  con `destacado="google"`: el sello pasa de 150 a 200 px y el lockup de Meta
  baja de 280 a 220. Es la única diferencia entre las dos versiones del bloque.
- **Los enlaces cruzados del cierre** son prosa dentro del párrafo, como en
  redes, no una sección aparte con su propio H2. El brief los listaba como dos
  componentes; en el repo son uno solo y funcionaba.
- **Los números 01–03 de las tarjetas de IA van a opacidad .7, no .55.** A .55
  el cian sobre esa tarjeta da 2.74:1 y no alcanza ni el 3:1 del texto grande.
  A .7 da 3.49:1 en el extremo más claro del degradado.
- **El primer bloque ya usa foto**
  (`public/assets/img/google-ads/medicion-verificada.webp`): la misma cuenta
  antes y después de arreglar la medición, que es justo lo que argumenta el
  bloque. Llegó a 1536 px y se redujo a 1040 —lo que pide la columna en
  pantalla retina—, de 118 a 46 KB.
- **Los otros dos bloques van con ilustración de línea**: `Figura.astro` ganó
  tres variantes (`medicion`, `senales`, `reporte`). Cuando lleguen las piezas
  finales se pasa la prop `imagen` al bloque y dejan de usarse, sin tocar CSS.

### Hero

Se conserva el clip que ya usa la página en producción,
`public/assets/video/hero-ads.mp4` (691 KB) con su póster
`public/assets/img/heroes/hero-ads.jpg`, bajados del sitio. Mismas reglas que
el de redes: no se descarga abajo de 992 px ni con `prefers-reduced-motion`,
y si no carga queda el póster.

### Portafolio: fuera de esta versión

`CasosMetricas.astro` está construido y probado, con los tres casos de
`src/data/google-ads/casos.json` como datos de muestra, pero **no se renderiza**:
la llamada está comentada en la página. Mientras `"ejemplo"` siga en `true`, la
sección se dibuja con un aviso amarillo que avisa de que las cifras no son
reales, para que no se publique por accidente. Si algún día los casos salen con nombre de cliente, se llena
`cliente` y se pone `"anonimo": false`; el componente ya lo contempla.

La cifra de "más de 40 millones en conversiones" que traía la página vieja se
sustituyó, como se acordó, por la inversión administrada: más de 60 MDP al año
en más de 100 cuentas activas. Esos mismos dos datos alimentan la franja de
credibilidad.

### Datos estructurados

Tres bloques en el `<head>`, todos generados desde los mismos datos que pinta
la página: `FAQPage` (las ocho preguntas, desde `faqs.json`), `Service` y
`BreadcrumbList` (Inicio › Servicios › Google Ads). "Servicios" va sin `item`
porque no tiene URL propia en el sitio: schema.org lo admite y es mejor que
inventar una ruta que devuelve 404.

### Imagen OG

`public/assets/img/og/og-google-ads.jpg`, 1200×630, 72 KB. Armada en el repo a
partir del logotipo oficial en SVG, recoloreado a blanco y cian para que se lea
sobre el fondo de marca. Si diseño entrega una pieza propia, se reemplaza el
archivo y nada más.

### Medición

Mismos eventos que en redes, con las posiciones de esta página:

| Evento | Parámetro |
| --- | --- |
| `cta_click` | `hero-primario`, `hero-secundario`, `bloque-medicion`, `bloque-senales`, `bloque-decisiones`, `cierre` |
| `faq_open` | `data-gtm-pregunta` con el texto completo |
| `tel_click` | el teléfono del cierre |
| `link_servicio` | `seo`, `redes-sociales`, `comercio-electronico`, `marketing-medico` |

### Verificado

- Un solo `<h1>`; ocho H2 en orden y los H3 dentro (los de las tarjetas de IA,
  el de cada caso y las ocho preguntas). Las etiquetas "Situación inicial" y
  "Qué se cambió" son `<span>`, no encabezados: repetidas seis veces
  ensuciaban el esquema del documento.
- `FAQPage`, `Service` y `BreadcrumbList` en el `<head>`, desde los JSON.
- Las ocho respuestas están en el HTML inicial con el acordeón cerrado.
- Cero JavaScript propio salvo el del video del hero.
- 360, 1280 y 1440 sin desbordamiento horizontal. La franja va a cuatro
  columnas en escritorio y a dos en móvil; casos y tarjetas de IA, a tres y a
  una; los bloques alternan el lado de la imagen.
- Contraste medido en los quince estilos de texto de la página: todos por
  arriba de 4.5:1 salvo los números decorativos, que son texto grande y
  `aria-hidden`, y quedan en 3.49:1.
- Video, póster, los nueve logos de clientes y los dos sellos cargan sin error.
  Los únicos 404 son las fuentes, que no viven en este repo.

## Pendientes que siguen abiertos

**De las dos páginas**

1. **ID de GTM** real (hoy `GTM-XXXXXXX` en `BaseLayout.astro`).
2. **Cifras del sitio**: el copy usa "+17 años" y "+40 giros". Otras páginas
   dicen otra cosa; conviene unificar antes de publicar.

**De redes sociales**

3. **OG image** 1200×630 en `/assets/img/og/og-redes-sociales.jpg`. La de
   Google Ads ya está hecha y sirve de plantilla.
4. **Caso de éxito**: el hueco está previsto y comentado en la página, entre
   Credenciales y Preguntas frecuentes.

**De Google Ads**

5. **Los tres casos reales** del portafolio, con CPA antes y después, periodo e
   inversión. Hasta entonces la sección no se publica.
6. **Las fotos del segundo y tercer bloque de "Cómo trabajamos"**, si se
   prefieren a las ilustraciones de línea. El primero ya la tiene.
