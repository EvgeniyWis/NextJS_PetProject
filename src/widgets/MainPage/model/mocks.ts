import { type PlaceCardProps } from '@/src/entities/PlaceCard';

export const placesMock: PlaceCardProps[] = [
  {
    title: 'Central Park',
    description: 'A large public park in New York City with scenic views.',
    imageUrl:
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1600&auto=format&fit=crop',
    imageAlt: 'Central Park landscape',
    href: '/places/central-park',
  },
  {
    title: 'Golden Gate Bridge',
    description: 'Iconic suspension bridge spanning the Golden Gate strait.',
    imageUrl:
      'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?q=80&w=1600&auto=format&fit=crop',
    imageAlt: 'Golden Gate Bridge at sunset',
    href: '/places/golden-gate-bridge',
  },
  {
    title: 'Eiffel Tower',
    description: 'Parisian landmark and symbol of architectural elegance.',
    imageUrl:
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1600&auto=format&fit=crop',
    imageAlt: 'Eiffel Tower in Paris',
    href: '/places/eiffel-tower',
  },
];
