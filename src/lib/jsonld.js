// Los bloques de datos estructurados salen de los mismos archivos de datos que
// alimentan el HTML. Si se edita una pregunta en un faqs.json, cambia en la
// página y en el JSON-LD al mismo tiempo: no se pueden desincronizar.
//
// Nada de esto importa datos por su cuenta: cada página pasa los suyos. Así el
// archivo sirve a las dos páginas de servicio sin duplicarse.

export const SITIO = 'https://futurite.com';

// Ficha de la agencia. Es idéntica en todas las páginas, así que vive aquí y no
// en cada una.
export const ORGANIZACION = {
  '@type': 'Organization',
  name: 'Futurité',
  url: SITIO,
  logo: `${SITIO}/assets/img/inicio/agencia-de-marketing-digital.svg`,
  telephone: '+52-81-2092-9666',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Av. José Vasconcelos 345-Ote, Plaza Tanarah Piso 21, Santa Engracia',
    addressLocality: 'San Pedro Garza García',
    addressRegion: 'Nuevo León',
    postalCode: '66267',
    addressCountry: 'MX',
  },
  sameAs: [
    'https://www.facebook.com/Futurite/',
    'https://www.instagram.com/futurite/',
    'https://mx.linkedin.com/company/futurite',
    'https://x.com/Futurite',
    'https://www.tiktok.com/@futurite_oficial',
  ],
};

export function faqPageJsonLd(faqs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.pregunta,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.respuesta,
      },
    })),
  };
}

export function serviceJsonLd({ nombre, tipo, url }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: nombre,
    serviceType: tipo,
    url,
    areaServed: {
      '@type': 'Country',
      name: 'México',
      identifier: 'MX',
    },
    provider: ORGANIZACION,
  };
}

// Inicio › Servicios › <página>. "Servicios" no tiene URL propia en el sitio,
// así que va como elemento sin `item`: schema.org lo admite y es preferible a
// inventar una ruta que devuelve 404.
export function breadcrumbJsonLd(nombrePagina, urlPagina) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: SITIO },
      { '@type': 'ListItem', position: 2, name: 'Servicios' },
      { '@type': 'ListItem', position: 3, name: nombrePagina, item: urlPagina },
    ],
  };
}
