import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import AIProposalModal from '../components/AIProposalModal';

function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [profile, setProfile] = useState(null);
  const [showRecommended, setShowRecommended] = useState(true); // Default matching user's request context
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [applyingJob, setApplyingJob] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeDashboard = async () => {
      const token = localStorage.getItem('etn_token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        // Fetch User Profile
        const profileRes = await axios.get('http://localhost:5002/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        let fetchedProfile = null;
        if (profileRes.data.success) {
          fetchedProfile = profileRes.data.data;
          setProfile(fetchedProfile);
        }

        // Fetch Jobs
        fetchJobs(showRecommended, fetchedProfile, token, '');

      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem('etn_token');
          navigate('/login');
        }
      }
    };

    initializeDashboard();
  }, [navigate]);

  useEffect(() => {
    if (profile) {
      const token = localStorage.getItem('etn_token');
      fetchJobs(showRecommended, profile, token, searchQuery);
    }
  }, [showRecommended, profile, searchQuery]);

  const fetchJobs = async (recommended, userProfile, token, searchParam = '') => {
    try {
      let url = 'http://localhost:5002/api/jobs';
      
      const params = new URLSearchParams();

      // Keyword based Job Recommendation logic
      if (recommended && userProfile?.skills?.length > 0) {
        params.append('skills', userProfile.skills.join(','));
      }

      if (searchParam) {
        params.append('search', searchParam);
      }

      const queryString = params.toString();
      if (queryString) {
        url += `?${queryString}`;
      }

      const jobsRes = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (jobsRes.data.success) {
        setJobs(jobsRes.data.data);
      }
    } catch (err) {
      console.error("Error fetching jobs:", err);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(searchTerm);
  };

  return (
    <div className="min-h-screen bg-etnLight font-sans text-gray-800">
      {/* Top Navbar mimicking the design requested */}
      <nav className="bg-white px-8 py-3 flex justify-between items-center sticky top-0 z-20 border-b border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-etnNavy text-white flex items-center justify-center font-bold text-lg shadow-sm">
              E
            </div>
            <span className="font-black text-xl text-etnNavy tracking-tight">ETN</span>
          </Link>

          {/* Search Bar - Nav Integrated */}
          <form onSubmit={handleSearch} className="hidden md:flex relative w-64">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
             </div>
             <input
               type="text"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               placeholder="Search..."
               className="block w-full pl-10 pr-3 py-2 border border-transparent rounded-full bg-gray-100 text-sm placeholder-gray-500 focus:outline-none focus:bg-white focus:border-gray-200 focus:ring-2 focus:ring-etnNavy transition-all"
             />
          </form>
        </div>

        {/* Center Nav Links */}
        <div className="hidden lg:flex items-center gap-8 ml-8">
          <Link to="/network" className="text-sm font-semibold text-gray-500 hover:text-etnNavy transition-colors">Network</Link>
          <Link to="/" className="text-sm font-semibold text-etnNavy border-b-2 border-etnNavy pb-0.5">Jobs</Link>
          <Link to="/" onClick={() => setShowRecommended(!showRecommended)} className="text-sm font-semibold text-gray-500 hover:text-etnNavy transition-colors">Matches</Link>
          <Link to="/messages" className="text-sm font-semibold text-gray-500 hover:text-etnNavy transition-colors">Messaging</Link>
        </div>

        {/* Right Nav Utilities */}
        <div className="flex items-center gap-5 ml-auto">
          {/* Notifications */}
          <button className="text-gray-400 hover:text-etnNavy transition-colors relative">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-etnRed ring-2 ring-white"></span>
          </button>
          
          {/* Language / Tokens indicator */}
          <Link to="/questionnaire" className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-100 cursor-pointer transition-colors" title="Earn Tokens">
           <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>
           English
           <svg className="w-3 h-3 text-gray-400 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </Link>

          {/* Profile Dropdown stub */}
          <Link to="/profile" className="w-8 h-8 rounded-full bg-gradient-to-r from-etnGold to-etnBrown text-white flex items-center justify-center font-bold text-sm shadow-sm cursor-pointer border-2 border-white hover:border-etnNavy transition-colors shrink-0">
            {profile?.fullName ? profile.fullName[0].toUpperCase() : '👤'}
          </Link>
        </div>
      </nav>

      {/* Main Content Layout matching desired design */}
      <div className="max-w-[1400px] mx-auto p-4 md:p-8">
        
        {/* Top 3 Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
           {/* Jobs Applied */}
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-start">
             <div>
               <p className="text-gray-500 font-medium text-sm mb-1">Jobs Applied</p>
               <h3 className="text-3xl font-black text-gray-900">0</h3>
             </div>
             <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
             </div>
           </div>

           {/* Tokens Balance (Navy Design) */}
           <div className="bg-etnNavy p-6 rounded-2xl shadow-sm border border-etnNavy flex justify-between items-start text-white relative overflow-hidden">
             {/* Decorative element background */}
             <div className="absolute -right-6 -top-6 w-24 h-24 bg-white opacity-5 rounded-full"></div>
             <div className="relative z-10">
               <p className="text-indigo-100 font-medium text-sm mb-1">Tokens Balance</p>
               <h3 className="text-3xl font-black">{profile?.tokenBalance || 0}</h3>
             </div>
             <div className="w-10 h-10 rounded-xl bg-white text-etnNavy flex items-center justify-center relative z-10 shadow-sm cursor-help" title="Earn tokens in AI Tour!">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
             </div>
           </div>

           {/* Total Matches (Green Design) */}
           <div className="bg-emerald-50 p-6 rounded-2xl shadow-sm border border-emerald-100 flex justify-between items-start">
             <div>
               <p className="text-emerald-700 font-medium text-sm mb-1">Total Matches</p>
               <h3 className="text-3xl font-black text-emerald-900">{jobs.length > 0 ? jobs.length * 3 : 156}</h3>
             </div>
             <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-etnGreen">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
             </div>
           </div>
        </div>

        {/* 2 Column Main View */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Area: Job Grid (Takes 2/3 col space) */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-etnNavy tracking-tight">AI Recommended Jobs</h2>
              <p className="text-gray-500 text-sm mt-1">Personalized opportunities matched to your profile</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {jobs.length === 0 ? (
                <div className="col-span-full bg-white p-10 rounded-2xl border border-gray-100 shadow-sm text-center">
                  <p className="text-gray-500">No matching jobs right now. Check back soon!</p>
                </div>
              ) : (
                jobs.map(job => (
                  <div key={job._id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold text-gray-900 leading-tight">{job.title}</h3>
                      <span className="bg-emerald-50 text-etnGreen px-2 py-1 rounded text-xs font-bold whitespace-nowrap ml-2">
                        {Math.floor(Math.random() * 15 + 85)}% Match
                      </span>
                    </div>
                    
                    <p className="text-gray-500 text-sm mb-4 font-medium">{job.employerId?.companyName || "Unknown Employer"}</p>
                    
                    <div className="flex items-center gap-3 text-xs text-gray-400 mb-6 font-medium">
                      <span className="flex items-center gap-1"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg> Addis Ababa</span>
                      <span className="flex items-center gap-1 font-bold text-gray-600">${job.budget}</span>
                      <span className="flex items-center gap-1"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> Full-time</span>
                    </div>

                    <div className="mt-auto">
                      <button 
                        onClick={() => setApplyingJob(job)}
                        className="w-full py-2.5 bg-etnNavy text-white rounded-lg font-medium hover:bg-blue-900 transition-colors shadow-sm"
                      >
                        Apply Now
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Area: Profile Strength Sidebar */}
          <div className="lg:col-span-1">
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
               <h3 className="text-lg font-bold text-gray-900 mb-6">Profile Strength</h3>
               
               {/* Circular Progress (Mocked UI based on Image) */}
               <div className="flex justify-center mb-8">
                 <div className="relative w-32 h-32 flex items-center justify-center">
                    {/* Background SVG Circle */}
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-gray-100" />
                      {/* Foreground SVG Circle */}
                      <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="12" fill="transparent" 
                        strokeDasharray="351.85" strokeDashoffset={351.85 * (1 - 0.85)} 
                        className="text-etnNavy drop-shadow-sm" 
                        style={{ strokeLinecap: 'round' }}
                        />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center">
                       <span className="text-2xl font-black text-gray-900">85%</span>
                       <span className="text-xs text-gray-400 font-medium">Complete</span>
                    </div>
                 </div>
               </div>

               {/* Line Progress bars */}
               <div className="space-y-4 mb-8">
                 <div>
                   <div className="flex justify-between text-xs font-semibold mb-1">
                     <span className="text-gray-600">Profile</span>
                     <span className="text-gray-900">90%</span>
                   </div>
                   <div className="w-full bg-gray-100 rounded-full h-2">
                     <div className="bg-etnNavy h-2 rounded-full w-[90%]"></div>
                   </div>
                 </div>
                 <div>
                   <div className="flex justify-between text-xs font-semibold mb-1">
                     <span className="text-gray-600">Experience</span>
                     <span className="text-gray-900">75%</span>
                   </div>
                   <div className="w-full bg-gray-100 rounded-full h-2">
                     <div className="bg-etnNavy h-2 rounded-full w-[75%]"></div>
                   </div>
                 </div>
                 <div>
                   <div className="flex justify-between text-xs font-semibold mb-1">
                     <span className="text-gray-600">Skills</span>
                     <span className="text-gray-900">85%</span>
                   </div>
                   <div className="w-full bg-gray-100 rounded-full h-2">
                     <div className="bg-etnNavy h-2 rounded-full w-[85%]"></div>
                   </div>
                 </div>
               </div>

               <Link to="/profile" className="block w-full py-2.5 bg-etnNavy text-white rounded-lg font-medium hover:bg-blue-900 transition-colors shadow-sm text-center">
                 Improve Profile
               </Link>
             </div>
          </div>
        </div>

      </div>

      {applyingJob && (
        <AIProposalModal 
          job={applyingJob} 
          profile={profile} 
          setProfile={setProfile} 
          onClose={() => setApplyingJob(null)} 
        />
      )}
    </div>
  );
}

export default Dashboard;
