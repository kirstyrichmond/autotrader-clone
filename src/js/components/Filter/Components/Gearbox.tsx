import { useFormikContext } from 'formik';
import { FilterState } from 'src/store/slices/vehiclesSlice';
import { Check } from 'lucide-react';

const Gearbox = () => {
  const formik = useFormikContext<FilterState>();

  const transmissionOptions = [
    { value: 'Manual', label: 'Manual' },
    { value: 'Automatic', label: 'Automatic' },
    { value: 'Semi-Automatic', label: 'Semi-Automatic' }
  ];

  const selectedTransmissions = Array.isArray(formik.values.transmission) ? formik.values.transmission : [];

  const handleCheckboxClick = (value: string) => {
    let newValues: string[];

    if (selectedTransmissions.includes(value)) {
      newValues = selectedTransmissions.filter(type => type !== value);
    } else {
      newValues = [...selectedTransmissions, value];
    }

    formik.setFieldValue('transmission', newValues);
  };

  const clearAll = () => {
    formik.setFieldValue('transmission', []);
  };

  return (
    <div className="space-y-2">
      {transmissionOptions.map((option) => (
        <div
          key={option.value}
          onClick={() => handleCheckboxClick(option.value)}
          className="flex items-center justify-between p-2 hover:bg-gray-100 rounded cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-5 h-5 border rounded flex items-center justify-center
                ${selectedTransmissions.includes(option.value)
                  ? 'border-blue-500 bg-blue-500'
                  : 'border-gray-300 group-hover:border-gray-400'}`}
            >
              {selectedTransmissions.includes(option.value) && (
                <Check className="w-4 h-4 text-white" />
              )}
            </div>
            <span>{option.label}</span>
          </div>
        </div>
      ))}
      {selectedTransmissions.length > 0 && (
        <button
          type="button"
          onClick={clearAll}
          className="text-blue-500 text-sm hover:underline mt-2"
        >
          Clear all
        </button>
      )}
    </div>
  );
};

export default Gearbox;