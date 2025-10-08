import styles from './MainPage.module.css';
import { PlaceCard } from '@/src/entities/PlaceCard';
import { placesMock } from '../model/mocks';

export function MainPage() {
  return (
    <main className={styles.main}>
      <div className="mx-auto grid w-full max-w-6xl gap-6 p-4 sm:grid-cols-2 lg:grid-cols-3">
        {placesMock.map((place) => (
          <PlaceCard key={place.title} {...place} />
        ))}
      </div>
    </main>
  );
}
