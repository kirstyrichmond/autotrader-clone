import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { setFilters, fetchVehicles, FilterState } from '../../store/slices/vehiclesSlice';
import Results from '@/components/Results';
import FilterDialog from '@/components/Filter/FilterDialog';
import FilterBar from '@/components/Filter/FilterBar';

const SearchResults = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [pendingFilters, setPendingFilters] = useState<FilterState | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  
  const { items: vehicles, loading, error, totalResults, filters } = useSelector(
    (state: RootState) => state.vehicles
  );

  const handleClearAll = () => {
    dispatch(setFilters({
      radius: 500,
      page: 1,
      perPage: 20,
      fuelTypes: []
    }));
    scrollToTop();
  };

  useEffect(() => {
    const baseFilters: FilterState = {
      postcode: '',
      radius: 50,
      page: 1,
      perPage: 20,
      fuelTypes: [],
      minPrice: undefined,
      maxPrice: undefined,
      minYear: undefined,
      maxYear: undefined,
      minMileage: undefined,
      maxMileage: undefined,
      transmission: undefined,
      bodyType: undefined,
      make: undefined,
      model: undefined
    };

    searchParams.forEach((value, key) => {
      if (key === 'fuelTypes') {
        baseFilters.fuelTypes = value ? value.split(',') : [];
      } else if (['minPrice', 'maxPrice', 'minYear', 'maxYear', 'minMileage', 'maxMileage', 'radius', 'page', 'perPage'].includes(key)) {
        baseFilters[key] = value ? Number(value) : undefined;
      } else {
        baseFilters[key] = value || undefined;
      }
    });

    dispatch(setFilters(baseFilters));
    setPendingFilters(baseFilters);

    if (baseFilters.postcode || searchParams.size > 0) {
      dispatch(fetchVehicles(baseFilters));
    }
  }, [searchParams, dispatch]);

  const handleRemoveFilter = (key: string) => {
    const newFilters = { ...filters };
    if (key === 'fuelTypes') {
      newFilters.fuelTypes = [];
    } else {
      newFilters[key] = undefined;
    }
    
    const params = new URLSearchParams(searchParams);
    params.delete(key);
    
    navigate({
      pathname: '/search',
      search: params.toString()
    });
    
    dispatch(setFilters(newFilters));
    dispatch(fetchVehicles(newFilters));
    scrollToTop();
  };

  const handleSearch = () => {
    if (pendingFilters) {
      dispatch(fetchVehicles(pendingFilters));
      scrollToTop();
    }
  };

  const scrollToTop = () => {
    resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div ref={resultsRef}>
      <FilterBar
        filters={filters}
        onOpenFilters={() => setIsFilterOpen(true)}
        onRemoveFilter={handleRemoveFilter}
        onClearAll={handleClearAll}
        totalResults={totalResults}
      />
      <div className="mx-auto px-4 py-4">
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {vehicles.length > 0 && <Results vehicles={vehicles} />}
        {!loading && vehicles.length === 0 && (
          <div className="p-4 bg-white rounded shadow">
            <p>No vehicles found matching your criteria</p>
          </div>
        )}
      </div>
      <FilterDialog 
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onSearch={handleSearch}
      />
    </div>
  );
};

export default SearchResults;