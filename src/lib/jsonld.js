// Los dos bloques de datos estructurados salen de los mismos archivos de datos
// que alimentan el HTML. Si se edita una pregunta en faqs.json, cambia en la
// página y en el JSON-LD al mismo tiempo: no se pueden desincronizar.

import faqs from '../data/redes/faqs.json';

export const URL_PAGINA = 'https://futurite.com/agencia-de-redes-sociales';

export function faqPageJsonLd() {
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

export function serviceJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Agencia de redes sociales',
    serviceType: 'Marketing en redes sociales',
    url: URL_PAGINA,
    areaServed: {
      '@type': 'Country',
      name: 'México',
      identifier: 'MX',
    },
    provider: {
      '@type': 'Organization',
      name: 'Futurité',
      url: 'https://futurite.com',
      logo: 'https://futurite.com/assets/img/inicio/agencia-de-marketing-digital.svg',
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
    },
  };
}
