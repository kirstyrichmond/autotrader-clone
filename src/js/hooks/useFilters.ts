import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AppDispatch, RootState } from '../../store';
import { fetchVehicles, setFilters } from '../../store/slices/vehiclesSlice';

export const useFilters = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { filters, loading, totalResults, error } = useSelector((state: RootState) => state.vehicles);
  const [localFilters, setLocalFilters] = useState<typeof filters>({ ...filters });

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

    if (shouldUpdateUrl) {
      navigate({
        pathname: '/search',
        search: params.toString()
      });
    }

    dispatch(fetchVehicles({ ...searchFilters, page: 1 }));
  };

  const handleFilterChange = (key: string, value: string | number | undefined) => {
    const newFilters = {
      ...filters,
      [key]: value,
      page: 1
    };
    dispatch(setFilters(newFilters));
    
    // Only auto-search for non-text inputs (like dropdowns)
    // Text inputs like postcode should only search on form submit
    if (key !== 'postcode') {
      handleSearch(newFilters);
    }
  };

  const handleFilterChangeOnly = (key: string, value: string | number | undefined) => {
    const newFilters = {
      ...filters,
      [key]: value,
      page: 1
    };
    setLocalFilters(prev => ({ ...prev, [key]: value }));
    dispatch(setFilters(newFilters));
    // Don't trigger search automatically
  };

  const handleFilterBlur = (key: keyof typeof filters) => {
    if (localFilters[key] !== filters[key]) {
      const newFilters = { ...filters, [key]: localFilters[key] };
      dispatch(setFilters(newFilters));
      handleSearch(newFilters);
    }
  };

  const handleImmediateFilterChange = (key: string, value: string | number | undefined) => {
    const newFilters = { ...filters, [key]: value };
    setLocalFilters(prev => ({ ...prev, [key]: value }));
    dispatch(setFilters(newFilters));
    handleSearch(newFilters);
  };

  const handleMultipleFilterChange = (key: string, values: string[] | []) => {
    const newFilters = {
      ...filters,
      [key]: values,
      page: 1
    };
    
    dispatch(setFilters(newFilters));
    handleSearch(newFilters);
  };

  return {
    filters,
    localFilters,
    loading,
    totalResults,
    error,
    handleFilterChange,
    handleFilterChangeOnly,
    handleFilterBlur,
    handleImmediateFilterChange,
    handleMultipleFilterChange
  };
};