import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import searchVehicles from '../../services/api';
import { Vehicle } from '@/components/ResultItem';

export interface FilterState {
  postcode: string;
  radius: number | 'NATIONAL';
  page: number;
  perPage: number;
  make?: string;
  model?: string;
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  minMileage?: number;
  maxMileage?: number;
  transmission?: string;
  fuelTypes?: string[];
  bodyType?: string;
}

interface VehiclesState {
  items: Vehicle[];
  filters: FilterState;
  loading: boolean;
  error: string | null;
  totalResults: number;
  currentPage: number;
  totalPages: number;
}

const initialState: VehiclesState = {
  items: [],
  filters: {
    postcode: '',
    radius: 50,
    page: 1,
    perPage: 20,
  },
  loading: false,
  error: null,
  totalResults: 0,
  currentPage: 1,
  totalPages: 1,
};

export const fetchVehicles = createAsyncThunk(
  'vehicles/fetchVehicles',
  async (filters: FilterState) => {
    const response = await searchVehicles(filters);
    return response;
  }
);

const vehiclesSlice = createSlice({
  name: 'vehicles',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setPage: (state, action) => {
      state.filters.page = action.payload;
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVehicles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVehicles.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.vehicles;
        state.totalResults = action.payload.total;
        state.currentPage = action.payload.page;
        state.totalPages = action.payload.total_pages;
      })
      .addCase(fetchVehicles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch vehicles';
      });
  },
});

export const { setFilters, setPage, clearFilters } = vehiclesSlice.actions;
export default vehiclesSlice.reducer;