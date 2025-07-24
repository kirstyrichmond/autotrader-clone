import React, { Dispatch, SetStateAction, useEffect } from "react";
import { useAppDispatch } from "../../../store/hooks";
import { register, clearError } from "../../../store/slices/authSlice";
import { Formik, Form, FormikHelpers } from "formik";
import { registerSchema } from "../../schemas/index";
import Input from "../Input";

interface RegisterFormValues {
  email: string;
  password: string;
}

const Register: React.FC<{setIsLogIn: Dispatch<SetStateAction<boolean>>}> = ({setIsLogIn}) => {
  const dispatch = useAppDispatch();

  const initialValues: RegisterFormValues = {
    email: "",
    password: "",
  };

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleSubmit = async (
    values: RegisterFormValues,
    { setSubmitting, setStatus }: FormikHelpers<RegisterFormValues>
  ) => {
    try {
      setStatus(null);
      const result = await dispatch(register({ 
        email: values.email, 
        password: values.password 
      })).unwrap();
      console.log('Register successful:', result);
    } catch (err: any) {
      setStatus(err.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col space-y-8">
      <p className="text-sm text-gray-600">
        Already got an account?{" "}
        <button onClick={() => setIsLogIn(true)} className="text-blue-600 hover:underline bg-transparent">
          Sign in
        </button>
      </p>

      <Formik
        initialValues={initialValues}
        validationSchema={registerSchema}
        onSubmit={handleSubmit}
      >
        {(formik) => (
          <Form className="space-y-6" noValidate>
            {formik.status && (
              <div className="bg-red-50 text-red-600 p-3 rounded">{formik.status}</div>
            )}

            <Input
              name="email"
              label="Email address"
              type="email"
              value={formik.values.email}
              placeholder="e.g. name@email.com"
              meta={{
                valid: !Boolean(formik.errors.email),
                error: formik.errors.email,
                touched: formik.touched.email
              }}
              onChange={formik.handleChange}
            />

            <Input
              name="password"
              label="Password"
              type="password"
              value={formik.values.password}
              placeholder="Enter your password"
              autoComplete="new-password"
              meta={{
                valid: !Boolean(formik.errors.password),
                error: formik.errors.password,
                touched: formik.touched.password
              }}
              onChange={formik.handleChange}
            />

            <button
              type="submit"
              disabled={formik.isSubmitting}
              className={`w-full p-3 rounded text-white font-medium
                ${formik.isSubmitting ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}
              `}
            >
              {formik.isSubmitting ? "Creating account..." : "Create account"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Register;
