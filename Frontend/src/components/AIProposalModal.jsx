import React, { useState } from "react";
import axios from "axios";

const AIProposalModal = ({ job, profile, setProfile, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");

  const tokenBalance = profile?.tokenBalance || 0;

  const handleGenerate = async (type) => {
    if (tokenBalance < 1) {
      setError("Not enough tokens. Please purchase or earn more.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("etn_token");
      // Call Node.js Backend which calls OpenAI
      const res = await axios.post("http://localhost:5002/api/ai/generate-proposal", {
        jobDescription: job.description,
        type: type, // Custom generation type logic if supported
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        setDraft(res.data.draft);
        // Update local profile balance visually
        setProfile((prev) => ({ ...prev, tokenBalance: res.data.remainingTokens }));
      } else {
        setError("AI Generation failed. No draft returned.");
      }
    } catch (err) {
      console.error("AI Generation failed:", err);
      setError(err.response?.data?.message || "AI Generation failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    // Logic for submitting the application 
    alert("Application submitted successfully!");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-[90%] md:w-[60%] lg:w-[40%] border border-gray-100 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

        <h2 className="text-2xl font-bold mb-2 text-gray-800 tracking-tight">Apply for {job.title}</h2>
        <p className="mb-6 flex justify-between items-center text-sm border-b pb-4 border-gray-100">
           <span className="text-gray-500 line-clamp-1 flex-1 pr-4">{job.employerId?.companyName || "Unknown Employer"}</span>
           <span className="font-semibold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full whitespace-nowrap border border-indigo-100 flex items-center gap-1">
             {tokenBalance} <span className="text-xs font-normal">Tokens Available</span>
           </span>
        </p>

        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm flex gap-2"><svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>{error}</div>}

        {!draft ? (
          <div>
             <p className="text-gray-600 mb-6 text-sm">Having trouble finding the right words? Let our AI write a tailored motivation letter using the skills from your profile!</p>
             <div className="flex flex-col gap-3">
               <button
                 disabled={loading}
                 onClick={() => handleGenerate("CV")}
                 className="w-full flex justify-between items-center bg-gray-50 border border-gray-200 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-100 hover:border-gray-300 transition-all disabled:opacity-50"
               >
                 <span className="font-medium">Generate AI Resume (CV)</span>
                 <span className="text-xs bg-gray-200 px-2 py-1 rounded font-bold text-gray-600">1 Token</span>
               </button>
               <button
                 disabled={loading}
                 onClick={() => handleGenerate("LETTER")}
                 className="w-full flex justify-between items-center bg-gradient-to-r from-etnIndigo to-etnViolet text-white py-3 px-4 rounded-xl hover:shadow-lg hover:from-indigo-600 hover:to-violet-700 transition-all duration-300 transform active:scale-95 disabled:opacity-50"
               >
                 <span className="font-medium">Generate Motivation Letter</span>
                 <span className="text-xs bg-white/20 px-2 py-1 rounded font-bold backdrop-blur-md">1 Token</span>
               </button>
             </div>
          </div>
        ) : (
          <div className="animate-fade-in">
             <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-gray-700">AI Generated Proposal:</label>
                <button onClick={() => setDraft("")} className="text-xs text-indigo-600 hover:underline">Discard & Restart</button>
             </div>
            <textarea
              className="w-full h-56 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-gray-700 text-sm leading-relaxed bg-gray-50"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
            />
            <button
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 mt-4 rounded-xl font-medium transition-colors shadow-md flex justify-center items-center gap-2"
              onClick={handleSubmit}
            >
              <span>Submit Application with AI Proposal</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
            </button>
          </div>
        )}

        {loading && (
          <div className="mt-8 flex flex-col items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-etnIndigo mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-sm text-etnIndigo font-medium animate-pulse">Our AI is analyzing the job description and your skills...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIProposalModal;
