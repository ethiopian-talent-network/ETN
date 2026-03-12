import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({
    role: 'Talent',
    fullName: '',
    email: '',
    password: '',
    // Talent specifics
    skills: '',
    age: '',
    experience: '',
    bio: '',
    portfolioUrl: '',
    // Employer specifics
    companyName: '',
    industry: '',
  });
  
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNextStep = () => {
    // Basic validation before next
    if (!formData.fullName && !formData.companyName) {
      setError('Please provide your name.');
      return;
    }
    if (!formData.email || !formData.password) {
      setError('Please provide email and password.');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = { ...formData };
      
      // Clean up payload before sending
      if (payload.role === 'Employer') {
         payload.companyName = formData.companyName || formData.fullName; 
         payload.taxId = 'PENDING'; // Mock
         delete payload.skills; delete payload.age; delete payload.experience; delete payload.bio; delete payload.portfolioUrl;
      } else {
         delete payload.companyName; delete payload.industry;
      }

      const response = await axios.post('http://localhost:5002/api/auth/register', payload);

      if (response.data.userId) {
        navigate('/login');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-etnLight text-gray-800 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] w-full max-w-lg border border-gray-100 z-10 relative overflow-hidden">
        
        {/* Subtle Decorative Accent */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-etnGreen via-etnGold to-etnRed"></div>

        <div className="text-center mb-10 mt-2">
          <div className="w-16 h-16 bg-etnNavy text-white rounded-xl flex items-center justify-center text-3xl font-black mx-auto mb-4 shadow-lg shadow-etnNavy/30">
            E
          </div>
          <h1 className="text-3xl font-black text-etnNavy tracking-tight">
            Join ETN
          </h1>
          <p className="text-gray-500 mt-2 text-sm font-medium">Build your future with cultural pride.</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-etnRed/20 text-etnRed p-3 rounded-xl mb-6 text-sm text-center font-medium">
            {error}
          </div>
        )}

        {/* Step Indicator */}
        <div className="flex justify-center items-center mb-8 gap-3">
           <div className={`h-2.5 w-12 rounded-full transition-all ${step >= 1 ? 'bg-etnNavy' : 'bg-gray-200'}`}></div>
           <div className={`h-2.5 w-12 rounded-full transition-all ${step >= 2 ? 'bg-etnGreen' : 'bg-gray-200'}`}></div>
        </div>

        <form onSubmit={step === 2 ? handleRegister : (e) => { e.preventDefault(); handleNextStep(); }} className="space-y-5">
          
          {step === 1 && (
            <div className="animate-fade-in space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">I am joining as...</label>
                <div className="grid grid-cols-2 gap-4">
                  <label className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.role === 'Talent' ? 'border-etnNavy bg-blue-50/50 text-etnNavy shadow-sm' : 'border-gray-200 text-gray-400 hover:bg-gray-50'}`}>
                    <input type="radio" name="role" value="Talent" checked={formData.role === 'Talent'} onChange={handleChange} className="hidden" />
                    <svg className="w-8 h-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    <span className="font-bold">Talent</span>
                  </label>
                  <label className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.role === 'Employer' ? 'border-etnBrown bg-orange-50/50 text-etnBrown shadow-sm' : 'border-gray-200 text-gray-400 hover:bg-gray-50'}`}>
                    <input type="radio" name="role" value="Employer" checked={formData.role === 'Employer'} onChange={handleChange} className="hidden" />
                    <svg className="w-8 h-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                    <span className="font-bold">Employer</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  {formData.role === 'Talent' ? 'Full Name' : 'Company Name'}
                </label>
                <input
                  type="text"
                  name={formData.role === 'Talent' ? 'fullName' : 'companyName'}
                  value={formData.role === 'Talent' ? formData.fullName : formData.companyName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-etnNavy focus:border-etnNavy outline-none transition-colors text-gray-800"
                  placeholder={formData.role === 'Talent' ? 'E.g. Abebe Bikila' : 'Acme Corp'}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-etnNavy focus:border-etnNavy outline-none transition-colors text-gray-800"
                  placeholder="name@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-etnNavy focus:border-etnNavy outline-none transition-colors text-gray-800"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-etnNavy hover:bg-etnNavy/90 text-white rounded-xl font-bold transition-colors mt-4 shadow-md flex justify-center items-center gap-2"
              >
                <span>Continue</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-fade-in relative">
               <button type="button" onClick={() => setStep(1)} className="absolute -top-12 -left-2 text-gray-400 hover:text-etnNavy flex items-center text-sm font-semibold transition-colors">
                 ← Back
               </button>

               {formData.role === 'Talent' ? (
                 <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Core Skills (comma separated)</label>
                    <input
                      type="text"
                      name="skills"
                      value={formData.skills}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-etnGreen focus:border-etnGreen outline-none text-gray-800 text-sm"
                      placeholder="e.g. React, Node.js, Design"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Age</label>
                      <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-etnGreen focus:border-etnGreen outline-none text-gray-800 text-sm"
                        placeholder="e.g. 25"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Experience (Years)</label>
                      <input
                        type="number"
                        name="experience"
                        value={formData.experience}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-etnGreen focus:border-etnGreen outline-none text-gray-800 text-sm"
                        placeholder="e.g. 3"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Short Bio</label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-etnGreen focus:border-etnGreen outline-none text-gray-800 text-sm h-24 resize-none"
                      placeholder="Share your story..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Portfolio or LinkedIn URL</label>
                    <input
                      type="url"
                      name="portfolioUrl"
                      value={formData.portfolioUrl}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-etnGreen focus:border-etnGreen outline-none text-gray-800 text-sm"
                      placeholder="https://yourwork.com"
                    />
                  </div>
                 </>
               ) : (
                 <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Industry Sector</label>
                    <input
                      type="text"
                      name="industry"
                      value={formData.industry}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-etnBrown focus:border-etnBrown outline-none text-gray-800"
                      placeholder="e.g. Technology, Finance, Agriculture"
                    />
                  </div>
                 </>
               )}

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3.5 text-white rounded-xl font-bold transition-all mt-6 shadow-md ${formData.role === 'Talent' ? 'bg-etnGreen hover:bg-green-600' : 'bg-etnBrown hover:bg-amber-950'} disabled:opacity-70`}
              >
                {loading ? 'Creating account...' : 'Complete Registration'}
              </button>
            </div>
          )}

        </form>

        <div className="mt-8 text-center text-sm text-gray-500 font-medium">
          Already have an account?{' '}
          <Link to="/login" className="text-etnNavy font-bold hover:text-blue-800 transition-colors hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
