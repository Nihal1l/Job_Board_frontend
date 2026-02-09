import React, { useEffect, useState } from 'react';
import apiClient from '../services/api-client';

const Dashboard = () => {
  const [activePlans, setActivePlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchActivePlans();
  }, []);

  const fetchActivePlans = async () => {
    try {
      const authTokensStr = localStorage.getItem('authTokens');
      const authTokens = authTokensStr ? JSON.parse(authTokensStr) : null;

      if (!authTokens?.access) {
        setLoading(false);
        return;
      }

      const response = await apiClient.get('/selectedFeatures/', {
        headers: {
          'Authorization': `JWT ${authTokens.access}`
        }
      });
      setActivePlans(response.data);
    } catch (err) {
      console.error('Error fetching active plans:', err);
      setError('Could not load active plans.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">User Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Welcome Back! 👋</h2>
          <p className="text-gray-600">
            Access your job searches, saved companies, and premium features all in one place.
          </p>
        </div>

        {/* Active Plans Section */}
        {/* <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Active Plans</h2>
            <div className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-wider">
              Premium
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-6">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm italic">
              {error}
            </div>
          ) : activePlans.length > 0 ? (
            <div className="space-y-4">
              {activePlans.map((plan, index) => (
                <div key={index} className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-xl">
                    💎
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{plan.plan_name || 'Premium Subscription'}</h4>
                    <p className="text-xs text-gray-500">Status: <span className="text-green-600 font-semibold lowercase">Active</span></p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-400 text-sm mb-4">No active premium plans found.</p>
              <a 
                href="/upgrade-plan" 
                className="inline-block px-6 py-2 bg-primary text-white rounded-xl font-bold text-sm hover:opacity-90 transition-opacity"
              >
                Upgrade Now
              </a>
            </div>
          )}
        </div> */}
      </div>
    </div>
  );
};

export default Dashboard;