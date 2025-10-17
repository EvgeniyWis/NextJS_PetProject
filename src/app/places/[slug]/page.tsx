import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { use } from 'react';

type PageProps = {
  params: Promise<{ slug: string }>;
};

const PlaceDetails = dynamic(
  () => import('@/src/widgets/PlaceDetails').then((m) => m.PlaceDetails),
  { ssr: false },
);

export default function PlaceDetailsPage({ params }: PageProps) {
  const { slug } = use(params);
  return (
    <main className="mx-auto w-full max-w-5xl p-4">
      <Suspense fallback={<div className="p-6">Загрузка...</div>}>
        <PlaceDetails slug={slug} />
      </Suspense>
    </main>
  );
}
