'use client';

import { useState } from 'react';
import styles from './MainPage.module.css';
import { PlaceCard } from '@/src/entities/PlaceCard';
import { AddPlaceModal } from '@/src/features/AddPlaceModal';
import { placesMock } from '../model/mocks';
import { type PlaceFormData } from '@/src/shared/types/place';

export function MainPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [places, setPlaces] = useState(placesMock);

  const handleAddPlace = (newPlace: PlaceFormData) => {
    // Преобразуем данные формы в формат PlaceCard
    const placeCard = {
      title: newPlace.title,
      description: newPlace.description,
      imageUrl: newPlace.imageUrl,
      imageAlt: newPlace.title,
      href: `/places/${newPlace.title.toLowerCase().replace(/\s+/g, '-')}`,
    };

    setPlaces((prev) => [...prev, placeCard]);
  };

  return (
    <main className={styles.main}>
      <div className="mx-auto w-full max-w-6xl p-4">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Мои места
          </h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-colors"
          >
            + Добавить место
          </button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {places.map((place) => (
            <PlaceCard key={place.title} {...place} />
          ))}
        </div>
      </div>

      <AddPlaceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddPlace}
      />
    </main>
  );
}
