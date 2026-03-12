import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('etn_token');
    const userData = localStorage.getItem('etn_user');
    
    if (!token) {
      navigate('/login');
      return;
    }

    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Fetch jobs
    axios.get('http://localhost:5002/api/jobs', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        if (response.data.success) {
          setJobs(response.data.data);
        }
      })
      .catch(err => {
        console.error("Error fetching jobs:", err);
        // If unauthorized, clear token and redirect to login
        if (err.response && err.response.status === 401) {
          localStorage.removeItem('etn_token');
          navigate('/login');
        }
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('etn_token');
    localStorage.removeItem('etn_user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-etnBg text-etnDark">
      <nav className="bg-white shadow-sm px-8 py-4 flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-etnIndigo to-etnViolet">
          ETN
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-600">
            {user?.email} ({user?.role})
          </span>
          <button 
            onClick={handleLogout}
            className="text-sm text-red-500 hover:text-red-700 transition-colors bg-red-50 px-3 py-1.5 rounded-md"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="p-8">
        <header className="mb-8 p-6 bg-gradient-to-r from-etnIndigo to-etnViolet rounded-xl shadow-lg text-white">
          <h1 className="text-4xl font-bold tracking-tight">Talent Dashboard</h1>
          <p className="mt-2 text-lg text-indigo-100">Browse available opportunities</p>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500 bg-white rounded-xl shadow-sm border border-gray-100">
              No jobs found. Check back later!
            </div>
          ) : (
            jobs.map(job => (
              <div key={job._id} className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow border border-gray-100">
                <h2 className="text-xl font-bold text-etnIndigo mb-2">{job.title}</h2>
                <div className="flex justify-between items-center mb-4 text-sm text-gray-600">
                  <span className="font-semibold">{job.employerId?.companyName || "Unknown Employer"}</span>
                  <span className="bg-green-100 text-green-800 py-1 px-2 rounded-full text-xs font-bold">${job.budget}</span>
                </div>
                <p className="text-gray-600 mb-4 line-clamp-3">{job.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {job.skillsRequired && job.skillsRequired.map((skill, idx) => (
                    <span key={idx} className="bg-indigo-50 text-etnIndigo text-xs px-2 py-1 rounded">
                      {skill}
                    </span>
                  ))}
                </div>
                
                <button className="w-full py-2 bg-etnViolet hover:bg-etnIndigo text-white rounded-lg transition-colors font-medium">
                  Apply Now
                </button>
              </div>
            ))
          )}
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
