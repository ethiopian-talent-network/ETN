import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Network() {
  const [activeTab, setActiveTab] = useState('discover'); // discover | suggestions | requests | connections
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Search state
  const [skills, setSkills] = useState('');
  const [location, setLocation] = useState('');
  const [role, setRole] = useState('Talent'); // Default searching talents
  
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('etn_token');
    const u = localStorage.getItem('etn_user');
    if (!token || !u) {
      navigate('/login');
      return;
    }
    setCurrentUser(JSON.parse(u));
  }, [navigate]);

  useEffect(() => {
    if (activeTab === 'discover') fetchDiscover();
    else if (activeTab === 'suggestions') fetchSuggestions();
    else if (activeTab === 'requests') fetchRequests();
    else if (activeTab === 'connections') fetchConnections();
  }, [activeTab]);

  const getHeaders = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('etn_token')}` } });

  const fetchDiscover = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (skills) params.append('skills', skills);
      if (location) params.append('location', location);
      if (role) params.append('role', role);

      const res = await axios.get(`http://localhost:5002/api/network/search?${params.toString()}`, getHeaders());
      if (res.data.success) setUsers(res.data.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5002/api/network/suggestions`, getHeaders());
      if (res.data.success) setUsers(res.data.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5002/api/network/pending`, getHeaders());
      if (res.data.success) setRequests(res.data.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const fetchConnections = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5002/api/network/connections`, getHeaders());
      if (res.data.success) setConnections(res.data.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleSendRequest = async (userId) => {
    try {
      await axios.post(`http://localhost:5002/api/network/request/${userId}`, {}, getHeaders());
      alert("Connection request sent!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send request.");
    }
  };

  const handleRespond = async (connId, status) => {
    try {
      await axios.put(`http://localhost:5002/api/network/request/${connId}`, { status }, getHeaders());
      // refresh requests
      fetchRequests();
    } catch (err) {
      alert("Failed to update request.");
    }
  };

  const handleEndorse = async (userId, skill) => {
    try {
      await axios.post(`http://localhost:5002/api/network/endorse/${userId}`, { skill }, getHeaders());
      alert(`Endorsed ${skill}!`);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to endorse.");
    }
  };

  return (
    <div className="min-h-screen bg-etnLight text-gray-800">
      <nav className="bg-white px-8 py-4 flex justify-between items-center sticky top-0 z-20 shadow-sm">
        <h1 className="text-2xl font-bold text-etnNavy tracking-tight">
          <Link to="/">ETN Network</Link>
        </h1>
        <Link to="/" className="text-sm font-medium text-gray-600 hover:text-etnNavy border border-gray-200 px-4 py-1.5 rounded-full">
          Back to Dashboard
        </Link>
      </nav>

      <div className="max-w-6xl mx-auto p-8">
        {/* Navigation Tabs */}
        <div className="flex gap-4 border-b border-gray-200 mb-8 overflow-x-auto pb-1">
           {['discover', 'suggestions', 'requests', 'connections'].map(tab => (
             <button
               key={tab}
               onClick={() => setActiveTab(tab)}
               className={`px-4 py-2 text-sm font-bold capitalize transition-colors ${activeTab === tab ? 'text-etnNavy border-b-2 border-etnNavy' : 'text-gray-400 hover:text-gray-600'}`}
             >
               {tab === 'suggestions' ? 'People You May Know' : tab}
             </button>
           ))}
        </div>

        {/* Discover Filters View */}
        {activeTab === 'discover' && (
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4 items-end">
             <div className="flex-1 w-full">
               <label className="block text-xs font-bold text-gray-500 mb-1">Skills (Comma separated)</label>
               <input type="text" value={skills} onChange={e => setSkills(e.target.value)} placeholder="e.g. React, Python" className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 text-sm focus:ring-1 focus:ring-etnNavy" />
             </div>
             <div className="flex-1 w-full">
               <label className="block text-xs font-bold text-gray-500 mb-1">Location</label>
               <input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Addis Ababa" className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 text-sm focus:ring-1 focus:ring-etnNavy" />
             </div>
             <div className="w-full md:w-32">
               <label className="block text-xs font-bold text-gray-500 mb-1">Role</label>
               <select value={role} onChange={e => setRole(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 text-sm focus:ring-1 focus:ring-etnNavy">
                  <option value="Talent">Talent</option>
                  <option value="Employer">Employer</option>
               </select>
             </div>
             <button onClick={fetchDiscover} className="bg-etnNavy text-white px-6 py-2 rounded-lg font-bold text-sm w-full md:w-auto h-9">Search</button>
           </div>
        )}

        {/* Content Listing based on Tabs */}
        {loading ? (
          <p className="text-center text-gray-500 animate-pulse py-10">Fetching Network Data...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* Discover & Suggestions */}
            {(activeTab === 'discover' || activeTab === 'suggestions') && users.map(user => (
              <div key={user._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="w-16 h-16 bg-etnNavy text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                  {user.fullName ? user.fullName[0] : 'U'}
                </div>
                <h3 className="text-lg font-bold text-gray-900">{user.fullName}</h3>
                <p className="text-xs text-gray-500 mb-2 truncate max-w-full">{user.bio || "No bio"}</p>
                <p className="text-sm font-medium text-etnGreen mb-4">{user.location || "Unknown Location"}</p>
                <div className="flex flex-wrap gap-1 mb-6">
                  {user.skills && user.skills.slice(0,3).map((s,i) => <span key={i} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{s}</span>)}
                </div>
                <button onClick={() => handleSendRequest(user._id)} className="w-full py-2 bg-gray-900 text-white hover:bg-etnNavy rounded-lg text-sm font-bold transition-colors">
                  Connect
                </button>
              </div>
            ))}

            {/* Pending Requests */}
            {activeTab === 'requests' && requests.length === 0 && <p className="col-span-3 text-center text-gray-500">No pending requests.</p>}
            {activeTab === 'requests' && requests.map(req => (
              <div key={req._id} className="bg-white p-6 rounded-2xl shadow-sm border border-orange-200">
                <h3 className="text-lg font-bold text-gray-900">{req.requester?.fullName}</h3>
                <p className="text-sm text-gray-500 mb-4">{req.requester?.email}</p>
                <div className="flex gap-2">
                   <button onClick={() => handleRespond(req._id, 'accepted')} className="flex-1 py-2 bg-etnNavy text-white rounded-lg text-sm font-bold">Accept</button>
                   <button onClick={() => handleRespond(req._id, 'ignored')} className="flex-1 py-2 bg-gray-200 text-gray-600 rounded-lg text-sm font-bold">Ignore</button>
                </div>
              </div>
            ))}

            {/* My Connections */}
            {activeTab === 'connections' && connections.length === 0 && <p className="col-span-3 text-center text-gray-500">You haven't connect with anyone yet.</p>}
            {activeTab === 'connections' && connections.map(conn => (
              <div key={conn._id} className="bg-white p-5 rounded-2xl shadow-sm border border-emerald-100 relative">
                <div className="absolute top-4 right-4 text-xs font-bold text-etnGreen bg-emerald-50 px-2 py-0.5 rounded">Connected</div>
                <h3 className="text-lg font-bold text-gray-900 mt-2">{conn.fullName}</h3>
                <p className="text-sm text-gray-500 mb-4">{conn.email}</p>
                
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Endorse Skills</h4>
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {conn.skills && conn.skills.map((s,i) => (
                    <button key={i} onClick={() => handleEndorse(conn._id, s)} className="text-[10px] font-bold bg-gray-50 border border-gray-200 text-gray-600 px-2 py-1 rounded hover:bg-etnGreen hover:text-white hover:border-etnGreen transition-all" title={`Click to endorse ${conn.fullName} for ${s}`}>
                      {s} +
                    </button>
                  ))}
                </div>

                <div className="mt-auto">
                   <button onClick={() => navigate(`/messages`, { state: { peerId: conn._id, peerName: conn.fullName }})} className="w-full py-2 border-2 border-etnNavy text-etnNavy hover:bg-etnNavy hover:text-white rounded-lg text-sm font-bold transition-all">
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
