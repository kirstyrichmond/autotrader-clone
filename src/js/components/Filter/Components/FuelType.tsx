import { Check } from 'lucide-react';
import { useFormikContext } from 'formik';
import { FilterState } from 'src/store/slices/vehiclesSlice';

interface FuelTypeOption {
  label: string;
  value: string;
}

const FuelType = () => {
  const formik = useFormikContext<FilterState>();

  const fuelTypes: FuelTypeOption[] = [
    { label: 'Petrol', value: 'Petrol' },
    { label: 'Diesel', value: 'Diesel' },
    { label: 'Electric', value: 'Electric' },
  ];

  const selectedFuelTypes = Array.isArray(formik.values.fuelType) ? formik.values.fuelType : [];

  const handleCheckboxClick = (typeValue: string) => {
    let newValues: string[];

    if (selectedFuelTypes.includes(typeValue)) {
      newValues = selectedFuelTypes.filter(type => type !== typeValue);
    } else {
      newValues = [...selectedFuelTypes, typeValue];
    }

    formik.setFieldValue('fuelType', newValues);
  };

  const clearAll = () => {
    formik.setFieldValue('fuelType', []);
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