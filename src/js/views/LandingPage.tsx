import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearFilters, fetchVehicles } from "../../store/slices/vehiclesSlice";
import { openAuthModal } from "../../store/slices/authSlice";
import VehicleSearchForm from "@/components/VehicleSearchForm";
import bannerImage from "../../assets/images/banner.avif";
import { AppDispatch, RootState } from "../../store";
import { useNavigate } from "react-router-dom";
import { Car, Laptop, Smartphone } from "lucide-react";

export default function Main() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  useEffect(() => {
    dispatch(clearFilters());
    dispatch(fetchVehicles({
      postcode: '',
      radius: 'NATIONAL',
      page: 1,
      perPage: 1000
    }));
  }, [dispatch]);

  const handleSignIn = () => {
    if (isAuthenticated) {
      navigate('/secure/my-autotrader');
    } else {
      dispatch(openAuthModal());
    }
  };

  return (
    <div>
      <div className="relative min-h-[500px] md:h-[600px] lg:h-[700px] w-full overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${bannerImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent"></div>
        </div>
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="w-full lg:w-1/2 xl:w-2/5 py-8 md:py-16">
            <div className="mb-6 md:mb-8 text-white">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 drop-shadow-lg leading-tight">
                Find Your Perfect Car
              </h1>
              <p className="text-base sm:text-lg md:text-xl opacity-90 drop-shadow-md leading-relaxed">
                Search thousands of quality used cars from trusted dealers across the UK
              </p>
            </div>
            <div className="max-w-full sm:max-w-md lg:max-w-lg">
              <VehicleSearchForm />
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
          Discover more from Autotrader Clone
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col">
            <div className="h-48 bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
              <Car className="w-20 h-20 text-white opacity-80" />
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <h3 className="text-xl font-bold mb-2">Leasing you can trust, now with Autotrader Clone</h3>
              <p className="text-gray-600 mb-4 flex-1">
                The price you see is the price you get - no admin fees added on.
              </p>
              <button
                onClick={() => navigate('/search?radius=NATIONAL&page=1&perPage=1000')}
                className="px-5 py-2.5 border-2 border-blue-600 text-blue-600 rounded-full hover:bg-blue-50 transition-colors font-medium text-sm"
              >
                Find your lease
              </button>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col">
            <div className="h-48 bg-gradient-to-br from-teal-600 to-teal-800 flex items-center justify-center">
              <Laptop className="w-20 h-20 text-white opacity-80" />
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <h3 className="text-xl font-bold mb-2">Sell your car, your way</h3>
              <p className="text-gray-600 mb-4 flex-1">
                Get a free, instant valuation in seconds and choose the best way to sell.
              </p>
              <button
                onClick={handleSignIn}
                className="px-5 py-2.5 border-2 border-blue-600 text-blue-600 rounded-full hover:bg-blue-50 transition-colors font-medium text-sm"
              >
                Sell your car
              </button>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col">
            <div className="h-48 bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
              <Smartphone className="w-20 h-20 text-white opacity-80" />
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <h3 className="text-xl font-bold mb-2">Get the full experience</h3>
              <p className="text-gray-600 mb-4 flex-1">
                See your saved cars, track progress and pick up right where you left off.
              </p>
              <button
                onClick={handleSignIn}
                className="px-5 py-2.5 border-2 border-blue-600 text-blue-600 rounded-full hover:bg-blue-50 transition-colors font-medium text-sm"
              >
                Sign in
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
