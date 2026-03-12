import React from "react";

const JobCard = ({ job, onApply }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition flex flex-col justify-between">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-etnDark">{job.title}</h3>
          <p className="text-gray-500 text-sm">{job.companyName}</p>
        </div>

        {/* AI Match Badge (Only shows if match > 80%) */}
        {job.matchScore >= 80 && (
          <span className="bg-green-100 text-etnGreen text-xs font-bold px-3 py-1 rounded-full">
            {job.matchScore}% Match
          </span>
        )}
      </div>

      <div className="flex gap-3 text-sm text-gray-600 mb-6">
        <span className="bg-gray-100 px-2 py-1 rounded">📍 {job.location}</span>
        <span className="bg-gray-100 px-2 py-1 rounded">💰 {job.salary}</span>
      </div>

      <button
        onClick={() => onApply(job)}
        className="w-full bg-etnGreen text-white font-medium py-2 rounded-lg hover:bg-green-600 transition"
      >
        Apply Now
      </button>
    </div>
  );
};

export default JobCard;
