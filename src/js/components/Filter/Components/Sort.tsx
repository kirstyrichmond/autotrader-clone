import React from "react";
import { useFormikContext } from "formik";
import { FilterState } from "src/store/slices/vehiclesSlice";

const Sort: React.FC = () => {
  const formik = useFormikContext<FilterState>();

  const sortOptions = [
    { value: "relevance", label: "Relevance" },
    { value: "price_asc", label: "Price (low to high)" },
    { value: "price_desc", label: "Price (high to low)" },
    { value: "distance", label: "Distance" },
    { value: "mileage", label: "Mileage" },
    { value: "year_desc", label: "Age (newest)" },
    { value: "year_asc", label: "Age (oldest)" },
    { value: "recent", label: "Most recent" },
  ];

  return (
    <div className="">
      <div className="space-y-2">
        {sortOptions.map((option) => (
          <label
            key={option.value}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <input
              type="radio"
              name="sortBy"
              value={option.value}
              checked={formik.values.sortBy === option.value}
              onChange={(e) => {
                formik.setFieldValue('sortBy', e.target.value);
              }}
              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span className="text-gray-700">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default Sort;
