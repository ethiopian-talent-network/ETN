import React, { useState, useEffect } from "react";
import JobCard from "../../components/jobs/JobCard";
import API from "../../services/api";

const TalentDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [tokenBalance, setTokenBalance] = useState(0);

  // Fetch AI Recommended Jobs on load
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await API.get("/jobs/recommended");
        setJobs(res.data.jobs);
        setTokenBalance(res.data.user.tokenBalance);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchDashboardData();
  }, []);

  const handleApply = (jobId) => {
    // Open AI Proposal Modal logic here
    console.log("Applying for job with AI: ", jobId);
  };

  return (
    <div className="p-8 bg-etnBg min-h-screen">
      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h4 className="text-gray-500 text-sm">Jobs Applied</h4>
          <p className="text-3xl font-bold text-etnBlue">12</p>
        </div>

        {/* Token Balance Card */}
        <div className="bg-gradient-to-r from-etnBlue to-blue-500 p-6 rounded-xl shadow-sm text-white">
          <h4 className="text-blue-100 text-sm flex items-center gap-2">
            ⚡ Application Tokens
          </h4>
          <p className="text-3xl font-bold mt-1">{tokenBalance}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h4 className="text-gray-500 text-sm">Profile Strength</h4>
          <p className="text-3xl font-bold text-etnGreen">85%</p>
        </div>
      </div>

      {/* Recommended Jobs Section */}
      <div>
        <h2 className="text-2xl font-bold text-etnDark mb-1">
          AI Recommended Jobs
        </h2>
        <p className="text-gray-500 mb-6">
          Personalized opportunities matched to your vector profile.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} onApply={handleApply} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TalentDashboard;
