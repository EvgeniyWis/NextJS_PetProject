export type Comment = { id: string; author: string; text: string };

export const defaultImageUrl =
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1600&auto=format&fit=crop';

export const defaultDescription =
  'Это мок-описание места. Здесь будет подробная информация о локации, её особенностях и интересных фактах.';

export const defaultComments: Comment[] = [
  {
    id: '1',
    author: 'Alice',
    text: 'Очень красивое место! Хочу попасть туда снова.',
  },
  { id: '2', author: 'Bob', text: 'Отличная локация для прогулок и фото.' },
  {
    id: '3',
    author: 'Eve',
    text: 'Был в прошлом году, впечатления замечательные.',
  },
];
