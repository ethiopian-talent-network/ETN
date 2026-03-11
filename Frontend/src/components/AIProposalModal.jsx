import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import API from "../services/api";
import { deductToken } from "../redux/authSlice";

const AIProposalModal = ({ job, onClose }) => {
  const dispatch = useDispatch();
  const tokenBalance = useSelector((state) => state.auth.user.tokenBalance);
  const [loading, setLoading] = useState(false);
  const [draft, setDraft] = useState("");

  const handleGenerate = async (type) => {
    if (tokenBalance < 1) {
      alert("Not enough tokens!");
      return;
    }

    setLoading(true);
    try {
      // Call Node.js Backend which calls OpenAI
      const res = await API.post("/ai/generate-proposal", {
        jobDescription: job.description,
        type: type, // 'LETTER' or 'CV'
      });

      setDraft(res.data.draft);
      dispatch(deductToken()); // Update UI balance instantly
    } catch (error) {
      console.error("AI Generation failed");
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-xl w-1/2">
        <h2 className="text-2xl font-bold mb-4">Apply for {job.title}</h2>
        <p className="mb-4 text-gray-600">
          Available Tokens:{" "}
          <span className="font-bold text-etnBlue">{tokenBalance} ⚡</span>
        </p>

        {!draft ? (
          <div className="flex gap-4">
            <button
              onClick={() => handleGenerate("CV")}
              className="flex-1 border-2 border-etnBlue text-etnBlue py-4 rounded-lg hover:bg-blue-50"
            >
              Generate AI CV (Cost: 1 Token)
            </button>
            <button
              onClick={() => handleGenerate("LETTER")}
              className="flex-1 bg-etnBlue text-white py-4 rounded-lg hover:bg-blue-700"
            >
              Generate Motivation Letter (Cost: 1 Token)
            </button>
          </div>
        ) : (
          <div>
            <textarea
              className="w-full h-48 p-2 border rounded"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
            />
            <button
              className="w-full bg-etnGreen text-white py-3 mt-4 rounded-lg"
              onClick={onClose}
            >
              Submit Application
            </button>
          </div>
        )}

        {loading && (
          <p className="mt-4 text-center text-etnBlue animate-pulse">
            AI is writing your proposal...
          </p>
        )}
        <button className="mt-4 text-red-500" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AIProposalModal;
