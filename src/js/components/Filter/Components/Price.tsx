import React from 'react';
import { useFilters } from '@/hooks/useFilters';

const Price = () => {
  const { localFilters, handleFilterChange, handleImmediateFilterChange } = useFilters();

  const priceOptions = [
    {
      label: "Any",
      value: 0
    },
    {
      label: "£0",
      value: 0
    },
    {
      label: "£500",
      value: 500
    },
    {
      label: "£1,000",
      value: 1000
    },
    {
      label: "£1,500",
      value: 1500
    },
    {
      label: "£2,000",
      value: 2000
    },
    {
      label: "£2,500",
      value: 2500
    },
    {
      label: "£3,000",
      value: 3000
    },
    {
      label: "£3,500",
      value: 3500
    },
    {
      label: "£4,000",
      value: 4000
    },
    {
      label: "£4,500",
      value: 4500
    },
    {
      label: "£5,000",
      value: 5000
    },
    {
      label: "£5,500",
      value: 5500
    },
    {
      label: "£6,000",
      value: 6000
    },
    {
      label: "£6,500",
      value: 6500
    },
    {
      label: "£7,000",
      value: 7000
    },
    {
      label: "£7,500",
      value: 7500
    },
    {
      label: "£8,000",
      value: 8000
    },
    {
      label: "£8,500",
      value: 8500
    },
    {
      label: "£9,000",
      value: 9000
    },
    {
      label: "£9,500",
      value: 9500
    },
    {
      label: "£10,000",
      value: 10000
    },
    {
      label: "£11,000",
      value: 11000
    },
    {
      label: "£12,000",
      value: 12000
    },
    {
      label: "£13,000",
      value: 13000
    },
    {
      label: "£14,000",
      value: 14000
    },
    {
      label: "£15,000",
      value: 15000
    },
    {
      label: "£16,000",
      value: 16000
    },
    {
      label: "£17,000",
      value: 17000
    },
    {
      label: "£18,000",
      value: 18000
    },
    {
      label: "£19,000",
      value: 19000
    },
    {
      label: "£20,000",
      value: 20000
    },
    {
      label: "£22,500",
      value: 22500
    },
    {
      label: "£25,000",
      value: 25000
    },
    {
      label: "£27,500",
      value: 27500
    },
    {
      label: "£30,000",
      value: 30000
    },
    {
      label: "£35,000",
      value: 35000
    },
    {
      label: "£40,000",
      value: 40000
    },
    {
      label: "£45,000",
      value: 45000
    },
    {
      label: "£50,000",
      value: 50000
    },
    {
      label: "£55,000",
      value: 55000
    },
    {
      label: "£60,000",
      value: 60000
    },
    {
      label: "£65,000",
      value: 65000
    },
    {
      label: "£70,000",
      value: 70000
    },
    {
      label: "£75,000",
      value: 75000
    },
    {
      label: "£100,000",
      value: 100000
    },
    {
      label: "£250,000",
      value: 250000
    },
    {
      label: "£500,000",
      value: 500000
    },
    {
      label: "£1000,000",
      value: 1000000
    },
    {
      label: "£2000,000",
      value: 2000000
    },
  ]

  return (
    <div className="">
      <label className="">From</label>
      <select
        value={localFilters?.minPrice}
        onChange={(e) => handleImmediateFilterChange('minPrice', e.target.value)}
        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {priceOptions.map((option, index) => (
          <option key={index} value={option.value}>{option.label}</option>
        ))}
      </select>
      <label className="py-1">To</label>
      <select
        value={localFilters?.maxPrice}
        onChange={(e) => handleImmediateFilterChange('maxPrice', e.target.value)}
        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {priceOptions.map((option, index) => (
          <option key={index} value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  );
};

export default Price;