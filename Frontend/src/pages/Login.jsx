import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5002/api/auth/login', {
        email,
        password,
      });

      if (response.data.token) {
        localStorage.setItem('etn_token', response.data.token);
        localStorage.setItem('etn_user', JSON.stringify({
          email: response.data.email,
          role: response.data.role
        }));
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-etnLight text-gray-800 flex items-center justify-center p-4">
      <div className="bg-white p-10 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] w-full max-w-md border border-gray-100 relative overflow-hidden">
        
        {/* Subtle Decorative Accent */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-etnNavy via-etnGreen to-etnGold"></div>

        <div className="text-center mb-10 mt-2">
          <div className="w-16 h-16 bg-etnNavy text-white rounded-xl flex items-center justify-center text-3xl font-black mx-auto mb-4 shadow-lg shadow-etnNavy/30">
            E
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            Welcome Back
          </h1>
          <p className="text-gray-500 mt-2 text-sm font-medium">Log in to the Ethiopian Talent Network</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-etnRed/20 text-etnRed p-3 rounded-xl mb-6 text-sm text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-etnNavy focus:border-etnNavy outline-none transition-all text-gray-800 font-medium"
                placeholder="name@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex justify-between">
              Password
              <span className="text-xs text-etnNavy cursor-pointer hover:underline font-bold">Forgot?</span>
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-etnNavy focus:border-etnNavy outline-none transition-all text-gray-800 font-medium tracking-widest"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-etnNavy hover:bg-blue-900 text-white rounded-xl font-bold transition-all shadow-md text-base"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center text-sm text-gray-500 font-medium">
          New to ETN?{' '}
          <Link to="/register" className="text-etnGreen font-bold hover:text-green-700 transition-colors hover:underline">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
