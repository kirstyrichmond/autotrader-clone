import React from 'react';
import { useFilters } from '@/hooks/useFilters';

const Distance = () => {
  const { 
    localFilters, 
    handleFilterChange, 
    handleFilterBlur, 
    handleImmediateFilterChange 
  } = useFilters();

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Enter postcode"
        value={localFilters?.postcode || ''}
        onChange={(e) => handleFilterChange('postcode', e.target.value)}
        onBlur={() => handleFilterBlur('postcode')}
        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <select
        value={localFilters?.radius || 50}
        onChange={(e) => handleImmediateFilterChange('radius', Number(e.target.value))}
        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
  );
};

export default Distance;