import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Card } from '@/components/ui/card';
import { Pen, Trash2, Camera } from 'lucide-react';
import { API_BASE_URL } from '../config/api';

interface VehicleListing {
  id: number;
  make: string;
  model: string;
  price: number;
  year: string;
  mileage: string;
  images: Array<{ preview: string; url: string }>;
  status: string;
  created_at: string;
  attention_grabber: string;
}

const MyAdverts: React.FC = () => {
  const navigate = useNavigate();
  const [listings, setListings] = useState<VehicleListing[]>([]);
//   const [activeTab, setActiveTab] = useState<'incomplete' | 'live' | 'expired'>('live');
  const user = useSelector((state: RootState) => state.auth.user);

  const fetchMyListings = async (userId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/vehicles/user/${userId}`);
      const data = await response.json();
      setListings(data);
    } catch (error) {
      console.error('Error fetching listings:', error);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchMyListings(user.id);
    }
  }, [user?.id]);

  const handleEditListing = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    navigate(`/selling/edit/${id}`);
  };
  
  const handleDeleteListing = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this listing?')) {
      try {
        await fetch(`${API_BASE_URL}/vehicles/${id}`, {
          method: 'DELETE',
        });
        fetchMyListings(user?.id ?? 0);
      } catch (error) {
        console.error('Error deleting listing:', error);
      }
    }
  };

//   const filteredListings = listings.filter(listing => {
//     switch (activeTab) {
//       case 'incomplete':
//         return listing.status === 'incomplete';
//       case 'live':
//         return listing.status === 'active';
//       case 'expired':
//         return listing.status === 'expired';
//       default:
//         return true;
//     }
//   });

const getImageUrl = (listing: VehicleListing) => {
    if (listing.images?.[0]) {
      return listing.images[0].url || listing.images[0].preview;
    }
    return '';
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-light">My adverts</h1>
        <p className="text-gray-600 mt-2">Advert views and calls update every 24 hours</p>
      </div>

      {/* Create new advert button */}
      <button
        onClick={() => navigate('/selling/find-car')}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg mb-8 hover:bg-blue-700"
      >
        Create an advert
      </button>

      {/* View toggle */}
      {/* <div className="flex items-center gap-4 mb-6">
        <span className="text-sm text-gray-600">Slim view</span>
        <label className="relative inline-block w-12 h-6">
          <input type="checkbox" className="hidden" />
          <div className="w-12 h-6 bg-gray-200 rounded-full cursor-pointer"></div>
          <div className="absolute w-4 h-4 bg-white rounded-full shadow top-1 left-1"></div>
        </label>
        <span className="text-sm text-gray-600">Showing an expanded view of your adverts</span>
      </div> */}

      {/* Tabs */}
      <div className="border-b mb-6">
        <div className="flex gap-6">
          {/* <button
            className={`pb-2 px-1 ${activeTab === 'incomplete' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
            onClick={() => setActiveTab('incomplete')}
          >
            Incomplete ({listings.filter(l => l.status === 'incomplete').length})
          </button> */}
          {/* <button
            className={`pb-2 px-1 ${activeTab === 'live' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
            onClick={() => setActiveTab('live')}
          >
            Live ({listings.filter(l => l.status === 'active').length})
          </button> */}
          {/* <button
            className={`pb-2 px-1 ${activeTab === 'expired' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
            onClick={() => setActiveTab('expired')}
          >
            Expired ({listings.filter(l => l.status === 'expired').length})
          </button> */}
        </div>
      </div>

      {/* Listings */}
      <div className="space-y-4">
        {listings.map(listing => (
          <Card onClick={() => navigate(`/car-details/${listing.id}`)} key={listing.id} className="p-4 cursor-pointer">
            <div className="flex gap-6">
              {/* Image */}
              <div className="w-48 h-36 relative bg-gray-100 rounded-lg overflow-hidden">
                {getImageUrl(listing) ? (
                  <img
                    src={getImageUrl(listing)}
                    alt={`${listing.make} ${listing.model}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Camera className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="flex-1">
                <div className="flex justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">
                      {listing.make} {listing.model}
                    </h2>
                    <p className="text-gray-600">{listing.attention_grabber || 'No attention grabber added'}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                        onClick={(e) => handleEditListing(e, listing.id)}
                        className="py-2 px-3 text-gray-600 hover:text-blue-600"
                    >
                      <Pen className="w-5 h-5" />
                    </button>
                    <button
                      onClick={(e) => handleDeleteListing(e, listing.id)}
                      className="py-2 px-3 text-gray-600 hover:text-red-600"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="flex gap-4 mt-4">
                  <span className="text-sm text-gray-600">Advert views: -</span>
                  <span className="text-sm text-gray-600">Calls received: -</span>
                </div>

                <div className="mt-4 text-sm text-gray-500">
                  <span>Advert ID: {listing.id}</span>
                  <span className="mx-4">•</span>
                  <span>Created: {new Date(listing.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MyAdverts;