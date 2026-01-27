import React, { useMemo } from 'react';
import { Plus, SlidersHorizontal } from 'lucide-react';
import { FilterState } from '../../../store/slices/vehiclesSlice';
import { formatNumber } from '../../utils/index';

interface FilterBarProps {
  filters: FilterState;
  onOpenFilters: (filterKey?: string) => void;
  onClearAll: () => void;
  totalResults?: number;
}

const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onOpenFilters,
  onClearAll,
  totalResults
}) => {
  const getFilterLabel = (key: string, value: any) => {
    switch(key) {
      case 'fuelType':
        if (value.length === 1) return value[0];
        return `Fuel types (${value.length})`;
      case 'transmission':
        if (value.length === 1) return value[0];
        return `Gearboxes (${value.length})`;
      case 'priceRange':
        if (value.min && value.max) return `£${formatNumber(value.min)} - £${formatNumber(value.max)}`;
        if (value.min) return `Min £${formatNumber(value.min)}`;
        return `Up to £${formatNumber(value.max)}`;
      case 'yearRange':
        if (value.min && value.max) return `${value.min} - ${value.max}`;
        if (value.min) return `From ${value.min}`;
        return `To ${value.max}`;
      case 'mileageRange':
        if (value.min && value.max) return `${formatNumber(value.min)} - ${formatNumber(value.max)} miles`;
        if (value.min) return `Min ${formatNumber(value.min)} miles`;
        return `Up to ${formatNumber(value.max)} miles`;
      case 'transmission':
        return value;
      case 'radius':
        return value === 'NATIONAL' ? 'National' : `Within ${value} miles`;
      case 'postcode':
        return value.toUpperCase();
      case 'sortBy':
        const sortLabels: Record<string, string> = {
          'relevance': 'Relevance',
          'price_asc': 'Price (low to high)',
          'price_desc': 'Price (high to low)',
          'distance': 'Distance',
          'mileage': 'Mileage',
          'year_desc': 'Age (newest)',
          'year_asc': 'Age (oldest)',
          'recent': 'Most recent'
        };
        return sortLabels[value] || value;
      default:
        return value.toString();
    }
  };

  const activeFilters = useMemo(() => {
    const combined: Array<[string, any]> = [];
    const skip = new Set(['page', 'perPage', 'minPrice', 'maxPrice', 'minYear', 'maxYear', 'minMileage', 'maxMileage']);

    if (filters.minPrice || filters.maxPrice) {
      combined.push(['priceRange', { min: filters.minPrice, max: filters.maxPrice }]);
    }
    if (filters.minYear || filters.maxYear) {
      combined.push(['yearRange', { min: filters.minYear, max: filters.maxYear }]);
    }
    if (filters.minMileage || filters.maxMileage) {
      combined.push(['mileageRange', { min: filters.minMileage, max: filters.maxMileage }]);
    }

    Object.entries(filters).forEach(([key, value]) => {
      if (skip.has(key)) return;
      if (key === 'sortBy' && value === 'relevance') return;

      if (Array.isArray(value)) {
        if (value.length > 0) combined.push([key, value]);
      } else if (value !== undefined && value !== '' && value !== 0 && value !== null) {
        combined.push([key, value]);
      }
    });

    return combined;
  }, [filters]);

  const getAccordionLabel = (key: string): string => {
    const mapping: Record<string, string> = {
      'sortBy': 'Sort',
      'postcode': 'Distance from you',
      'radius': 'Distance from you',
      'priceRange': 'Price',
      'yearRange': 'Year',
      'mileageRange': 'Mileage',
      'transmission': 'Gearbox',
      'fuelType': 'Fuel type',
      'bodyType': 'Body type',
      'make': 'Make and model',
      'model': 'Make and model'
    };
    return mapping[key] || '';
  };

  return (
    <div className="sticky top-0 bg-white z-40">
      <div className="mx-auto px-6 py-4">
        <div className="flex flex-wrap items-center gap-2">
          {activeFilters.map(([key, value]) => (
            <button
              key={key}
              onClick={() => onOpenFilters(getAccordionLabel(key))}
              className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100"
            >
              {getFilterLabel(key, value)}
            </button>
          ))}

          <button
            onClick={() => onOpenFilters()}
            className="flex items-center gap-2 px-3 py-1 border bg-white border-blue-600 text-blue-600 rounded-full hover:bg-blue-50"
          >
            <Plus size={14} />
            Add filter
          </button>

          {activeFilters.length > 0 && (
            <button
              onClick={onClearAll}
              className="ml-auto text-blue-600 hover:underline bg-gray-50"
            >
              Clear all
            </button>
          )}

          <button
            onClick={() => onOpenFilters()}
            className="flex items-center gap-2 px-4 py-1 bg-blue-600 text-white rounded-full hover:bg-blue-700"
          >
            <SlidersHorizontal size={14} />
            Filter and sort
          </button>

        </div>
          {(totalResults ?? 0) > 0 && (
          <div className="px-2 pt-4">
            <span className="font-medium">{formatNumber(totalResults)}</span> results
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterBar;