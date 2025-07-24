import React from "react";
import * as yup from "yup";

// Custom postcode validation function
const validatePostcode = (value?: string): boolean => {
  if (!value) return true; // Allow empty postcodes
  
  // Remove spaces and convert to uppercase
  const cleanPostcode = value.replace(/\s/g, '').toUpperCase();
  
  // UK postcode regex pattern
  const postcodeRegex = /^[A-Z]{1,2}[0-9][A-Z0-9]?[0-9][A-BD-HJLNP-UW-Z]{2}$/;
  
  return postcodeRegex.test(cleanPostcode);
};

// Search filters schema
export const searchFiltersSchema = yup.object().shape({
  postcode: yup.string().test('postcode', 'Please enter a valid UK postcode (e.g., M1 1AA)', validatePostcode),
  radius: yup.number().min(1).max(500),
  make: yup.string(),
  model: yup.string(),
  minPrice: yup.number().min(0),
  maxPrice: yup.number().min(0),
  minYear: yup.number().min(1900),
  maxYear: yup.number().max(new Date().getFullYear() + 1),
  minMileage: yup.number().min(0),
  maxMileage: yup.number().min(0),
  transmission: yup.string(),
  fuelType: yup.array().of(yup.string()),
  bodyType: yup.string(),
});

export const findCarSchema = yup.object().shape({
    registration: yup.string().required("Required"),
    mileage: yup.string().required("Required"),
})

export const advertSchema = yup.object().shape({
    make: yup.string().required("Required"),
    model: yup.string().required("Required"),
    year: yup.string().required("Required"),
    body_type: yup.string().required("Required"),
    mileage: yup.string().required("Required"),
    registration: yup.string().required("Required"),
    price: yup.number().required("Required"),
    mot_due: yup.string().required("Required"),
    description: yup.string().required("Required"),
    power: yup.string().required("Required"),
    transmission: yup.string().required("Required"),
    fuel_type: yup.string().required("Required"),
    owners: yup.string().required("Required"),
    service_history: yup.string().required("Required"),
    condition: yup.string().required("Required"),
    postcode: yup.string().required("Required").test('postcode', 'Please enter a valid UK postcode (e.g., M1 1AA)', validatePostcode),
    engine_size: yup.string().required("Required"),
    attention_grabber: yup.string().required("Required"),
})