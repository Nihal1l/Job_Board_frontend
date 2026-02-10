import React, { useState } from 'react';
import { Briefcase, CheckCircle2, MapPin, Building2, Calendar, X } from 'lucide-react';
import useAuthContext from '../../hooks/useAuthContext';
import apiClient from '../../services/api-client';

const PopularCategoriesWithModal = () => {
  const { authTokens, user } = useAuthContext();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [applyingId, setApplyingId] = useState(null);
  const [appliedJobs, setAppliedJobs] = useState(new Set());
  const [errorMap, setErrorMap] = useState({});

  const categories = [
    {
      id: 1,
      name: 'IT',
      image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop',
      gradient: 'from-blue-600 to-cyan-500',
      icon: '💻'
    },
    {
      id: 2,
      name: 'Marketing',
      image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop',
      gradient: 'from-purple-600 to-pink-500',
      icon: '📊'
    },
    {
      id: 3,
      name: 'Sales',
      image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=300&fit=crop',
      gradient: 'from-orange-600 to-red-500',
      icon: '💼'
    },
    {
      id: 4,
      name: 'Finance',
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop',
      gradient: 'from-emerald-600 to-teal-500',
      icon: '💰'
    },
    {
      id: 5,
      name: 'Engineering',
      image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop',
      gradient: 'from-slate-700 to-slate-500',
      icon: '⚙️'
    },
    {
      id: 6,
      name: 'Healthcare',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=300&fit=crop',
      gradient: 'from-rose-600 to-pink-500',
      icon: '🏥'
    }
  ];

  const handleCategoryClick = async (categoryName) => {
    setSelectedCategory(categoryName);
    setLoading(true);
    setShowModal(true);
    setErrorMap({});
    
    try {
      const response = await apiClient.get(`/jobs/?category=${categoryName}`);
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setJobs([]);
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
      setErrorMap(prev => ({ ...prev, [jobId]: 'Failed to apply or already applied' }));
    } finally {
      setApplyingId(null);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCategory(null);
    setJobs([]);
    setErrorMap({});
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="bg-slate-50 py-20 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Popular Categories
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Explore thousands of jobs in the most popular categories. Find the perfect fit for your skill set and career goals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => handleCategoryClick(category.name)}
              className="group relative h-64 rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${category.image})` }}
              />
              <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-80 group-hover:opacity-90 transition-opacity`} />
              
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6">
                <span className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                  {category.icon}
                </span>
                <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                <p className="text-white/80 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  View Jobs →
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100]"
          onClick={closeModal}
        >
          <div 
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">{selectedCategory} Openings</h2>
                <p className="text-slate-400 text-sm">Discover your next opportunity</p>
              </div>
              <button 
                onClick={closeModal}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                aria-label="Close modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[60vh] bg-slate-50">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <span className="loading loading-spinner loading-lg text-blue-600 mb-4"></span>
                  <p className="text-slate-600 font-medium">Fetching jobs...</p>
                </div>
              ) : jobs.length > 0 ? (
                <div className="space-y-4">
                  {jobs.map((job) => (
                    <div 
                      key={job.id}
                      className="bg-white border border-slate-200 rounded-xl p-6 hover:border-blue-300 transition-colors shadow-sm"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-slate-900">{job.title}</h3>
                          <div className="flex items-center text-blue-600 font-semibold text-sm mt-1">
                            <Building2 className="w-4 h-4 mr-1.5" />
                            {job.company_name}
                          </div>
                        </div>
                        <span className="text-xs text-slate-400 flex items-center">
                          <Calendar className="w-3.5 h-3.5 mr-1" />
                          {formatDate(job.published_at)}
                        </span>
                      </div>
                      
                      <div className="flex items-center text-slate-500 text-sm mb-4">
                        <MapPin className="w-4 h-4 mr-1.5" />
                        {job.location}
                      </div>
                      
                      <p className="text-slate-600 text-sm mb-6 line-clamp-3">{job.description}</p>
                      
                      <div className="flex justify-between items-center pt-5 border-t border-slate-100">
                        <span className="text-xs text-slate-400 italic">
                          By {job.user.name}
                        </span>
                        
                        {appliedJobs.has(job.id) ? (
                          <div className="flex items-center text-emerald-600 font-bold bg-emerald-50 px-4 py-2 rounded-lg border border-emerald-100">
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Applied
                          </div>
                        ) : (
                          <div className="flex flex-col items-end">
                            <button 
                              onClick={() => handleApply(job.id)}
                              disabled={applyingId === job.id}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold transition-all disabled:opacity-50 active:scale-95 flex items-center"
                            >
                              {applyingId === job.id ? (
                                <span className="loading loading-spinner loading-xs mr-2"></span>
                              ) : null}
                              Apply Now
                            </button>
                            {errorMap[job.id] && (
                              <span className="text-[10px] text-red-500 mt-1 font-medium">{errorMap[job.id]}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <div className="text-5xl mb-4 opacity-20">🔍</div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">No jobs found in {selectedCategory}</h3>
                  <p className="text-slate-500">Would you like to explore other categories?</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PopularCategoriesWithModal;
