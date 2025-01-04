import React, { useState } from 'react';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      console.log('Login successful:', data);

      localStorage.setItem('token', data.token);
    } catch (error) {
      setErrorMessage((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-800">
      <div className="flex justify-center items-center min-h-screen text-white">
        <form
          onSubmit={handleLogin}
          className="bg-gray-700 p-8 rounded-lg shadow-lg"
        >
          <h2 className="text-3xl font-bold mb-6 text-center">Login</h2>
          {errorMessage && (
            <p className="mb-4 text-red-500 text-center">{errorMessage}</p>
          )}
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium mb-1">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={formData.username}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
