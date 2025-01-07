import React, { Dispatch, SetStateAction, useState } from "react";
import { useAppDispatch } from "../../../store/hooks";
import { register } from "../../../store/slices/authSlice";

const Register: React.FC<{setIsLogIn: Dispatch<SetStateAction<boolean>>}> = ({setIsLogIn}) => {
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await dispatch(register({ email, password })).unwrap();
      console.log('Register successful:', result);
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setIsLoading(false);
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

      {error && <div className="bg-red-50 text-red-600 p-3 rounded">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-gray-700">Email address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="e.g. name@email.com"
            className="p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            autoFocus
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
            className="p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full p-3 rounded text-white font-medium
            ${isLoading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}
          `}
        >
          {isLoading ? "Creating account..." : "Create account"}
        </button>
      </form>
    </div>
  );
};

export default Register;
