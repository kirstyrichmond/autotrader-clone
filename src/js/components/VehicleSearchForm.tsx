import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { Formik, Form } from "formik";
import { AppDispatch, RootState } from "../../store";
import { fetchVehicles, setFilters } from "../../store/slices/vehiclesSlice";
import Distance from "./Filter/Components/Distance";
import { searchFiltersSchema } from "../schemas";

const VehicleSearchForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const { filters, loading, totalResults } = useSelector((state: RootState) => state.vehicles);

  useEffect(() => {
    const urlFilters: Partial<typeof filters> = {};
    searchParams.forEach((value, key) => {
      urlFilters[key as keyof typeof filters] = value as any;
    });    
    
    if (Object.keys(urlFilters).length > 0) {
      dispatch(setFilters(urlFilters as typeof filters));
      handleSearch(urlFilters as typeof filters, false);
    }
  }, []);

  const handleSearch = async (searchFilters: typeof filters, shouldUpdateUrl: boolean = true) => {
    const params = new URLSearchParams();
    Object.entries(searchFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== '' && value !== 0) {
        params.set(key, value.toString());
      }
    });

    const filtersWithPage = { ...searchFilters, page: 1 };

    if (shouldUpdateUrl) {
      if (location.pathname === '/search') {
        setSearchParams(params);
      } else {
        navigate({
          pathname: '/search',
          search: params.toString()
        });
      }
    }

    try {
      await dispatch(fetchVehicles(filtersWithPage)).unwrap();
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  const handleSubmit = async (values: typeof filters) => {
    try {
      handleSearch(values);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  return (
    <div className="space-y-4">
      <Formik
        initialValues={filters}
        validationSchema={searchFiltersSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ errors, touched }) => (
          <Form className="bg-white rounded-lg shadow-md sm:shadow-lg" noValidate>
            {/* <div className="block px-4 py-3 bg-blue-50 rounded-t-lg border-b border-blue-100">
              <h2 className="text-lg font-semibold text-blue-800">Find Your Perfect Car</h2>
            </div> */}
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              <Distance immediateFilter={false} />
              <button
                type="submit"
                disabled={loading}
                className={`
                  w-full p-3 sm:p-4 text-white bg-blue-600 rounded-lg hover:bg-blue-700 
                  disabled:bg-blue-300 transition-colors font-medium text-sm sm:text-base
                  touch-manipulation min-h-[48px] sm:min-h-[auto]
                  focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                `}
              >
                {loading ? "Searching..." : "Search Cars"}
              </button>
            </div>
          </Form>
        )}
      </Formik>

      {totalResults > 0 && (
        <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-700 text-sm sm:text-base text-center sm:text-left">
            <span className="font-semibold text-blue-600">{totalResults}</span> vehicles found
          </p>
        </div>
      )}
    </div>
  );
};

export default VehicleSearchForm;