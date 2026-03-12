import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Form State
  const [fullName, setFullName] = useState('');
  const [skills, setSkills] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('etn_token');
        if (!token) {
          navigate('/login');
          return;
        }

        const res = await axios.get('http://localhost:5002/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.data.success) {
          const user = res.data.data;
          setProfile(user);
          setFullName(user.fullName || '');
          setSkills(user.skills ? user.skills.join(', ') : '');
          setPortfolioUrl(user.portfolioUrl || '');
        }
      } catch (err) {
        setError('Failed to load profile.');
        if (err.response?.status === 401) {
          localStorage.removeItem('etn_token');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      const token = localStorage.getItem('etn_token');
      const res = await axios.put('http://localhost:5002/api/users/profile', {
        fullName,
        skills, // API handles splitting string to array
        portfolioUrl
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        setSuccess('Profile updated successfully!');
        setProfile(res.data.data);
      }
    } catch (err) {
      setError('Failed to update profile.');
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading profile...</div>;

  return (
    <div className="min-h-screen bg-etnBg text-etnDark">
      <nav className="bg-white shadow-sm px-8 py-4 flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-etnIndigo to-etnViolet">
          <Link to="/">ETN</Link>
        </h1>
        <div className="flex items-center gap-4">
          <Link to="/" className="text-sm font-medium text-gray-600 hover:text-etnIndigo transition-colors">Dashboard</Link>
        </div>
      </nav>

      <div className="p-8 max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-3xl font-bold text-etnIndigo mb-6">Profile Management</h2>

          {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6">{error}</div>}
          {success && <div className="bg-green-50 text-green-600 p-3 rounded-lg mb-6">{success}</div>}

          <form onSubmit={handleUpdate} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input 
                type="text" 
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-etnIndigo outline-none" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Skills (comma separated)</label>
              <input 
                type="text" 
                value={skills}
                onChange={e => setSkills(e.target.value)}
                placeholder="e.g. React, Node.js, Python"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-etnIndigo outline-none" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Portfolio URL</label>
              <input 
                type="text" 
                value={portfolioUrl}
                onChange={e => setPortfolioUrl(e.target.value)}
                placeholder="https://yourportfolio.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-etnIndigo outline-none" 
              />
            </div>

            <button 
              type="submit" 
              className="px-6 py-2.5 bg-etnIndigo text-white font-medium rounded-lg hover:bg-etnViolet transition-colors"
            >
              Save Changes
            </button>
          </form>

          {profile?.role === 'Talent' && (
             <div className="mt-8 pt-8 border-t border-gray-100 flex items-center justify-between">
               <div>
                  <h3 className="text-lg font-bold text-gray-800">Token Balance</h3>
                  <p className="text-sm text-gray-500">Tokens are used to generate AI proposals</p>
               </div>
               <div className="text-3xl font-bold text-etnViolet">
                  {profile.tokenBalance} <span className="text-sm text-gray-400">tokens</span>
               </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
