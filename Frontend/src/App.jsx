import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    // Fetch basic jobs from our backend endpoint
    axios.get('http://localhost:5002/api/jobs')
      .then(response => {
        if (response.data.success) {
          setJobs(response.data.data);
        }
      })
      .catch(err => console.error("Error fetching jobs:", err));
  }, []);

  return (
    <div className="min-h-screen bg-etnBg text-etnDark p-8">
      <header className="mb-8 p-6 bg-gradient-to-r from-etnIndigo to-etnViolet rounded-xl shadow-lg text-white">
        <h1 className="text-4xl font-bold tracking-tight">ETN Talent Dashboard</h1>
        <p className="mt-2 text-lg text-indigo-100">Browse available opportunities</p>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            No jobs found or loading...
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
  );
}

export default App;
