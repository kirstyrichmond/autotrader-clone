import { Dispatch, SetStateAction, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../src/store/hooks';
import { login } from '../../../../src/store/slices/authSlice';

const Login: React.FC<{setIsLogIn: Dispatch<SetStateAction<boolean>>}> = ({setIsLogIn}) => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector(state => state.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with:', { email, password });
    
    try {
      const result = await dispatch(login({ email, password })).unwrap();
      console.log('Login successful:', result);
    } catch (err) {
      console.error('Login failed:', err);
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
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded">
          {error}
        </div>
      )}
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
          disabled={loading}
          className={`w-full p-3 rounded text-white font-medium
            ${loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}
          `}
        >
          {loading ? 'Signing in...' : 'Sign in'}
          </button>
      </form>
    </div>
  );
};

export default Login;