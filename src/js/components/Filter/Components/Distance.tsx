import React, { useState } from 'react';
import { useFilters } from '@/hooks/useFilters';
import { searchFiltersSchema } from '../../../schemas';

const Distance = () => {
  const { 
    filters,
    localFilters, 
    handleFilterChange,
    handleFilterChangeOnly
  } = useFilters();

  const [postcodeError, setPostcodeError] = useState<string | null>(null);

  const handlePostcodeChange = async (value: string) => {
    // Update the filter value
    handleFilterChangeOnly('postcode', value);
    
    // Validate using Yup schema
    try {
      await searchFiltersSchema.validateAt('postcode', { postcode: value });
      setPostcodeError(null);
    } catch (validationError: any) {
      setPostcodeError(validationError.message);
    }
  };

  const handlePostcodeBlur = (value: string) => {
    if (value) {
      // Format the postcode if it's valid
      const clean = value.replace(/\s/g, '').toUpperCase();
      if (clean.length >= 5) {
        const formatted = clean.slice(0, -3) + ' ' + clean.slice(-3);
        if (formatted !== value) {
          handleFilterChangeOnly('postcode', formatted);
        }
      }
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Postcode or Location
        </label>
        <input
          type="text"
          placeholder="Enter postcode (e.g., M1 1AA)"
          value={filters?.postcode || ''}
          onChange={(e) => handlePostcodeChange(e.target.value)}
          onBlur={(e) => handlePostcodeBlur(e.target.value)}
          className={`
            w-full p-3 sm:p-2 border rounded-lg text-base sm:text-sm
            focus:outline-none focus:ring-2 transition-colors
            min-h-[48px] sm:min-h-[auto] touch-manipulation
            ${postcodeError 
              ? 'border-red-500 focus:ring-red-500 bg-red-50' 
              : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
            }
          `}
        />
        {postcodeError && (
          <p className="mt-2 text-sm text-red-600 flex items-start">
            <span className="inline-block w-1 h-1 bg-red-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
            {postcodeError}
          </p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Search Distance
        </label>
        <select
          value={filters?.radius || 50}
          onChange={(e) => handleFilterChange('radius', Number(e.target.value))}
          className="
            w-full p-3 sm:p-2 border border-gray-300 rounded-lg text-base sm:text-sm
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            min-h-[48px] sm:min-h-[auto] touch-manipulation bg-white
          "
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
  );
};

export default Distance;