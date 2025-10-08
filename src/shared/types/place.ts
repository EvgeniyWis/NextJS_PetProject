export interface PlaceFormData {
  title: string;
  address: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  imageUrl: string;
  tags: string[];
  description: string;
  rating: number;
}
