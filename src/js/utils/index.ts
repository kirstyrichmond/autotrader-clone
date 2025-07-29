export const formatCurrency = (value: number | null | undefined): string => {
  if (value === null || value === undefined || isNaN(value)) {
    return 'Price on request';
  }
  
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatMileage = (mileage: number | string | null | undefined): string => {
  if (mileage === null || mileage === undefined || mileage === '') {
    return 'Mileage unavailable';
  }
  
  const mileageNumber = typeof mileage === 'string' ? parseInt(mileage, 10) : mileage;
  
  if (isNaN(mileageNumber)) {
    return 'Mileage unavailable';
  }
  
  const formattedNumber = new Intl.NumberFormat('en-GB').format(mileageNumber);
  
  return `${formattedNumber} miles`;
};

export const formatNumber = (value: number | null | undefined): string => {
  if (value === null || value === undefined || isNaN(value)) {
    return '0';
  }
  
  return new Intl.NumberFormat('en-GB').format(value);
};