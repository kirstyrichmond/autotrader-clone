import { Vehicle } from "@/components/ResultItem";

interface SearchFilters {
  postcode?: string;
  radius?: number;
  make?: string;
  model?: string;
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  minMileage?: number;
  maxMileage?: number;
  transmission?: string;
  fuelType?: string[];
  bodyType?: string;
  page?: number;
  perPage?: number;
}

interface SearchResponse {
  vehicles: Vehicle[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const searchVehicles = async (filters: SearchFilters): Promise<SearchResponse> => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      params.append(key, value.toString());
    }
  });

  try {
    const response = await fetch(`${API_URL}/vehicles/search?${params.toString()}`);
    if (!response.ok) {
      throw new Error('Search failed');
    }
    return await response.json();
  } catch (error) {
    console.error('Error searching vehicles:', error);
    throw error;
  }
};

export default searchVehicles;