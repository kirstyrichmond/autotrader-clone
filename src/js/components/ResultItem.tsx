import React from "react";
import { FaRegHeart as SavedIcon } from "react-icons/fa";
import { IoMdCamera as CameraIcon } from "react-icons/io";
import { IoLocationSharp as LocationIcon } from "react-icons/io5";
import { AiFillStar as StarIcon } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

export interface Vehicle {
  id: number;
  images: any[];
  price: number;
  make: string;
  model: string;
  year: string;
  body_type: string;
  mileage: string;
  power: string;
  transmission: string;
  fuel_type: string;
  owners?: number;
  service_history?: string;
  condition?: string;
  dealer_name?: string;
  dealer_rating?: number;
  review_count?: number;
  location: string;
  latitude: number;
  longitude: number;
  engine_size?: string;
  attention_grabber?: string;
  distance?: number;
}

export interface ResultItemProps {
  vehicle: Vehicle;
}

const ResultItem: React.FC<ResultItemProps> = ({ vehicle }) => {
  const {
    images,
    make,
    model,
    price,
    year,
    body_type,
    mileage,
    transmission,
    fuel_type,
    owners,
    service_history,
    condition,
    dealer_name,
    dealer_rating,
    review_count,
    location,
    distance,
    engine_size,
    power,
    attention_grabber,
  } = vehicle;

  const navigate = useNavigate();
  
  const parsedImages = images ? (
    typeof images === 'string' ? JSON.parse(images) : images
  ) : [];

  const getImageUrl = (vehicle: Vehicle) => {
    if (vehicle.images?.[0]) {
      // If the image starts with data:image, it's a Base64 string
      if (vehicle.images[0].url?.startsWith('data:image')) {
        return vehicle.images[0].url;
      }
      // Otherwise use the preview or URL
      return vehicle.images[0].preview || vehicle.images[0].url;
    }
    return '';
  };

  const handleClick = () => {
    navigate(`/car-details/${vehicle.id}`);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Add save functionality here
  };

  return (
    <div 
      onClick={handleClick}
      className="flex flex-col md:flex-row bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
    >
      {/* Left side - Image gallery */}
      <div className="relative w-full md:w-2/5">
        {getImageUrl(vehicle) ? (
          <img
            src={getImageUrl(vehicle)}
            alt={`${make} ${model}`}
            className="w-full h-96 object-cover"
          />
        ) : (
          <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
            <p className="text-gray-500">No image available</p>
          </div>
        )}
        <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
          <span className="flex items-center gap-1">
            <CameraIcon className="w-4 h-4" />
            {parsedImages.length}
          </span>
        </div>
      </div>

      {/* Right side - Vehicle details */}
      <div className="w-full md:w-3/5 p-4">
        {/* Top section */}
        <div className="flex justify-between items-start mb-2">
          {condition && (
            <span className="bg-orange-400 text-white px-3 py-1 rounded-md text-sm font-medium">
              {condition}
            </span>
          )}
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold">£{price}</span>
            <div 
              onClick={handleSave}
              className="flex items-center gap-1 text-blue-600 hover:text-blue-800 cursor-pointer"
            >
              <SavedIcon className="text-lg" />
              <span className="text-sm">Save</span>
            </div>
          </div>
        </div>

        {/* Vehicle title and subtitle */}
        <h2 className="text-lg font-medium text-blue-600">{make} {model}</h2>
        { attention_grabber && <p className="text-gray-800 mb-3">{attention_grabber}</p>}

        {/* Vehicle specifications */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-gray-800 text-sm mb-4 font-bold">
          <span>{year}</span>
          <span>|</span>
          <span>{body_type}</span>
          <span>|</span>
          <span>{mileage} miles</span>
          <span>|</span>
          <span>{engine_size}</span>
          <span>|</span>
          <span>{power}</span>
          <span>|</span>
          <span>{transmission}</span>
          <span>|</span>
          <span>{fuel_type}</span>
          <span>|</span>
          <span>{owners} owners</span>
          {service_history && (
            <>
              <span>|</span>
              <span>Full service history</span>
            </>
          )}
        </div>

        {/* Dealer information */}
        <div className="flex items-center justify-between mt-auto">
          <div>
            {dealer_name && 
              <div className="text-blue-600">
                {dealer_name} - See all 6 cars
              </div>
            }
            <div className="flex items-center gap-2 text-sm">
              {dealer_rating !== undefined && dealer_rating > 0 && 
                <div className="flex items-center gap-1">
                  <StarIcon className="text-blue-600" />
                  <span>{dealer_rating}</span>
                  <span className="text-blue-600">({review_count} reviews)</span>
                </div>
              }
              <div className="flex items-center gap-1 text-gray-600">
                <LocationIcon />
                <span>{location}</span>
                {distance !== undefined && <span>({distance} miles)</span>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultItem;