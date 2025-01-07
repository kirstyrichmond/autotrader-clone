import React from "react";
import * as yup from "yup";

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
    postcode: yup.string().required("Required"),
    engine_size: yup.string().required("Required"),
    attention_grabber: yup.string().required("Required"),
})