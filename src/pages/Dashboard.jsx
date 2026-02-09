import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authApiClient from '../services/auth-api-client';
import useAuthContext from '../hooks/useAuthContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logoutUser } = useAuthContext();
  const [stats, setStats] = useState({
    totalApplications: 0,
    pendingApplications: 0,
    interviewsScheduled: 0,
    savedJobs: 0
  });
  const [recentApplications, setRecentApplications] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch applications using authApiClient (headers handled by interceptor)
      const appsResponse = await authApiClient.get('/appliedJobs/');
      const appsData = appsResponse.data;
      setRecentApplications(appsData);

      // Calculate stats
      setStats({
        totalApplications: appsData.length,
        // Assuming status field exists, otherwise default to 0 or map accordingly
        pendingApplications: appsData.filter(app => app.status === 'pending').length,
        interviewsScheduled: appsData.filter(app => app.status === 'interview').length,
        savedJobs: 0 // Placeholder/TODO: Implement saved jobs endpoint if available
      });

      // Fetch saved jobs - Placeholder for now as endpoint wasn't specified in request
      // const savedResponse = await authApiClient.get('/saved-jobs/');
      // setSavedJobs(savedResponse.data);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Fallback/Mock data if API fails (for demo purposes)
       setStats({
         totalApplications: 0,
         pendingApplications: 0,
         interviewsScheduled: 0,
         savedJobs: 0
       });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteApplication = async (id) => {
      if (window.confirm("Are you sure you want to delete this application?")) {
          try {
              await authApiClient.delete(`/appliedJobs/${id}/`);
              setRecentApplications(prev => prev.filter(app => app.id !== id));
              // Update stats
              setStats(prev => ({
                  ...prev,
                  totalApplications: prev.totalApplications - 1,
                  // We might need to adjust other counters too if we knew the deleted app's status
              }));
          } catch (error) {
              console.error("Error deleting application:", error);
              alert("Failed to delete application.");
          }
      }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      interview: 'bg-blue-100 text-blue-800',
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: '⏳',
      interview: '📅',
      accepted: '✅',
      rejected: '❌'
    };
    return icons[status?.toLowerCase()] || '📋';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {/* <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span> */}
              </button>

              {/* User Menu */}
              <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{user?.first_name ? `${user.first_name} ${user.last_name}` : user?.email || 'User'}</p>
                  <p className="text-xs text-gray-500">Job Seeker</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold uppercase">
                  {user?.first_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 mb-8 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">Welcome back! 👋</h2>
              <p className="text-blue-100 text-lg">You have applied to {stats.totalApplications} jobs.</p>
            </div>
            <button 
              onClick={() => navigate('/jobs')}
              className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors shadow-lg"
            >
              Browse Jobs
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              label: 'Total Applications',
              value: stats.totalApplications,
              icon: '📊',
              color: 'from-blue-500 to-blue-600',
              change: ''
            },
            {
              label: 'Pending Review',
              value: stats.pendingApplications,
              icon: '⏳',
              color: 'from-yellow-500 to-orange-500',
              change: ''
            },
            {
              label: 'Interviews',
              value: stats.interviewsScheduled,
              icon: '📅',
              color: 'from-green-500 to-emerald-600',
              change: ''
            },
            {
              label: 'Saved Jobs',
              value: stats.savedJobs,
              icon: '❤️',
              color: 'from-purple-500 to-pink-600',
              change: ''
            }
          ].map((stat, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-2xl shadow-md`}>
                  {stat.icon}
                </div>
                 {/* <span className="text-xs text-green-600 font-semibold bg-green-50 px-2 py-1 rounded-full">
                  {stat.change}
                </span> */}
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-gray-600 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg mb-8 overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex gap-8 px-6">
              {['overview', 'applications', 'saved'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-2 font-semibold capitalize transition-colors relative ${
                    activeTab === tab
                      ? 'text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                 {/* Quick Actions */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: 'Update Resume', icon: '📄', color: 'from-blue-500 to-blue-600', action: () => {} },
                      { label: 'Find Jobs', icon: '🔍', color: 'from-green-500 to-green-600', action: () => navigate('/jobs') },
                      { label: 'Profile Settings', icon: '⚙️', color: 'from-purple-500 to-purple-600', action: () => navigate('/dashboard/profile') }, 
                      { label: 'Logout', icon: '🚪', color: 'from-orange-500 to-orange-600', action: logoutUser }
                    ].map((action, idx) => (
                      <button
                        key={idx}
                        onClick={action.action}
                        className="p-6 bg-white border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-lg transition-all duration-300 group"
                      >
                        <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
                          {action.icon}
                        </div>
                        <p className="font-semibold text-gray-900 text-sm">{action.label}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Recent Activity (Placeholder/Static for now as API might not provide this directly) */}
                {/* <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h3>
                   ...
                </div> */}
              </div>
            )}

            {/* Applications Tab */}
            {activeTab === 'applications' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">My Applications</h3>
                  {/* <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>All Status</option>
                    <option>Pending</option>
                    <option>Interview</option>
                    <option>Accepted</option>
                    <option>Rejected</option>
                  </select> */}
                </div>

                <div className="space-y-4">
                  {recentApplications.length === 0 ? (
                      <p className="text-gray-500">No applications found.</p>
                  ) : (
                      recentApplications.map((app) => (
                        <div key={app.id} className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-all duration-300">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h4 className="text-lg font-bold text-gray-900 mb-1">{app.job_title || `Job #${app.job}`}</h4>
                              <p className="text-blue-600 font-semibold mb-2">{app.company_name || 'Company Name'}</p>
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                {/* <span className="flex items-center gap-1">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  </svg>
                                  {app.location || 'Location'}
                                </span> */}
                                <span className="flex items-center gap-1">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                  Applied {app.created_at ? new Date(app.created_at).toLocaleDateString() : 'N/A'}
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              {/* <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(app.status)}`}>
                                {getStatusIcon(app.status)} {app.status || 'Pending'}
                              </span> */}
                              <button 
                                onClick={() => handleDeleteApplication(app.id)}
                                className="text-red-600 hover:text-red-700 text-sm font-semibold border border-red-200 px-3 py-1 rounded-lg hover:bg-red-50 transition-colors"
                              >
                                Delete Application
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>
            )}

            {/* Saved Jobs Tab */}
            {activeTab === 'saved' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Saved Jobs ({savedJobs.length})</h3>
                  {/* <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
                    Clear All
                  </button> */}
                </div>
                 <p className="text-gray-500">Saved jobs feature coming soon.</p>

                {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {savedJobs.map((job) => (
                    <div key={job.id} className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-all duration-300">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="text-lg font-bold text-gray-900">{job.title}</h4>
                        <button className="text-red-500 hover:text-red-600">
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                          </svg>
                        </button>
                      </div>
                      <p className="text-blue-600 font-semibold mb-2">{job.company}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                        <span>{job.location}</span>
                        <span className="text-green-600 font-semibold">{job.salary}</span>
                      </div>
                      <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                        Apply Now
                      </button>
                    </div>
                  ))}
                </div> */}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;