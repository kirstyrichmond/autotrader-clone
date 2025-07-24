import FilterBox from "@/components/Filter/Filter";
import Results from "@/components/Results";
import dayjs from "dayjs";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../store/hooks";
import { EMPTY_ADVERT, setVehicleData, VehicleData } from "../../store/slices/advertSlice";
import { Formik, FormikHelpers, Form } from "formik";
import { findCarSchema } from "@/schemas";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import Input from "@/components/Input";

export default function FindCar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [regSubmitted, setRegSubmitted] = useState(false);

  const vehicleData = useSelector((state: RootState) => state.advert.vehicleData);
  const [newVehicleData, setNewVehicleData] = useState(vehicleData);

  const initialValues = {
    registration: newVehicleData.registration || '',
    mileage: newVehicleData.mileage || '',
  }

  interface FormikType {
    resetForm: () => void;
  }

  const resetForm = (formik: FormikType) => {
    formik.resetForm();

    setNewVehicleData(EMPTY_ADVERT);

    setRegSubmitted(false);
  }

  const capitaliseFormat = (str: string) => {
    const lowercaseStr = str.toLowerCase();
    return lowercaseStr.charAt(0).toUpperCase() + lowercaseStr.slice(1);
  }

  const handleOnSubmit = async (
    values: {
      registration: string;
      mileage: string;
  },
    formikHelpers: FormikHelpers<{ registration: string; mileage: string; }>
) => {
    setRegSubmitted(true);

    try {
      const response = await fetch(`https://api.checkcardetails.co.uk/vehicledata/ukvehicledata?apikey=a4f9dd779332ef5b7bb63284df671f6f&vrm=${values.registration}`, {
        method: "GET",
        redirect: 'follow',
      });

      console.log('Step 1 - Initial Response:', response.status);

      const data = await response.json();
      console.log('Step 2 - Data received:', data);

      if (!response.ok) {
        console.log('Step 3a - API Error:', data);
        throw new Error(data.error || "Vehicle lookup failed");
      }

      console.log('Step 3b - Processing data');
      try {
        const vehicleData = {
          make: data?.VehicleRegistration?.MakeModel?.split(' ')[0] || '',
          model: data?.VehicleRegistration?.MakeModel?.split(' ').slice(1).join(' ') || '',
          variant: data?.SmmtDetails?.Range || '',
          mileage: values.mileage,
          fuel_type: capitaliseFormat(data?.VehicleRegistration?.FuelType) || '',
          body_type: data?.SmmtDetails?.BodyStyle || '',
          transmission: data?.VehicleRegistration?.TransmissionType || '',
          registration: values.registration || '',
          colour: capitaliseFormat(data?.VehicleRegistration?.Colour) || '',
          date_first_registered: data?.VehicleRegistration?.DateFirstRegistered || '',
          year: dayjs(data?.VehicleRegistration?.DateFirstRegistered).year().toString(),
          owners: data?.VehicleHistory?.NumberOfPreviousKeepers || 0,
          mot_due: data?.Mot?.ExpiryDate || '',
          service_history: data?.service_history || '',
          price: null,
          images: [],
          user_id: null
        };

        console.log('Step 4 - Vehicle data formatted:', vehicleData);

        setRegSubmitted(true);
        setNewVehicleData(vehicleData);
        dispatch(setVehicleData(vehicleData));
        formikHelpers.resetForm({ values });

        console.log('Step 5 - Data dispatched to Redux');
      } catch (dataError) {
        throw new Error('Error processing vehicle data');
      }

    } catch (err: any) {
      console.error('Error in submission:', err);
    }
};

  const detailRows = [
    { label: 'Registration', value: newVehicleData?.registration },
    { label: 'Mileage', value: newVehicleData.mileage },
    { label: 'Fuel type', value: newVehicleData?.fuel_type },
    { label: 'Body type', value: newVehicleData?.body_type },
    { label: 'Colour', value: newVehicleData?.colour },
    { label: 'Transmission', value: newVehicleData?.transmission },
    { label: 'Date of first registration', value: dayjs(newVehicleData?.date_first_registered).format('DD/MM/YYYY') },
  ];

  return (
    <Formik
    enableReinitialize={ true }
    initialValues={ initialValues }
    onSubmit={ handleOnSubmit }
    validationSchema={ findCarSchema }
    validate={values => {
      console.log("Validating with schema:", findCarSchema);
      console.log("Validation values:", values);
      try {
          findCarSchema.validateSync(values);
          console.log("Validation passed!");
      } catch (err) {
          console.log("Validation failed:", err);
      }
      }}
    >
    { (formik) => {
    return (
        // @ts-ignore
      <Form>
      <div className={`flex flex-col my-16 mx-32 gap-4 ${regSubmitted && 'items-center' }`}>
          <h1 className="text-2xl font-semibold mb-4">Find Your Car</h1>
          { regSubmitted ? (
          <><div className="max-w-3xl mx-auto p-8 bg-white rounded-lg shadow">
          <div className="space-y-4 min-w-96 mb-4">
            <div className="space-y-1">
              <h1 className="text-base font-semibold text-gray-800">{newVehicleData?.make} {newVehicleData?.model}</h1>
            </div>
            <div className="space-y-4 mt-8">
              {detailRows.map(({ label, value }) => (
                <div
                  key={label}
                  className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0"
                >
                  <span className="text-gray-700">{label}</span>
                  <span className="text-gray-600 font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>
          <button
              type="button"
              onClick={() => navigate(`/selling/advert`)}
              className={`w-full p-3 rounded text-white font-medium bg-blue-600 hover:bg-blue-700`}
            >
              Create advert
          </button>
        </div>
        <p>Not the right car? <button onClick={() => resetForm(formik)} className="p-3 rounded text-blue-700 bg-transparent underline font-medium ">Search again</button></p>
        </>
        ) : (
          <>
            <Input
              label="Registration number"
              description="Due to the limitations of the test API, the registration number must contain the letter 'A'."
              name="registration"
              value={ formik.values.registration }
              meta={ {
                  valid: !Boolean(formik.errors.registration),
                  error: formik.errors.registration,
                  touched: formik.touched.registration
              } }
              onChange={(e) => formik.handleChange(e) }
            />
            <Input
              label="Current mileage"
              name="mileage"
              value={ formik.values.mileage }
              meta={ {
                  valid: !Boolean(formik.errors.mileage),
                  error: formik.errors.mileage,
                  touched: formik.touched.mileage
              } }
              onChange={ formik.handleChange }
            />
            <button
              type="submit"
              // onClick={handleSubmit}
              className={`w-full p-3 rounded text-white font-medium bg-blue-600 hover:bg-blue-700`}
            >
              Find my car
            </button>
          </>
        )}
      </div>
      </Form>
    )}
  }
      </Formik>
  );
}
