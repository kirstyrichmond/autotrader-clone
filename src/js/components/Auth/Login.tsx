import { Dispatch, SetStateAction } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../src/store/hooks';
import { login } from '../../../../src/store/slices/authSlice';
import { Formik, Form, FormikHelpers } from "formik";
import { loginSchema } from "../../schemas/index";
import Input from "../Input";

interface LoginFormValues {
  email: string;
  password: string;
}

const Login: React.FC<{setIsLogIn: Dispatch<SetStateAction<boolean>>}> = ({setIsLogIn}) => {
  const dispatch = useAppDispatch();
  const { error } = useAppSelector(state => state.auth);

  const initialValues: LoginFormValues = {
    email: "",
    password: "",
  };

  const handleSubmit = async (
    values: LoginFormValues,
    { setSubmitting, setStatus }: FormikHelpers<LoginFormValues>
  ) => {
    try {
      setStatus(null);
      console.log('Form submitted with:', values);
      const result = await dispatch(login({ 
        email: values.email, 
        password: values.password 
      })).unwrap();
      console.log('Login successful:', result);
    } catch (err: any) {
      console.error('Login failed:', err);
      setStatus(err.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col space-y-8">
      <p className="text-sm text-gray-600">
        New here?{" "}
        <button onClick={() => setIsLogIn(false)} className="text-blue-600 hover:underline bg-transparent">
          Create an account
        </button>
      </p>

      <Formik
        initialValues={initialValues}
        validationSchema={loginSchema}
        onSubmit={handleSubmit}
      >
        {(formik) => (
          <Form className="space-y-6">
            {(error || formik.status) && (
              <div className="bg-red-50 text-red-600 p-3 rounded">
                {formik.status || error}
              </div>
            )}

            <Input
              name="email"
              label="Email address"
              type="email"
              value={formik.values.email}
              placeholder="e.g. name@email.com"
              autoComplete="email"
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
              autoComplete="current-password"
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
              {formik.isSubmitting ? 'Signing in...' : 'Sign in'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Login;