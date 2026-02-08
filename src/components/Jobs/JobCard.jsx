import React, { useState } from 'react';
import { MapPin, Building2, Calendar, Briefcase, CheckCircle2 } from 'lucide-react';
import useAuthContext from '../../hooks/useAuthContext';
import apiClient from '../../services/api-client';

const JobCard = ({ job }) => {
  const { authTokens, user } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [applied, setApplied] = useState(false);
  const [error, setError] = useState('');

  const handleApply = async () => {
    if (!user) {
      setError('Please login to apply for this job.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await apiClient.post(`/jobs/${job.id}/applys/`, {}, {
        headers: {
          Authorization: `JWT ${authTokens?.access}`,
        },
      });
      if (response.status === 201 || response.status === 200) {
        setApplied(true);
      }
    } catch (err) {
      console.error('Application failed', err);
      setError(err.response?.data?.detail || 'Failed to apply. You might have already applied.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-slate-100 flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
          <Briefcase className="w-6 h-6 text-blue-600" />
        </div>
        <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-semibold rounded-full uppercase tracking-wider">
          {job.category || 'General'}
        </span>
      </div>

      <h3 className="text-xl font-bold text-slate-800 mb-2 hover:text-blue-600 cursor-pointer transition-colors">
        {job.title}
      </h3>

      <div className="space-y-2 mb-4 flex-grow">
        <div className="flex items-center text-slate-500 text-sm">
          <Building2 className="w-4 h-4 mr-2" />
          {job.company_name}
        </div>
        <div className="flex items-center text-slate-500 text-sm">
          <MapPin className="w-4 h-4 mr-2" />
          {job.location}
        </div>
        <div className="flex items-center text-slate-400 text-xs mt-4">
          <Calendar className="w-4 h-4 mr-2" />
          Posted {new Date(job.created_at).toLocaleDateString()}
        </div>
      </div>

      <p className="text-slate-600 text-sm mb-6 line-clamp-3">
        {job.description}
      </p>

      {error && <p className="text-red-500 text-xs mb-3">{error}</p>}

      {applied ? (
        <div className="flex items-center justify-center py-3 bg-emerald-50 text-emerald-600 rounded-lg font-semibold animate-in fade-in zoom-in duration-300">
          <CheckCircle2 className="w-5 h-5 mr-2" />
          Applied Successfully
        </div>
      ) : (
        <button
          onClick={handleApply}
          disabled={loading}
          className="w-full py-3 bg-slate-900 text-white rounded-lg font-semibold hover:bg-blue-600 transition-all duration-200 disabled:opacity-50 active:scale-95 flex items-center justify-center"
        >
          {loading ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            'Apply Now'
          )}
        </button>
      )}
    </div>
  );
};

export default JobCard;
