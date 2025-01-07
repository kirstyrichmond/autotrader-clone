import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface VehicleData {
  user_id: number | null;
  id?: number | null;
  make: string;
  model: string;
  year?: string | null;
  variant?: string;
  mileage: string;
  fuel_type?: string;
  body_type?: string;
  transmission?: string;
  owners?: number | null;
  mot_due?: string;
  registration: string;
  date_first_registered?: string;
  colour?: string;
  price?: number | null;
  attention_grabber?: string;
  description?: string;
  location?: string;
  postcode?: string;
  latitude?: number | null;
  longitude?: number | null;
  power?: string;
  service_history?: string;
  condition?: string;
  dealer_name?: string;
  dealer_rating?: number | null;
  review_count?: number | null;
  engine_size?: string;
  images: ImageData[];
}

export const EMPTY_ADVERT = {
    user_id: null,
    id: null,
    make: "",
    model: "",
    year: "",
    variant: "",
    mileage: "",
    fuel_type: "",
    body_type: "",
    transmission: "",
    owners: null,
    mot_due: "",
    registration: "",
    date_first_registered: "",
    colour: "",
    price: null,
    attention_grabber: "",
    description: "",
    location: "",
    postcode: "",
    latitude: null,
    longitude: null,
    power: "",
    service_history: "",
    condition: "",
    dealer_name: "",
    dealer_rating: null,
    review_count: null,
    engine_size: "",
    images: [],
}

interface AdvertState {
  vehicleData: VehicleData;
}

const initialState: AdvertState = {
  vehicleData: EMPTY_ADVERT
};

const advertSlice = createSlice({
  name: 'advert',
  initialState,
  reducers: {
    setVehicleData: (state, action: PayloadAction<VehicleData>) => {
      state.vehicleData = action.payload;      
    },
    clearVehicleData: (state) => {
      state.vehicleData = EMPTY_ADVERT;
    }
  }
});

export const { setVehicleData, clearVehicleData } = advertSlice.actions;
export default advertSlice.reducer;