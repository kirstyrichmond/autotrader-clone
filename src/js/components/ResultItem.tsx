import React from "react";
import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { addFavorite, removeFavorite } from "../../store/slices/favoritesSlice";
import { openAuthModal } from "../../store/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";

export interface Vehicle {
  id: number;
  images: any[];
  price: number;
  make: string;
  model: string;
  year: string;
  body_type: string;
  mileage: string | number;
  engine_size?: string;
  transmission: string;
  fuel_type: string;
  attention_grabber?: string;
  location: string;
  distance?: number;
}

export interface ResultItemProps {
  vehicle: Vehicle;
}

const ResultItem: React.FC<ResultItemProps> = ({ vehicle }) => {
  const {
    id,
    images,
    make,
    model,
    price,
    year,
    body_type,
    mileage,
    engine_size,
    attention_grabber,
    location,
    distance
  } = vehicle;

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const favorites = useSelector((state: RootState) => state.favorites.favorites);
  const isFavorite = favorites.some((favorite) => favorite.id === vehicle?.id);
  
  const parsedImages = images ? (
    typeof images === 'string' ? JSON.parse(images) : images
  ) : [];

  const getImageUrl = (vehicle: Vehicle) => {
    if (parsedImages[0]) {
      if (parsedImages[0].url?.startsWith('data:image')) {
        return parsedImages[0].url;
      }
      return parsedImages[0].preview || parsedImages[0].url;
    }
    return '';
  };

  const handleClick = () => {
    navigate(`/car-details/${id}`);
  };

    const handleFavoriteClick = async (e: React.MouseEvent) => {
      e.stopPropagation();
      
      if (!isAuthenticated) {
        dispatch(openAuthModal());
        return;
      }
      
      if (!userId || !vehicle?.id) {
        console.log('Missing user ID or vehicle ID');
        return;
      }
    
      try {
        if (isFavorite) {
          await dispatch(removeFavorite({ 
            userId, 
            vehicleId: vehicle.id 
          })).unwrap();
        } else {        
          await dispatch(addFavorite({ 
            userId, 
            vehicleId: vehicle.id 
          })).unwrap();
        }
      } catch (error) {
        console.error('Favorite action failed:', error);
      }
    };

  return (
    <div 
      onClick={handleClick}
      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer relative"
    >
      <button 
        onClick={handleFavoriteClick}
        className="absolute top-2 right-2 z-10 bg-gray-100 rounded-full p-1 shadow-md transition-colors hover:border-gray-100"
      >
        <Heart className="w-3 h-3 text-red-600 hover:text-black" />
      </button>
      <div className="aspect-[4/3] relative">
        {getImageUrl(vehicle) ? (
          <img
            src={getImageUrl(vehicle)}
            alt={`${make} ${model}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <p className="text-gray-500">No image available</p>
          </div>
        )}
      </div>
      <div className="p-3">
        <h2 className="font-semibold text-sm">{make} {model}</h2>
        <p className="text-xs text-gray-600">{engine_size} {body_type}</p>
        {attention_grabber && (
          <p className="text-xs text-gray-700 mt-1">{attention_grabber}</p>
        )}
        <div className="flex gap-1 mt-2 text-xs text-gray-600">
          <div className="bg-gray-100 px-2 py-0.5 rounded">
            {year} ({year.slice(-2)} reg)
          </div>
          <div className="bg-gray-100 px-2 py-0.5 rounded">
            {typeof mileage === 'number' ? mileage.toLocaleString() : mileage} miles
          </div>
        </div>
        <div className="mt-3 flex flex-col">
          <div className="flex items-start gap-1 mb-1">
            <span className="text-lg font-bold">£{price.toLocaleString()}</span>
          </div>
          <div className="text-xs text-gray-600">
            {location}
            {distance !== undefined && <span> ({distance} miles)</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultItem;