import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function AIQuestionnaire() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // Mock AI Questions
  const questions = [
    {
      id: 1,
      question: "Which hook should you use for side effects in React?",
      options: ["useState", "useEffect", "useMemo", "useContext"]
    },
    {
      id: 2,
      question: "What does 'SOLID' stand for in software engineering?",
      options: [
        "Single, Open, Liskov, Interface, Dependency",
        "Simple, Ordinary, Linked, Inherited, Driven",
        "Standard, Object, Logical, Isolated, Distributed"
      ]
    },
    {
      id: 3,
      question: "In Node.js, what handles asynchronous operations?",
      options: ["The Thread Pool", "Event Loop", "V8 Engine", "Express"]
    }
  ];

  const handleSelect = (option) => {
    setAnswers({ ...answers, [currentQuestion]: option });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('etn_token');
      // For demonstration, simply completing it earns 5 tokens
      const res = await axios.post('http://localhost:5002/api/users/earn-tokens', {
        tokensToEarn: 5
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        setSuccess(true);
      }
    } catch (error) {
      console.error("Failed to submit questionnaire.", error);
      alert("Failed to submit error.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-etnBg text-etnDark flex flex-col items-center justify-center p-4">
        <div className="bg-white p-10 rounded-2xl shadow-xl max-w-lg w-full text-center">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Questionnaire Completed!</h1>
          <p className="text-lg text-gray-600 mb-8">You successfully proved your skills and earned <span className="font-bold text-etnIndigo">5 ETN Tokens</span>!</p>
          <button 
            onClick={() => navigate('/')}
            className="w-full py-3 bg-etnIndigo hover:bg-etnViolet text-white rounded-xl font-medium transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-etnBg text-etnDark">
      <nav className="bg-white shadow-sm px-8 py-4 flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-etnIndigo to-etnViolet">
          <Link to="/">ETN</Link>
        </h1>
        <Link to="/" className="text-sm font-medium text-gray-500 hover:text-etnIndigo">Exit to Dashboard</Link>
      </nav>

      <div className="max-w-2xl mx-auto p-8 mt-8">
        <div className="mb-8 p-6 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-2xl shadow-lg text-white">
          <h1 className="text-2xl font-bold">AI Skill Questionnaire</h1>
          <p className="mt-1 text-teal-100">Test your knowledge to earn ETN tokens for AI Proposals!</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100">
           <div className="flex justify-between items-center mb-6">
              <span className="text-sm font-bold text-gray-400 tracking-wider uppercase">Question {currentQuestion + 1} of {questions.length}</span>
              <div className="flex gap-1">
                {questions.map((_, i) => (
                  <div key={i} className={`h-2 w-8 rounded-full ${i <= currentQuestion ? 'bg-etnIndigo' : 'bg-gray-200'}`} />
                ))}
              </div>
           </div>

           <h2 className="text-2xl font-medium text-gray-800 mb-8">{question.question}</h2>

           <div className="space-y-4 mb-10">
             {question.options.map((option, idx) => (
               <div 
                 key={idx}
                 onClick={() => handleSelect(option)}
                 className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${answers[currentQuestion] === option ? 'border-etnIndigo bg-indigo-50 text-etnIndigo font-semibold' : 'border-gray-200 text-gray-600 hover:border-indigo-300 hover:bg-gray-50'}`}
               >
                 {option}
               </div>
             ))}
           </div>

           <div className="flex justify-between items-center pt-6 border-t border-gray-100">
             <button
               onClick={handlePrevious}
               disabled={currentQuestion === 0}
               className="px-6 py-2 rounded-lg text-gray-500 font-medium hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
             >
               Previous
             </button>

             {currentQuestion === questions.length - 1 ? (
               <button
                 onClick={handleSubmit}
                 disabled={!answers[currentQuestion] || isSubmitting}
                 className="px-8 py-2.5 bg-etnIndigo text-white rounded-lg font-medium hover:bg-etnViolet transition-colors disabled:opacity-50"
               >
                 {isSubmitting ? 'Submitting...' : 'Submit & Earn Tokens'}
               </button>
             ) : (
               <button
                 onClick={handleNext}
                 disabled={!answers[currentQuestion]}
                 className="px-8 py-2.5 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
               >
                 Next Question
               </button>
             )}
           </div>
        </div>
      </div>
    </div>
  );
}

export default AIQuestionnaire;
