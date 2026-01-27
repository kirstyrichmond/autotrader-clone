import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { setFilters, fetchVehicles, FilterState } from '../../store/slices/vehiclesSlice';
import { fetchFavorites } from '../../store/slices/favoritesSlice';
import Results from '@/components/Results';
import FilterDialog from '@/components/Filter/FilterDialog';
import FilterBar from '@/components/Filter/FilterBar';

const SearchResults = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<string | undefined>(undefined);
  const resultsRef = useRef<HTMLDivElement>(null);

  const { items: vehicles, loading, error, totalResults, filters } = useSelector(
    (state: RootState) => state.vehicles
  );

  const userId = useSelector((state: RootState) => state.auth.user?.id);

  const handleClearAll = () => {
    const params = new URLSearchParams();
    if (filters.postcode) {
      params.set('postcode', filters.postcode);
    }
    params.set('radius', 'NATIONAL');
    params.set('sortBy', 'relevance');
    params.set('page', '1');
    params.set('perPage', '1000');

    navigate({
      pathname: '/search',
      search: params.toString()
    });
    scrollToTop();
  };

  useEffect(() => {
    const baseFilters: FilterState = {
      postcode: '',
      radius: 50,
      page: 1,
      perPage: 1000,
      sortBy: 'relevance',
      fuelType: [],
      transmission: [],
      minPrice: undefined,
      maxPrice: undefined,
      minYear: undefined,
      maxYear: undefined,
      minMileage: undefined,
      maxMileage: undefined,
      bodyType: undefined,
      make: undefined,
      model: undefined
    };

    searchParams.forEach((value, key) => {
      if (key === 'fuelType' || key === 'transmission') {
        baseFilters[key] = value ? value.split(',') : [];
      } else if (['minPrice', 'maxPrice', 'minYear', 'maxYear', 'minMileage', 'maxMileage', 'page', 'perPage'].includes(key)) {
        (baseFilters as any)[key] = value ? Number(value) : undefined;
      } else if (key === 'radius') {
        (baseFilters as any)[key] = value === 'NATIONAL' ? 'NATIONAL' : (value ? Number(value) : undefined);
      } else {
        (baseFilters as any)[key] = value || undefined;
      }
    });

    dispatch(setFilters(baseFilters));

    if (baseFilters.postcode || searchParams.size > 0) {
      dispatch(fetchVehicles(baseFilters));
    }
  }, [searchParams, dispatch]);

  useEffect(() => {
    if (userId) {
      dispatch(fetchFavorites(userId));
    }
  }, [userId, dispatch]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSearch = (searchFilters: FilterState) => {
    dispatch(setFilters(searchFilters));

    const params = new URLSearchParams();
    Object.entries(searchFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          if (value.length > 0) {
            params.set(key, value.join(','));
          }
        } else if (value !== 0 || key === 'minPrice') {
          params.set(key, value.toString());
        }
      }
    });

    navigate({
      pathname: '/search',
      search: params.toString()
    });

    dispatch(fetchVehicles(searchFilters));
    scrollToTop();
  };

  const handleOpenFilters = (filterKey?: string) => {
    setActiveAccordion(filterKey);
    setIsFilterOpen(true);
  };

  const handleCloseFilters = () => {
    setIsFilterOpen(false);
    setActiveAccordion(undefined);
  };

  const scrollToTop = () => {
    resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div ref={resultsRef}>
      <FilterBar
        filters={filters}
        onOpenFilters={handleOpenFilters}
        onClearAll={handleClearAll}
        totalResults={totalResults}
      />
      <div className="mx-auto px-4 py-4">
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {(vehicles.length > 0) && <Results vehicles={vehicles} />}
        {!loading && !(vehicles.length > 0) && (
          <div className="p-4 bg-white rounded shadow">
            <p>No vehicles found matching your criteria</p>
          </div>
        )}
      </div>
      <FilterDialog
        isOpen={isFilterOpen}
        onClose={handleCloseFilters}
        onSearch={handleSearch}
        activeAccordion={activeAccordion}
      />
    </div>
  );
};

export default SearchResults;