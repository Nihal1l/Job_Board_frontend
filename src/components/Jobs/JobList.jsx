import React, { useEffect, useState } from 'react';
import apiClient from '../../services/api-client';
import JobCard from './JobCard';

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await apiClient.get('/jobs/');
        setJobs(response.data);
      } catch (err) {
        console.error('Failed to fetch jobs', err);
        setError('Failed to load jobs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center">
        <span className="loading loading-spinner loading-lg text-blue-600 mb-4"></span>
        <p className="text-slate-500 font-medium">Discovering latest opportunities...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20 text-center">
        <div className="text-red-500 mb-4 font-semibold">{error}</div>
        <button 
          onClick={() => window.location.reload()} 
          className="btn btn-outline btn-primary"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Recent Job Openings
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Explore the latest positions from top tech companies and startups. 
            Find your next career move and apply in seconds.
          </p>
        </div>

        {jobs.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-slate-100">
            <p className="text-slate-500 text-lg">No jobs found at the moment. Check back later!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default JobList;
