import { httpClient } from './httpClient';
import type { PlaceFormData } from '@/src/shared/types/place';
import type { PlaceCardProps } from '@/src/entities/PlaceCard';

// API DTOs (примерная форма; подстроим при интеграции с реальным API)
interface PlaceDto {
  id: string;
  title: string;
  address?: string;
  lat?: number;
  lng?: number;
  image_url: string;
  tags?: string[];
  description: string;
  rating?: number;
}

interface CreatePlaceDto {
  title: string;
  address?: string;
  lat?: number;
  lng?: number;
  image_url: string;
  tags?: string[];
  description: string;
  rating?: number;
}

function mapPlaceDtoToCard(dto: PlaceDto): PlaceCardProps {
  return {
    title: dto.title,
    description: dto.description,
    imageUrl: dto.image_url,
    imageAlt: dto.title,
    href: `/places/${dto.id}`,
  };
}

function mapFormToCreateDto(data: PlaceFormData): CreatePlaceDto {
  return {
    title: data.title,
    address: data.address,
    lat: data.coordinates?.lat,
    lng: data.coordinates?.lng,
    image_url: data.imageUrl,
    tags: data.tags,
    description: data.description,
    rating: data.rating,
  };
}

// Public API
export async function getPlaces() {
  const res = await httpClient.get<PlaceDto[]>('/places', { retries: 2 });
  return res.map(mapPlaceDtoToCard);
}

export async function createPlace(payload: PlaceFormData) {
  const body = mapFormToCreateDto(payload);
  const created = await httpClient.post<PlaceDto, CreatePlaceDto>(
    '/places',
    body,
    { retries: 1 },
  );
  return mapPlaceDtoToCard(created);
}

export async function getPlace(id: string) {
  const dto = await httpClient.get<PlaceDto>(
    `/places/${encodeURIComponent(id)}`,
    { retries: 2 },
  );
  return mapPlaceDtoToCard(dto);
}

export async function deletePlace(id: string) {
  await httpClient.delete<void>(`/places/${encodeURIComponent(id)}`, {
    timeoutMs: 10_000,
  });
}
