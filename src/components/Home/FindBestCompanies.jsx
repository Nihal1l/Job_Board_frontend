import React, { useState, useEffect } from 'react';
import { Building2, MapPin, Briefcase, ChevronRight, X, CheckCircle2, Calendar } from 'lucide-react';
import useAuthContext from '../../hooks/useAuthContext';
import apiClient from '../../services/api-client';

const FindBestCompanies = () => {
  const { authTokens, user } = useAuthContext();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [applyingId, setApplyingId] = useState(null);
  const [appliedJobs, setAppliedJobs] = useState(new Set());
  const [errorMap, setErrorMap] = useState({});

  const companyLogos = {
    default: '🏢',
    facebook: '📘',
    google: '🔍',
    android: '🤖',
    lenovo: '💻',
    spotify: '🎵',
    linkedin: '💼',
    microsoft: '🪟',
    apple: '🍎',
    amazon: '📦',
    netflix: '🎬',
    twitter: '🐦',
  };

  const getCompanyLogo = (companyName) => {
    const name = companyName.toLowerCase();
    for (const key in companyLogos) {
      if (name.includes(key)) return companyLogos[key];
    }
    return companyLogos.default;
  };

  const getCompanyColor = (index) => {
    const colors = [
      'from-blue-500 to-blue-600',
      'from-red-500 to-red-600',
      'from-green-500 to-green-600',
      'from-purple-500 to-purple-600',
      'from-emerald-500 to-emerald-600',
      'from-cyan-500 to-cyan-600',
      'from-indigo-500 to-indigo-600',
      'from-pink-500 to-pink-600',
    ];
    return colors[index % colors.length];
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/jobs/');
      const jobs = response.data;

      const companyMap = {};
      jobs.forEach(job => {
        const companyName = job.company_name;
        if (!companyMap[companyName]) {
          companyMap[companyName] = {
            name: companyName,
            description: job.description || 'Pioneering excellence in their industry with innovative solutions.',
            location: job.location || 'Global',
            jobCount: 0,
            jobs: []
          };
        }
        companyMap[companyName].jobCount++;
        companyMap[companyName].jobs.push(job);
      });

      setCompanies(Object.values(companyMap));
    } catch (error) {
      console.error('Error fetching companies:', error);
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (jobId) => {
    if (!user) {
      setErrorMap(prev => ({ ...prev, [jobId]: 'Please login to apply' }));
      return;
    }

    setApplyingId(jobId);
    try {
      const response = await apiClient.post(`/jobs/${jobId}/applys/`, {}, {
        headers: {
          Authorization: `JWT ${authTokens?.access}`,
        },
      });
      if (response.status === 201 || response.status === 200) {
        setAppliedJobs(prev => new Set(prev).add(jobId));
      }
    } catch (err) {
      setErrorMap(prev => ({ ...prev, [jobId]: 'Failed to apply' }));
    } finally {
      setApplyingId(null);
    }
  };

  const handleCompanyClick = (company) => {
    setSelectedCompany(company);
    setShowModal(true);
    setErrorMap({});
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCompany(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center bg-slate-50">
        <span className="loading loading-spinner loading-lg text-blue-600 mb-4"></span>
        <p className="text-slate-500 font-medium tracking-wide">Building company profiles...</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">
            Find Best Companies
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Discover opportunities with world-class organizations. Explore their culture, mission, and current open positions.
          </p>
        </div>

        {companies.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {companies.map((company, index) => (
              <div
                key={index}
                onClick={() => handleCompanyClick(company)}
                className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:-translate-y-2 group border border-slate-100"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${getCompanyColor(index)} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg text-4xl`}>
                  {getCompanyLogo(company.name)}
                </div>

                <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {company.name}
                </h3>

                <p className="text-slate-500 text-sm mb-6 line-clamp-2 leading-relaxed">
                  {company.description}
                </p>

                <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                  <div className="flex items-center gap-1.5 text-slate-400 text-sm">
                    <MapPin className="w-4 h-4" />
                    <span>{company.location}</span>
                  </div>
                  <div className="text-blue-600 font-bold text-sm bg-blue-50 px-3 py-1 rounded-full">
                    {company.jobCount} Roles
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-[40px] shadow-sm border border-slate-100">
            <div className="text-6xl mb-6">🏢</div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">No Companies Found</h3>
            <p className="text-slate-500">Come back later to see more great companies!</p>
          </div>
        )}
      </div>

      {showModal && selectedCompany && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[110]"
          onClick={closeModal}
        >
          <div 
            className="bg-white rounded-[40px] max-w-5xl w-full max-h-[85vh] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.1)] animate-in fade-in zoom-in duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-slate-900 p-10 text-white relative">
              <div className="relative z-10 flex justify-between items-start">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center text-5xl border border-white/20">
                    {getCompanyLogo(selectedCompany.name)}
                  </div>
                  <div>
                    <h2 className="text-4xl font-extrabold mb-1">{selectedCompany.name}</h2>
                    <div className="flex items-center text-slate-400 gap-2 font-medium">
                      <MapPin className="w-4 h-4 text-emerald-400" />
                      {selectedCompany.location}
                    </div>
                  </div>
                </div>
                <button 
                  onClick={closeModal}
                  className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <p className="mt-8 text-slate-300 text-lg leading-relaxed max-w-3xl">
                {selectedCompany.description}
              </p>
            </div>

            <div className="p-10 overflow-y-auto max-h-[55vh] bg-slate-50">
              <div className="flex items-center mb-8">
                <div className="h-8 w-1.5 bg-blue-600 rounded-full mr-4"></div>
                <h3 className="text-2xl font-bold text-slate-900">
                  Open Positions ({selectedCompany.jobs.length})
                </h3>
              </div>

              <div className="space-y-6">
                {selectedCompany.jobs.map((job) => (
                  <div 
                    key={job.id}
                    className="bg-white border border-slate-100 rounded-[32px] p-8 hover:shadow-xl transition-all duration-300 group"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-2xl font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">{job.title}</h4>
                        <div className="flex items-center gap-4 text-slate-400 text-sm font-medium">
                          <span className="flex items-center gap-1.5 uppercase tracking-wider text-blue-600 font-bold">
                            <Briefcase className="w-4 h-4" />
                            {job.category || 'Job'}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            {formatDate(job.published_at)}
                          </span>
                        </div>
                      </div>
                      {appliedJobs.has(job.id) ? (
                        <span className="px-6 py-2.5 bg-emerald-50 text-emerald-600 rounded-2xl font-bold text-sm flex items-center border border-emerald-100">
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Applied
                        </span>
                      ) : (
                        <div className="flex flex-col items-end gap-2">
                          <button 
                            onClick={() => handleApply(job.id)}
                            disabled={applyingId === job.id}
                            className="bg-slate-900 hover:bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
                          >
                            {applyingId === job.id && <span className="loading loading-spinner loading-xs"></span>}
                            Apply Now
                          </button>
                          {errorMap[job.id] && (
                            <span className="text-[10px] text-red-500 font-bold">{errorMap[job.id]}</span>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <p className="text-slate-600 leading-relaxed mb-6 line-clamp-3">
                      {job.description}
                    </p>
                    
                    {job.requirements && (
                      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                        <h5 className="font-bold text-slate-800 mb-2 text-sm uppercase tracking-widest">Requirements:</h5>
                        <p className="text-slate-600 text-sm leading-relaxed">{job.requirements}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FindBestCompanies;
