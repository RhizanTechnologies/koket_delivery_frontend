import Script from 'next/script';

export function StructuredData() {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Bakery',
    name: 'Koket Bakery & Pastry',
    description: 'Handcrafted cakes, pastries, and desserts made with the finest ingredients',
    url: 'https://koket-bakery.com',
    logo: 'https://koket-bakery.com/assets/cake.avif',
    image: 'https://koket-bakery.com/assets/cake.avif',
    telephone: '+251911529898',
    email: 'koket-bakeryandpastry@gmail.com',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Ethiopia',
      addressCountry: 'ET',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '9.0320', // Replace with actual coordinates
      longitude: '38.7469', // Replace with actual coordinates
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ],
        opens: '08:00',
        closes: '20:00',
      },
    ],
    priceRange: '$$',
    servesCuisine: 'Bakery',
    acceptsReservations: 'True',
    menu: 'https://koket-bakery.com/products',
    sameAs: [
      'https://t.me/koket-bakery',
      // Add other social media links here
    ],
  };

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://koket-bakery.com',
    name: 'Koket Bakery & Pastry',
    description: 'Custom cakes for birthdays, weddings, and special occasions',
    url: 'https://koket-bakery.com',
    telephone: '+251911529898',
    email: 'koket-bakeryandpastry@gmail.com',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Ethiopia',
      addressCountry: 'ET',
    },
    priceRange: '$$',
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://koket-bakery.com/#website',
    url: 'https://koket-bakery.com',
    name: 'Koket Bakery & Pastry',
    description: 'Handcrafted cakes and pastries for every celebration',
    publisher: {
      '@id': 'https://koket-bakery.com/#organization',
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://koket-bakery.com/products?search={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <>
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <Script
        id="local-business-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema),
        }}
      />
      <Script
        id="website-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />
    </>
  );
}
