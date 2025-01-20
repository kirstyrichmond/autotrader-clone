import React from 'react';
import { useFilters } from '@/hooks/useFilters';
import dayjs from 'dayjs';

const Year = () => {
  const { localFilters, handleImmediateFilterChange } = useFilters();

  const yearOptions = [
    {
      label: "2025",
      value: 2025
    },
    {
      label: "2024",
      value: 2024
    },
    {
      label: "2023",
      value: 2023
    },
    {
      label: "2022",
      value: 2022
    },
    {
      label: "2021",
      value: 2021
    },
    {
      label: "2020",
      value: 2020
    },
    {
      label: "2019",
      value: 2019
    },
    {
      label: "2018",
      value: 2018
    },
    {
      label: "2017",
      value: 2017
    },
    {
      label: "2016",
      value: 2016
    },
    {
      label: "2015",
      value: 2015
    },
    {
      label: "2014",
      value: 2014
    },
    {
      label: "2013",
      value: 2013
    },
    {
      label: "2012",
      value: 2012
    },
    {
      label: "2011",
      value: 2011
    },
    {
      label: "2010",
      value: 2010
    },
    {
      label: "2009",
      value: 2009
    },
    {
      label: "2008",
      value: 2008
    },
    {
      label: "2007",
      value: 2007
    },
    {
      label: "2006",
      value: 2006
    },
    {
      label: "2005",
      value: 2005
    },
    {
      label: "2004",
      value: 2004
    },
    {
      label: "2003",
      value: 2003
    },
    {
      label: "2002",
      value: 2002
    },
    {
      label: "2001",
      value: 2001
    },
    {
      label: "2000",
      value: 2000
    },
    {
      label: "1995",
      value: 1995
    },
    {
      label: "1990",
      value: 1990
    },
    {
      label: "1980",
      value: 1980
    },
    {
      label: "1970",
      value: 1970
    },
    {
      label: "1960",
      value: 1960
    },
    {
      label: "1950",
      value: 1950
    },
    {
      label: "1940",
      value: 1940
    },
    {
      label: "1930",
      value: 1930
    },
  ]

  return (
    <div className="">
      <label className="pb-1">From</label>
      <select
        value={localFilters?.minYear}
        onChange={(e) => handleImmediateFilterChange('minYear', e.target.value)}
        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value={1930}>Any</option>
        {yearOptions.map((option, index) => (
          <option key={index} value={option.value}>{option.label}</option>
        ))}
      </select>
      <label>To</label>
      <select
        value={localFilters?.maxYear}
        onChange={(e) => handleImmediateFilterChange('maxYear', e.target.value)}
        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value={dayjs().year()}>Any</option>
        {yearOptions.map((option, index) => (
          <option key={index} value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  );
};

export default Year;