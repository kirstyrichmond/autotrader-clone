import React from 'react';
import { useFilters } from '@/hooks/useFilters';
import { Check } from 'lucide-react';

interface FuelTypeOption {
  label: string;
  value: string;
  count: number;
}

const FuelType = () => {
  const { filters, handleMultipleFilterChange } = useFilters();

  const fuelTypes: FuelTypeOption[] = [
    { label: 'Petrol', value: 'Petrol', count: 227283 },
    { label: 'Diesel', value: 'Diesel', count: 118941 },
    { label: 'Electric', value: 'Electric', count: 28796 },
    { label: 'Hybrid', value: 'Hybrid', count: 65434 },
    { label: 'Bi Fuel', value: 'Bi Fuel', count: 301 },
    { label: 'Electric/Petrol Range Ext', value: 'Elec/pet Range Ext', count: 4 },
    { label: 'Hydrogen', value: 'Hydrogen', count: 2 },
    { label: 'Natural Gas', value: 'Natural Gas', count: 1 }
  ];

  const selectedFuelTypes = Array.isArray(filters.fuelTypes) ? filters.fuelTypes : [];

  const handleCheckboxClick = (typeValue: string) => {
    let newValues: string[];
    
    if (selectedFuelTypes.includes(typeValue)) {
      newValues = selectedFuelTypes.filter(type => type !== typeValue);
    } else {
      newValues = [...selectedFuelTypes, typeValue];
    }
    
    handleMultipleFilterChange('fuelTypes', newValues);
  };

  const clearAll = () => {
    handleMultipleFilterChange('fuelTypes', []);
  };

  return (
    <div className="space-y-2">
      {fuelTypes.map((type) => (
        <div
          key={type.value}
          onClick={() => handleCheckboxClick(type.value)}
          className="flex items-center justify-between p-2 hover:bg-gray-100 rounded cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div 
              className={`w-5 h-5 border rounded flex items-center justify-center
                ${selectedFuelTypes.includes(type.value) 
                  ? 'border-blue-500 bg-blue-500' 
                  : 'border-gray-300 group-hover:border-gray-400'}`}
            >
              {selectedFuelTypes.includes(type.value) && (
                <Check className="w-4 h-4 text-white" />
              )}
            </div>
            <span>{type.label}</span>
          </div>
          <span className="text-gray-500 text-sm">{type.count.toLocaleString()}</span>
        </div>
      ))}
      
      {selectedFuelTypes.length > 0 && (
        <button
          onClick={clearAll}
          className="text-blue-500 text-sm hover:underline mt-2"
        >
          Clear all
        </button>
      )}
    </div>
  );
};

export default FuelType;