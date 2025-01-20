import React from 'react';
import { useFilters } from '@/hooks/useFilters';
import dayjs from 'dayjs';

const Gearbox = () => {
  const { localFilters, handleImmediateFilterChange } = useFilters();

  return (
    <div className="">
      <label>Manual</label>
      <input type="checkbox" value={localFilters?.transmission || 'Manual'}
        onChange={(e) => handleImmediateFilterChange('transmission', e.target.value)}
        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <label>Automatic</label>
      <input type="checkbox" value={localFilters?.transmission || 'Automatic'}
        onChange={(e) => handleImmediateFilterChange('transmission', e.target.value)}
        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};

export default Gearbox;