import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Network() {
  const [talents, setTalents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [endorsing, setEndorsing] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTalents = async () => {
      try {
        const token = localStorage.getItem('etn_token');
        if (!token) {
          navigate('/login');
          return;
        }

        const res = await axios.get('http://localhost:5002/api/users/talents', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.data.success) {
          setTalents(res.data.data);
        }
      } catch (err) {
        setError('Failed to load network.');
        if (err.response?.status === 401) {
          localStorage.removeItem('etn_token');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTalents();
  }, [navigate]);

  const handleEndorse = (talentId) => {
    // Basic mock logic for endorsing a talent. In a full system, you would POST to /api/users/endorse
    setEndorsing(talentId);
    setTimeout(() => {
      setEndorsing(null);
      alert('Skill endorsed successfully!');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-etnBg text-etnDark flex flex-col">
      <nav className="bg-white shadow-sm px-8 py-4 flex justify-between items-center sticky top-0 z-10 w-full">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-etnIndigo to-etnViolet">
          <Link to="/">ETN</Link>
        </h1>
        <div className="flex items-center gap-6">
          <Link to="/" className="text-sm font-medium text-gray-700 hover:text-etnIndigo transition-colors">
            Dashboard
          </Link>
          <Link to="/messages" className="text-sm font-medium text-gray-700 hover:text-etnIndigo transition-colors">
            Messages
          </Link>
        </div>
      </nav>

      <div className="p-8 max-w-6xl mx-auto w-full">
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">Talent Network</h2>
        <p className="text-gray-500 mb-8 border-b border-gray-200 pb-4">Connect, Endorse Skills, and Network with peers.</p>

        {loading ? (
           <p className="text-center text-gray-500 py-10 animate-pulse">Loading talented network...</p>
        ) : error ? (
           <p className="text-center text-red-500">{error}</p>
        ) : talents.length === 0 ? (
           <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
             <p className="text-xl font-medium text-gray-600">You are the only one in the network so far!</p>
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {talents.map(talent => (
              <div key={talent._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-violet-100 rounded-full flex items-center justify-center mb-4 text-2xl font-bold text-etnIndigo shadow-inner border border-white">
                   {talent.fullName ? talent.fullName[0].toUpperCase() : '👤'}
                </div>
                <h3 className="text-lg font-bold text-gray-900">{talent.fullName || 'Anonymous Talent'}</h3>
                <p className="text-sm text-gray-500 mb-4">{talent.email}</p>

                <div className="w-full flex-grow text-left bg-gray-50 rounded-lg p-3 mb-4">
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Top Skills</h4>
                  {talent.skills && talent.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {talent.skills.slice(0, 4).map((skill, idx) => (
                        <span key={idx} className="bg-white border border-gray-200 text-gray-600 text-[10px] px-2 py-0.5 rounded cursor-pointer hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 transition-colors" title="Click to endorse">
                          {skill} ✓
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400 italic">No skills listed</p>
                  )}
                </div>

                <div className="w-full grid grid-cols-2 gap-2 mt-auto">
                   <button 
                     onClick={() => handleEndorse(talent._id)}
                     disabled={endorsing === talent._id}
                     className="px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium rounded-lg text-sm transition-colors disabled:opacity-50"
                   >
                     {endorsing === talent._id ? 'Endorsing...' : 'Endorse'}
                   </button>
                   <button 
                     onClick={() => navigate('/messages')}
                     className="px-3 py-2 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg text-sm transition-colors"
                   >
                     Message
                   </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Network;
