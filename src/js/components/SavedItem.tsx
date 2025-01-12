import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { ResultItemProps, Vehicle } from '@/components/ResultItem';
import { Trash2 } from 'lucide-react';
import { removeFavorite } from '../../store/slices/favoritesSlice';
import { useNavigate } from 'react-router-dom';

const SavedItem: React.FC<ResultItemProps>  = ({vehicle}) => {
  const {
    id,
    images,
    make,
    model,
    price,
    year,
    body_type,
    mileage,
    transmission,
    fuel_type,
    engine_size,
  } = vehicle;
  const dispatch = useDispatch<AppDispatch>();
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const navigate = useNavigate();
  
  const getImageUrl = (vehicle: Vehicle) => {
    if (images?.[0]) {
      if (images[0].url?.startsWith('data:image')) {
        return images[0].url;
      }
      return images[0].preview || images[0].url;
    }
    return '';
  };

  if (!userId) {
    console.log('No user ID found');
    return;
  }

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();

    console.log('Delete', id);

    await dispatch(removeFavorite({ 
        userId,
        vehicleId: id 
      })).unwrap();
  };

  const handleClick = () => {
    navigate(`/car-details/${id}`);
  };
    
  return (
    <div 
      onClick={handleClick}
      className="flex flex-col md:flex-row bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
    >
      {/* Left side - Image */}
      <div className="relative w-full md:w-2/5">
        {getImageUrl(vehicle) ? (
          <img
            src={getImageUrl(vehicle)}
            alt={`${make} ${model}`}
            className="w-full h-28 object-cover"
          />
        ) : (
          <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
            <p className="text-gray-500">No image available</p>
          </div>
        )}
      </div>

      {/* Right side - Vehicle details */}
      <div className="w-full md:w-3/5 p-1">
        <div className="flex">
            <span className="text-sm font-normal">£{price}</span>
        </div>
        <h2 className="text-base font-medium text-blue-600 pb-1">{make} {model}</h2>
        <div className="flex flex-wrap gap-1 text-gray-800 text-[10px] mb-4 font-base leading-[10px]">
          <span>{mileage} miles</span>
          <span>|</span>
          <span>{year}</span>
          <span>|</span>
          <span>{body_type}</span>
          <span>|</span>
          <span>{engine_size}</span>
          <span>|</span>
          <span>{transmission}</span>
          <span>|</span>
          <span>{fuel_type}</span>
        </div>
      </div>
      <button
        onClick={(e) => handleDelete(e)}
        className="py-2 px-3 h-10 text-gray-600 hover:text-red-600"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  )
}

export default SavedItem