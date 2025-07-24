import { Vehicle } from '@/components/ResultItem';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_BASE_URL } from '../../js/config/api';

interface FavoritesState {
  favorites: Vehicle[];
  loading: boolean;
  error: string | null;
}

const initialState: FavoritesState = {
  favorites: [],
  loading: false,
  error: null,
};

export const fetchFavorites = createAsyncThunk(
  'favorites/fetchFavorites',
  async (userId: number) => {
    const response = await fetch(`${API_BASE_URL}/favorites/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch favorites');
    return response.json();
  }
);

export const addFavorite = createAsyncThunk(
  'favorites/addFavorite',
  async ({ userId, vehicleId }: { userId: number; vehicleId: number }) => {
    console.log('Adding favorite:', { userId, vehicleId });
    
    const response = await fetch(`${API_BASE_URL}/favorites/${userId}/${vehicleId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, vehicleId })
    });

    console.log('Response:', response);
    

    if (!response.ok) {
      throw new Error(`Failed to add favorite: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  }
);

export const removeFavorite = createAsyncThunk(
  'favorites/removeFavorite',
  async ({ userId, vehicleId }: { userId: number; vehicleId: number }) => {
    const response = await fetch(`${API_BASE_URL}/favorites/${userId}/${vehicleId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to remove favorite');
    return vehicleId;
  }
);

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.favorites = action.payload;        
        state.loading = false;
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })
      .addCase(addFavorite.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addFavorite.fulfilled, (state, action) => {
        state.loading = false;
        console.log('Action payload:', action.payload);
        
        if (action.payload.vehicle && !state.favorites.some(fav => fav.id === action.payload.vehicle.id)) {
            state.favorites.push(action.payload.vehicle);
        }
      })
      .addCase(addFavorite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add favorite';
      })
      .addCase(removeFavorite.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFavorite.fulfilled, (state, action) => {
        state.loading = false;        
        state.favorites = state.favorites.filter(fav => fav.id !== action.payload);

      })
      .addCase(removeFavorite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to remove favorite';
      });
  },
});

export default favoritesSlice.reducer;