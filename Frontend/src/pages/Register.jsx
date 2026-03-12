import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'Talent', // Default role
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Backend expects specific fields based on role.
      // E.g., Employer needs companyName, Talent needs fullName. For simplicity, we just pass fullName for now
      // Let's format the payload slightly differently based on role to match backend
      const payload = { ...formData };
      if (formData.role === 'Employer') {
         payload.companyName = formData.fullName; // Map it for employer
         payload.taxId = 'PENDING'; // Dummy data for required backend field
      }

      const response = await axios.post('http://localhost:5002/api/auth/register', payload);

      if (response.data.userId) {
        // Success, now login or redirect to login
        navigate('/login');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-etnBg flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-etnIndigo to-etnViolet">
            Join ETN
          </h1>
          <p className="text-gray-500 mt-2">Create your account</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">I am a...</label>
            <div className="flex space-x-4">
              <label className={`flex-1 flex items-center justify-center p-3 rounded-lg border cursor-pointer transition-colors ${formData.role === 'Talent' ? 'border-etnIndigo bg-indigo-50 text-etnIndigo font-semibold' : 'border-gray-200 text-gray-600'}`}>
                <input type="radio" name="role" value="Talent" checked={formData.role === 'Talent'} onChange={handleChange} className="hidden" />
                Talent
              </label>
              <label className={`flex-1 flex items-center justify-center p-3 rounded-lg border cursor-pointer transition-colors ${formData.role === 'Employer' ? 'border-etnIndigo bg-indigo-50 text-etnIndigo font-semibold' : 'border-gray-200 text-gray-600'}`}>
                <input type="radio" name="role" value="Employer" checked={formData.role === 'Employer'} onChange={handleChange} className="hidden" />
                Employer
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {formData.role === 'Talent' ? 'Full Name' : 'Company Name'}
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-etnIndigo focus:border-etnIndigo outline-none transition-colors"
              placeholder={formData.role === 'Talent' ? 'John Doe' : 'Acme Corp'}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-etnIndigo focus:border-etnIndigo outline-none transition-colors"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-etnIndigo focus:border-etnIndigo outline-none transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-gradient-to-r from-etnIndigo to-etnViolet text-white rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-70 mt-4"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-etnIndigo font-semibold hover:underline">
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
