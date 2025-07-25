import React from 'react';
import { useFilters } from '@/hooks/useFilters';
import { useFormikContext } from 'formik';
import Input from '../../Input';

interface DistanceProps {
  immediateFilter?: boolean;
}

const Distance: React.FC<DistanceProps> = ({ immediateFilter = true }) => {
  const { 
    filters,
    handleFilterChangeOnly,
    handleImmediateFilterChange
  } = useFilters();

  const formik = useFormikContext<any>();

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Postcode
        </label>
        <Input
          name="postcode"
          label=""
          type="text"
          placeholder="Enter postcode (e.g., M1 1AA)"
          value={formik.values.postcode || ''}
          onChange={(e) => {
            formik.setFieldValue('postcode', e.target.value);
            handleFilterChangeOnly('postcode', e.target.value);
          }}
          meta={{
            valid: !Boolean(formik.errors.postcode),
            error: formik.errors.postcode,
            touched: formik.touched.postcode
          }}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Search Distance
        </label>
        <select
          value={filters?.radius || 50}
          onChange={(e) => {
            const value = e.target.value === 'NATIONAL' ? 'NATIONAL' : Number(e.target.value);
            return immediateFilter 
              ? handleImmediateFilterChange('radius', value)
              : handleFilterChangeOnly('radius', value);
          }}
          className="
            w-full p-3 sm:p-2 border border-gray-300 rounded-lg text-base sm:text-sm
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            min-h-[48px] sm:min-h-[auto] touch-manipulation bg-white
          "
        >
          <option value="NATIONAL">National</option>
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