import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AppDispatch, RootState } from "../../store";
import { fetchVehicles, setFilters } from "../../store/slices/vehiclesSlice";

const VehicleSearchForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const { filters, loading, totalResults } = useSelector((state: RootState) => state.vehicles);

  useEffect(() => {
    const urlFilters: Partial<typeof filters> = {};
    searchParams.forEach((value, key) => {
      urlFilters[key as keyof typeof filters] = value as any;
    });    
    
    if (Object.keys(urlFilters).length > 0) {
      dispatch(setFilters(urlFilters as typeof filters));
      handleSearch(urlFilters as typeof filters, false);
    }
  }, []);

  const handleSearch = async (searchFilters: typeof filters, shouldUpdateUrl: boolean = true) => {
    // Create URLSearchParams with only non-empty values
    const params = new URLSearchParams();
    Object.entries(searchFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== '' && value !== 0) {
        params.set(key, value.toString());
      }
    });

    // Reset to page 1 when filters change
    const filtersWithPage = { ...searchFilters, page: 1 };

    if (shouldUpdateUrl) {
      navigate({
        pathname: '/search',
        search: params.toString()
      });
    }

    dispatch(fetchVehicles(filtersWithPage));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(filters);
  };

  const handleFilterChange = (key: string, value: string | number | undefined) => {
    const newFilters = { ...filters, [key]: value };
    dispatch(setFilters(newFilters));
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="grid gap-6 p-6 bg-white rounded-lg shadow">
        {/* Location Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Location</h2>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Enter postcode"
              value={filters?.postcode || ''}
              onChange={(e) => handleFilterChange('postcode', e.target.value)}
              className="p-2 border rounded"
            />
            <select
              value={filters?.radius || 50}
              onChange={(e) => handleFilterChange('radius', Number(e.target.value))}
              className="p-2 border rounded"
            >
              <option value={500}>National</option>
              <option value={5}>Within 5 miles</option>
              <option value={10}>Within 10 miles</option>
              <option value={20}>Within 20 miles</option>
              <option value={30}>Within 30 miles</option>
              <option value={50}>Within 50 miles</option>
              <option value={75}>Within 75 miles</option>
              <option value={100}>Within 100 miles</option>
            </select>
          </div>
        </div>

        {/* Price Range Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Price Range</h2>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              placeholder="Min price"
              value={filters?.minPrice || ''}
              onChange={(e) => handleFilterChange('minPrice', e.target.value ? Number(e.target.value) : undefined)}
              className="p-2 border rounded"
            />
            <input
              type="number"
              placeholder="Max price"
              value={filters?.maxPrice || ''}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
              className="p-2 border rounded"
            />
          </div>
        </div>

        {/* Vehicle Details Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Vehicle Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Make"
              value={filters?.make || ''}
              onChange={(e) => handleFilterChange('make', e.target.value)}
              className="p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Model"
              value={filters?.model || ''}
              onChange={(e) => handleFilterChange('model', e.target.value)}
              className="p-2 border rounded"
            />
            
            <select
              value={filters?.bodyType || ''}
              onChange={(e) => handleFilterChange('bodyType', e.target.value || undefined)}
              className="p-2 border rounded"
            >
              <option value="">Any body type</option>
              <option value="Hatchback">Hatchback</option>
              <option value="Saloon">Saloon</option>
              <option value="Estate">Estate</option>
              <option value="SUV">SUV</option>
              <option value="Coupe">Coupe</option>
              <option value="Convertible">Convertible</option>
            </select>

            <select
              value={filters?.transmission || ''}
              onChange={(e) => handleFilterChange('transmission', e.target.value || undefined)}
              className="p-2 border rounded"
            >
              <option value="">Any transmission</option>
              <option value="Automatic">Automatic</option>
              <option value="Manual">Manual</option>
            </select>

            <select
              value={filters?.fuelTypes || ''}
              onChange={(e) => handleFilterChange('fuelType', e.target.value || undefined)}
              className="p-2 border rounded"
            >
              <option value="">Any fuel type</option>
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="Electric">Electric</option>
              <option value="Hybrid">Hybrid</option>
            </select>

            {/* Year Range */}
            <select
              value={filters?.minYear || ''}
              onChange={(e) => handleFilterChange('minYear', e.target.value ? Number(e.target.value) : undefined)}
              className="p-2 border rounded"
            >
              <option value="">Min year</option>
              {Array.from({ length: 24 }, (_, i) => 2024 - i).map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full p-3 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:bg-blue-300"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {/* {totalResults > 0 && (
        <div className="p-4 bg-gray-50 rounded">
          <p className="text-gray-700">{totalResults} vehicles found</p>
        </div>
      )} */}
    </div>
  );
};

export default VehicleSearchForm;