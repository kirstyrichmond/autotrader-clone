import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { AppDispatch, RootState } from "../../store";
import { fetchVehicles, setFilters } from "../../store/slices/vehiclesSlice";
import Distance from "./Filter/Components/Distance";
import { searchFiltersSchema } from "../schemas";

const VehicleSearchForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
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
    const params = new URLSearchParams();
    Object.entries(searchFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== '' && value !== 0) {
        params.set(key, value.toString());
      }
    });

    const filtersWithPage = { ...searchFilters, page: 1 };

    if (shouldUpdateUrl) {
      if (location.pathname === '/search') {
        setSearchParams(params);
      } else {
        navigate({
          pathname: '/search',
          search: params.toString()
        });
      }
    }

    try {
      await dispatch(fetchVehicles(filtersWithPage)).unwrap();
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    try {
      await searchFiltersSchema.validate(filters, { abortEarly: false });
      handleSearch(filters);
    } catch (validationError: any) {
      if (validationError.errors && validationError.errors.length > 0) {
        setFormError(validationError.errors[0]);
      } else {
        setFormError('Please check your search criteria');
      }
    }
  };

  const handleFilterChange = (key: string, value: string | number | undefined) => {
    const newFilters = { ...filters, [key]: value };
    dispatch(setFilters(newFilters));
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="grid gap-6 p-6 bg-white rounded-lg shadow">
        <Distance />
        
        {formError && (
          <div className="p-3 text-red-700 bg-red-100 border border-red-300 rounded">
            {formError}
          </div>
        )}
        
        <button
          type="submit"
          disabled={loading}
          className="w-full p-3 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:bg-blue-300"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {totalResults > 0 && (
        <div className="p-4 bg-gray-50 rounded">
          <p className="text-gray-700">{totalResults} vehicles found</p>
        </div>
      )}
    </div>
  );
};

export default VehicleSearchForm;