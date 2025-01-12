import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { Vehicle } from '@/components/ResultItem';
import SavedItem from '@/components/SavedItem';
import { fetchFavorites } from '../../store/slices/favoritesSlice';

const Saved = () => {
  const dispatch = useDispatch<AppDispatch>();
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const favorites = useSelector((state: RootState) => state.favorites.favorites);

  useEffect(() => {
    if (userId) {
      dispatch(fetchFavorites(userId));
    }
  }, [userId, dispatch]);
  
  return (
    <div className="max-w-[700px] mx-auto">
      <div className="mt-6 mb-4 flex justify-center">
        <span className="font-light text-xl">{ `${favorites.length} ${favorites.length > 1 ? 'vehicles' : 'vehicle'}` } saved</span>
        
      </div>
      <div>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {favorites.map((vehicle: Vehicle) => (
            <li className='my-4' key={vehicle.id}>
              <SavedItem vehicle={vehicle} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Saved;