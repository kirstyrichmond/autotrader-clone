import React from 'react';
import { X, Plus, SlidersHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FilterState } from '../../../store/slices/vehiclesSlice';

interface FilterBarProps {
  filters: FilterState;
  onOpenFilters: () => void;
  onRemoveFilter: (key: keyof FilterState) => void;
  onClearAll: () => void;
  totalResults?: number;
}

const FilterBar: React.FC<FilterBarProps> = ({ 
  filters, 
  onOpenFilters, 
  onRemoveFilter,
  onClearAll,
  totalResults 
}) => {
  const getFilterLabel = (key: string, value: any) => {
    switch(key) {
      case 'fuelTypes':
        return value.map((type: string) => type).join(', ');
      case 'minPrice':
        return `Min £${value}`;
      case 'maxPrice':
        return `Up to £${value}`;
      case 'minYear':
        return `From ${value}`;
      case 'maxYear':
        return `To ${value}`;
      case 'transmission':
        return value;
      case 'radius':
        return value === 'NATIONAL' ? 'National' : `Within ${value} miles`;
      case 'postcode':
        return value.toUpperCase();
      default:
        return value.toString();
    }
  };

  const activeFilters = Object.entries(filters).filter(([key, value]) => {
    if (['page', 'perPage'].includes(key)) return false;
    if (Array.isArray(value)) return value.length > 0;
    return value !== undefined && value !== '' && value !== 0;
  });

  return (
    <div className="sticky top-0 bg-white z-40">
      <div className="mx-auto px-4 py-4">
        <div className="flex flex-wrap items-center gap-2">
          {activeFilters.map(([key, value]) => (
            <button
              key={key}
              onClick={() => {
                if (key === 'radius') {
                  if (value === 'NATIONAL') {
                    onOpenFilters();
                  } else {
                    onRemoveFilter('radius');
                  }
                } else {
                  onRemoveFilter(key as keyof FilterState);
                }
              }}
              className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100"
            >
              {getFilterLabel(key, value)}
              <X size={14} />
            </button>
          ))}

          <button
            onClick={onOpenFilters}
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
            onClick={onOpenFilters}
            className="flex items-center gap-2 px-4 py-1 bg-blue-600 text-white rounded-full hover:bg-blue-700"
          >
            <SlidersHorizontal size={14} />
            Filter and sort
          </button>

        </div>
          {totalResults && (
          <div className="mb-2">
            <span className="font-medium">{totalResults.toLocaleString()}</span> results
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterBar;