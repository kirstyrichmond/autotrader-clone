import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Heart, Share2, ArrowLeft, Phone, CameraIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { fetchVehicleById } from '../../store/slices/listingsSlice';
import { AppDispatch, RootState } from '../../store';
import { IoLocationSharp as LocationIcon } from "react-icons/io5";
import GalleryModal from '@/components/GalleryModal';
import { Vehicle } from '@/components/ResultItem';
import { addFavorite, fetchFavorites, removeFavorite } from '../../store/slices/favoritesSlice';
import { createChat } from '../../store/slices/chatSlice';

const CarDetails = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { currentListing: vehicle, loading, error } = useSelector((state: RootState) => state.vehicles);
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const favorites = useSelector((state: RootState) => state.favorites.favorites);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const isFavorite = favorites.some((favorite) => favorite.id === vehicle?.id);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!userId) {
      console.log('No user ID found');
      return;
    }
    
    if (!vehicle?.id) {
      console.log('No vehicle ID found');
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

  const startChat = async () => {
    if (!userId || !vehicle) {
      return;
    }
  
    try {
      const result = await dispatch(createChat({
        listing_id: vehicle.id,
        buyer_id: userId,
        seller_id: vehicle.user_id
      })).unwrap();
      
      navigate(`/chats/${result.id}`);
    } catch (error) {
      console.error('Failed to start chat:', error);
    }
  };

  useEffect(() => {
    if (id) {
      dispatch(fetchVehicleById(parseInt(id)));
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [dispatch, id]);

  useEffect(() => {
    if (userId) {
      dispatch(fetchFavorites(userId));
    }
  }, [userId, dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-600">
        Error: {error}
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Vehicle not found
      </div>
    );
  }

  const parsedImages = vehicle.images ? (
    typeof vehicle.images === 'string' ? JSON.parse(vehicle.images) : vehicle.images
  ) : [];

  const handleBack = () => {
    navigate(-1);
  };

  const openGallery = (index: number) => {
    setSelectedImageIndex(index);
    setIsGalleryOpen(true);
  };

  const getImageUrl = (listing: Vehicle) => {
    if (listing.images?.[0]) {
      return listing.images[0].url || listing.images[0].preview;
    }
    return '';
  };

  const getsServiceHistory = (serviceHistory: string) => {
    switch (serviceHistory) {
        case 'F':
            return 'Full service history';
        case 'P':
            return 'Partial service history';
        case 'N':
            return 'None';
        default:
            return serviceHistory
    }
  }

  return (
    <>
      <div className="max-w-7xl mx-auto bg-white">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <button 
            onClick={handleBack}
            className="flex items-center text-blue-600 gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to results
          </button>
          <div className="flex gap-4">
            <button 
              onClick={handleFavoriteClick}
              disabled={vehicle.user_id === userId}
              className={`${isFavorite ? 'text-red-500' : 'text-gray-600'} hover:text-red-500`}
            >
              <Heart className="w-6 h-6" fill={isFavorite ? 'currentColor' : 'none'} />
            </button>
            <button className="text-gray-600 hover:text-gray-800">
              <Share2 className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
          {/* Left column - Images */}
          <div className="relative">
            <div 
              onClick={() => openGallery(0)}
              className="cursor-pointer relative"
            >
              {getImageUrl(vehicle) ? (
                <img
                  src={getImageUrl(vehicle)}
                  alt={`${vehicle.make} ${vehicle.model}`}
                  className="w-full h-96 object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-96 bg-gray-200 flex items-center justify-center rounded-lg">
                  <p className="text-gray-500">No image available</p>
                </div>
              )}
            <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
                <span className="flex items-center gap-1">
                <CameraIcon className="w-4 h-4" />
                {parsedImages.length}
                </span>
            </div>
              {parsedImages.length > 0 && (
                <button 
                  onClick={() => setIsGalleryOpen(true)}
                  className="absolute bottom-4 right-4 bg-white text-gray-800 px-4 py-2 rounded-full hover:bg-gray-100"
                >
                  View gallery
                </button>
              )}
            </div>
          </div>

          {/* Right column - Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-semibold">{vehicle.make} {vehicle.model}</h1>
              <p className="text-xl text-gray-600 mt-2">
                {vehicle.engine_size} {vehicle.fuel_type} {vehicle.transmission} ({vehicle.power})
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <span className="bg-gray-100 px-4 py-2 rounded-full text-sm">
                {vehicle.mileage} miles
              </span>
              <span className="bg-gray-100 px-4 py-2 rounded-full text-sm">
                {vehicle.year}
              </span>
              <span className="bg-gray-100 px-4 py-2 rounded-full text-sm">
                {vehicle.transmission}
              </span>
              <span className="bg-gray-100 px-4 py-2 rounded-full text-sm">
                {vehicle.fuel_type}
              </span>
            </div>

            <div className="">
              <div className="text-lg font-semibold mb-4">{vehicle.attention_grabber}</div>
              <div className="text-4xl font-bold">£{vehicle.price}</div>
              <button 
                onClick={startChat}
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg mt-6 hover:bg-blue-700"
                disabled={vehicle.user_id === userId}
              >
                Message seller
              </button>
            </div>

            <Card className="p-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{vehicle.dealer_name}</h3>
                  <div className="flex items-center gap-2 text-gray-600">
                    <LocationIcon className="w-5 h-5" />
                    <span>{vehicle.location}</span>
                  </div>
                </div>
                {/* <button className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700">
                  <Phone className="w-5 h-5" />
                </button> */}
              </div>
            </Card>
          </div>
        </div>

        {/* Description section */}
        <div className="p-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Description</h2>
            <p className="text-gray-600 whitespace-pre-line">{vehicle.description}</p>
          </Card>
        </div>

        {/* Vehicle details section */}
        <div className="p-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Vehicle details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { label: 'Mileage', value: `${vehicle.mileage} miles`, },
                { label: 'Year', value: vehicle.year },
                { label: 'Fuel type', value: vehicle.fuel_type },
                { label: 'Transmission', value: vehicle.transmission },
                { label: 'Engine size', value: vehicle.engine_size },
                { label: 'Body type', value: vehicle.body_type },
                { label: 'Doors', value: '5' },
                { label: 'Owners', value: vehicle.owners },
                { label: 'Service history', value: getsServiceHistory(vehicle.service_history), display: vehicle.service_history },
              ].map(({label, value, display = true}, index) => (
                <div key={index} className="flex items-center gap-3">
                  { display && <div>
                    <div className="text-sm text-gray-600">{label}</div>
                    <div className="font-medium">{value}</div>
                  </div>}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Gallery Modal */}
      <GalleryModal
        images={parsedImages}
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        initialImageIndex={selectedImageIndex}
      />
    </>
  );
};

export default CarDetails;