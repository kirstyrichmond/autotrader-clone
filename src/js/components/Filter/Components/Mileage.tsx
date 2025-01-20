import React from 'react';
import { useFilters } from '@/hooks/useFilters';
import dayjs from 'dayjs';

const Mileage = () => {
  const { localFilters, handleImmediateFilterChange } = useFilters();

  const mileageOptions = [
    {
      label: "0 miles",
      value: 0
    },
    {
      label: "100 miles",
      value: 100
    },
    {
      label: "500 miles",
      value: 500
    },
    {
      label: "5000 miles",
      value: 5000
    },
    {
      label: "10,000 miles",
      value: 10000
    },
    {
      label: "15,000 miles",
      value: 15000
    },
    {
      label: "20,000 miles",
      value: 20000
    },
    {
      label: "25,000 miles",
      value: 25000
    },
    {
      label: "30,000 miles",
      value: 30000
    },
    {
      label: "35,000 miles",
      value: 35000
    },
    {
      label: "40,000 miles",
      value: 40000
    },
    {
      label: "45,000 miles",
      value: 45000
    },
    {
      label: "50,000 miles",
      value: 50000
    },
    {
      label: "60,000 miles",
      value: 60000
    },
    {
      label: "70,000 miles",
      value: 70000
    },
    {
      label: "80,000 miles",
      value: 80000
    },
    {
      label: "90,000 miles",
      value: 90000
    },
    {
      label: "100,000 miles",
      value: 100000
    },
    {
      label: "125,000 miles",
      value: 125000
    },
    {
      label: "150,000 miles",
      value: 150000
    },
    {
      label: "200,000 miles",
      value: 200000
    },
  ]

  return (
    <div className="">
      <label className="pb-1">From</label>
      <select
        value={localFilters?.minMileage}
        onChange={(e) => handleImmediateFilterChange('minMileage', e.target.value)}
        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {/* <option value={0}>Any</option> */}
        {mileageOptions.map((option, index) => (
          <option key={index} value={option.value}>{option.label}</option>
        ))}
      </select>
      <label>To</label>
      <select
        value={localFilters?.maxMileage}
        onChange={(e) => handleImmediateFilterChange('maxMileage', e.target.value)}
        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {/* <option value={250000}>Any</option> */}
        {mileageOptions.map((option, index) => (
          <option key={index} value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  );
};

export default Mileage;