import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_BASE_URL } from '../../js/config/api';

export interface VehicleListing {
  user_id: number;
  id: number;
  make: string;
  model: string;
  year: string;
  price: number;
  mileage: string;
  fuel_type: string;
  transmission: string;
  body_type: string;
  location: string;
  postcode: string;
  latitude: number;
  longitude: number;
  power: string;
  owners: number;
  service_history: string;
  condition: string;
  dealer_name: string;
  dealer_rating: number;
  review_count: number;
  engine_size: string;
  description: string;
  mot_due: string;
  registration: string;
  date_first_registered: string;
  colour: string;
  attention_grabber?: string;
  images: ImageData[];
}

interface VehicleState {
  listings: VehicleListing[];
  currentListing: VehicleListing | null;
  loading: boolean;
  error: string | null;
}

const initialState: VehicleState = {
  listings: [],
  currentListing: null,
  loading: false,
  error: null
};

export const createVehicleListing = createAsyncThunk(
    'vehicles/create',
    async (listing: VehicleListing) => {
      const transformedListing = {
        user_id: listing.user_id,
        id: listing.id,
        make: listing.make,
        model: listing.model,
        year: listing.year,
        mileage: listing.mileage,
        fuel_type: listing.fuel_type,
        body_type: listing.body_type,
        transmission: listing.transmission,
        owners: listing.owners,
        mot_due: listing.mot_due,
        colour: listing.colour,
        price: listing.price,
        description: listing.description,
        location: listing.location,
        postcode: listing.postcode,
        latitude: listing.latitude,
        longitude: listing.longitude,
        power: listing.power,
        service_history: listing.service_history,
        attention_grabber: listing.attention_grabber,
        condition: listing.condition,
        dealer_name: listing.dealer_name,
        dealer_rating: listing.dealer_rating,
        review_count: listing.review_count,
        engine_size: listing.engine_size,
        images: listing.images
      };

      try {
        const response = await fetch(`${API_BASE_URL}/vehicles`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(transformedListing)
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error details:', error);
        throw error;
      }
    }
  );

export const updateVehicleListing = createAsyncThunk(
    'vehicles/update',
    async (listing: VehicleListing) => {
      const transformedListing = {
        user_id: listing.user_id,
        id: listing.id,
        make: listing.make,
        model: listing.model,
        year: listing.year,
        mileage: listing.mileage,
        fuel_type: listing.fuel_type,
        body_type: listing.body_type,
        transmission: listing.transmission,
        owners: listing.owners,
        mot_due: listing.mot_due,
        colour: listing.colour,
        price: listing.price,
        description: listing.description,
        location: listing.location,
        postcode: listing.postcode,
        latitude: listing.latitude,
        longitude: listing.longitude,
        power: listing.power,
        service_history: listing.service_history,
        attention_grabber: listing.attention_grabber,
        condition: listing.condition,
        dealer_name: listing.dealer_name,
        dealer_rating: listing.dealer_rating,
        review_count: listing.review_count,
        engine_size: listing.engine_size,
        images: listing.images
      };

      try {
        const response = await fetch(`${API_BASE_URL}/vehicles/${transformedListing.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(transformedListing)
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error details:', error);
        throw error;
      }
    }
  );

export const fetchVehicleListings = createAsyncThunk(
  'vehicles/fetchAll',
  async () => {
    const response = await fetch(`${API_BASE_URL}/vehicles`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    return await response.json();
  }
);

export const fetchVehicleById = createAsyncThunk(
    'vehicles/fetchById',
    async (id: number) => {
      const response = await fetch(`${API_BASE_URL}/vehicles/${id}`);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      return await response.json();
    }
  );

const vehicleSlice = createSlice({
  name: 'vehicles',
  initialState,
  reducers: {
    setCurrentListing: (state, action) => {
      state.currentListing = action.payload;
    },
    clearCurrentListing: (state) => {
      state.currentListing = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateVehicleListing.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateVehicleListing.fulfilled, (state, action) => {
        state.loading = false;
        state.currentListing = action.payload;
      })
      .addCase(updateVehicleListing.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update listing';
      })
      .addCase(createVehicleListing.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createVehicleListing.fulfilled, (state, action) => {
        state.loading = false;
        state.listings.push(action.payload);
        state.currentListing = action.payload;
      })
      .addCase(createVehicleListing.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create listing';
      })
      .addCase(fetchVehicleListings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVehicleListings.fulfilled, (state, action) => {
        state.loading = false;
        state.listings = action.payload;
      })
      .addCase(fetchVehicleListings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch listings';
      })
      .addCase(fetchVehicleById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVehicleById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentListing = action.payload;
      })
      .addCase(fetchVehicleById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch vehicle';
      });
  }
});

export const { setCurrentListing, clearCurrentListing } = vehicleSlice.actions;
export default vehicleSlice.reducer;
