import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authApiClient from '../services/auth-api-client';
import useAuthContext from '../hooks/useAuthContext';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logoutUser } = useAuthContext();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalJobs: 0,
    totalApplications: 0,
    activeJobs: 0,
    pendingApplications: 0,
    newUsersThisMonth: 0,
    totalReviews: 0
  });
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJobForApplicants, setSelectedJobForApplicants] = useState(null);
  const [selectedJobForReviews, setSelectedJobForReviews] = useState(null);
  
  // Modal states
  const [showCreateJobModal, setShowCreateJobModal] = useState(false);
  const [showEditJobModal, setShowEditJobModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  
  // Form state for job creation/editing
  const [jobForm, setJobForm] = useState({
    category: '',
    title: '',
    description: '',
    company_name: '',
    requirements: '',
    location: ''
  });

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      // Fetch users
      const usersResponse = await authApiClient.get('/auth/users/');
      const usersData = usersResponse.data;
      setUsers(usersData);

      // Fetch jobs
      const jobsResponse = await authApiClient.get('/jobs/');
      const jobsData = jobsResponse.data;
      setJobs(jobsData);

      // Fetch all applications across all jobs
      let allApplications = [];
      let allReviews = [];
      
      for (const job of jobsData) {
        try {
          // Fetch applications for each job using nested endpoint
          const applicantsResponse = await authApiClient.get(`/jobs/${job.id}/appliedCandidates/`);
          const applicantsData = applicantsResponse.data.map(app => ({
            ...app,
            job_id: job.id,
            job_title: job.title,
            company_name: job.company_name,
            user_name: app.user?.name || `User #${app.user?.id}` || 'Unknown',
            user_id: app.user?.id
          }));
          allApplications = [...allApplications, ...applicantsData];
          
          // Fetch reviews for each job
          const reviewsResponse = await authApiClient.get(`/jobs/${job.id}/reviews/`);
          const reviewsData = reviewsResponse.data.map(review => ({
            ...review,
            job_id: job.id,
            job_title: job.title
          }));
          allReviews = [...allReviews, ...reviewsData];
        } catch (error) {
          console.error(`Error fetching data for job ${job.id}:`, error);
        }
      }
      
      setApplications(allApplications);
      setReviews(allReviews);

      // Calculate stats
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      
      setStats({
        totalUsers: usersData.length,
        totalJobs: jobsData.length,
        totalApplications: allApplications.length,
        activeJobs: jobsData.filter(job => job.is_active !== false).length,
        pendingApplications: allApplications.filter(app => app.status === 'pending' || app.status === 'applied').length,
        newUsersThisMonth: usersData.filter(u => new Date(u.date_joined) >= firstDayOfMonth).length,
        totalReviews: allReviews.length
      });

    } catch (error) {
      console.error('Error fetching admin data:', error);
      setStats({
        totalUsers: 0,
        totalJobs: 0,
        totalApplications: 0,
        activeJobs: 0,
        pendingApplications: 0,
        newUsersThisMonth: 0,
        totalReviews: 0
      });
    } finally {
      setLoading(false);
    }
  };

  // Job CRUD operations
  const handleCreateJob = async (e) => {
    e.preventDefault();
    try {
      const response = await authApiClient.post('/jobs/', jobForm);
      setJobs(prev => [...prev, response.data]);
      setStats(prev => ({ 
        ...prev, 
        totalJobs: prev.totalJobs + 1,
        activeJobs: prev.activeJobs + 1
      }));
      setShowCreateJobModal(false);
      resetJobForm();
      alert('Job created successfully!');
    } catch (error) {
      console.error('Error creating job:', error);
      alert('Failed to create job. Please try again.');
    }
  };

  const handleUpdateJob = async (e) => {
    e.preventDefault();
    try {
      const response = await authApiClient.put(`/jobs/${editingJob.id}/`, jobForm);
      setJobs(prev => prev.map(j => j.id === editingJob.id ? response.data : j));
      setShowEditJobModal(false);
      setEditingJob(null);
      resetJobForm();
      alert('Job updated successfully!');
    } catch (error) {
      console.error('Error updating job:', error);
      alert('Failed to update job. Please try again.');
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm("Are you sure you want to delete this job posting? This will also delete all associated applications and reviews.")) {
      try {
        await authApiClient.delete(`/jobs/${jobId}/`);
        setJobs(prev => prev.filter(j => j.id !== jobId));
        setApplications(prev => prev.filter(app => app.job_id !== jobId));
        setReviews(prev => prev.filter(review => review.job_id !== jobId));
        const deletedJobApps = applications.filter(app => app.job_id === jobId).length;
        const deletedJobReviews = reviews.filter(review => review.job_id === jobId).length;
        setStats(prev => ({ 
          ...prev, 
          totalJobs: prev.totalJobs - 1,
          totalApplications: prev.totalApplications - deletedJobApps,
          totalReviews: prev.totalReviews - deletedJobReviews
        }));
        alert('Job deleted successfully!');
      } catch (error) {
        console.error("Error deleting job:", error);
        alert("Failed to delete job.");
      }
    }
  };

  const openEditJobModal = (job) => {
    setEditingJob(job);
    setJobForm({
      category: job.category || '',
      title: job.title || '',
      description: job.description || '',
      company_name: job.company_name || '',
      requirements: job.requirements || '',
      location: job.location || ''
    });
    setShowEditJobModal(true);
  };

  const resetJobForm = () => {
    setJobForm({
      category: '',
      title: '',
      description: '',
      company_name: '',
      requirements: '',
      location: ''
    });
  };

  // Application management using nested endpoints
  const handleUpdateApplicationStatus = async (jobId, appId, newStatus) => {
    try {
      await authApiClient.put(`/jobs/${jobId}/appliedCandidates/${appId}/`, {
        status: newStatus
      });
      
      setApplications(prev => prev.map(a => 
        a.id === appId ? { ...a, status: newStatus } : a
      ));
      
      // Update pending count
      setStats(prev => {
        const app = applications.find(a => a.id === appId);
        const wasPending = app.status === 'pending' || app.status === 'applied';
        const isPending = newStatus === 'pending' || newStatus === 'applied';
        
        if (wasPending && !isPending) {
          return { ...prev, pendingApplications: prev.pendingApplications - 1 };
        } else if (!wasPending && isPending) {
          return { ...prev, pendingApplications: prev.pendingApplications + 1 };
        }
        return prev;
      });
      
      alert('Application status updated successfully!');
    } catch (error) {
      console.error("Error updating application status:", error);
      alert("Failed to update application status.");
    }
  };

  const fetchApplicantsForJob = async (jobId) => {
    try {
      const response = await authApiClient.get(`/jobs/${jobId}/appliedCandidates/`);
      const applicantsData = response.data.map(app => ({
        ...app,
        job_id: jobId,
        job_title: jobs.find(j => j.id === jobId)?.title,
        company_name: jobs.find(j => j.id === jobId)?.company_name,
        user_name: app.user?.name || `User #${app.user?.id}` || 'Unknown',
        user_id: app.user?.id
      }));
      
      // Update applications state with fresh data for this job
      setApplications(prev => [
        ...prev.filter(app => app.job_id !== jobId),
        ...applicantsData
      ]);
      
      setSelectedJobForApplicants(jobId);
      setActiveTab('applications');
    } catch (error) {
      console.error('Error fetching applicants:', error);
      alert('Failed to load applicants for this job.');
    }
  };

  // Review management
  const handleDeleteReview = async (jobId, reviewId) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        await authApiClient.delete(`/jobs/${jobId}/reviews/${reviewId}/`);
        setReviews(prev => prev.filter(r => r.id !== reviewId));
        setStats(prev => ({ ...prev, totalReviews: prev.totalReviews - 1 }));
        alert('Review deleted successfully!');
      } catch (error) {
        console.error("Error deleting review:", error);
        alert("Failed to delete review.");
      }
    }
  };

  const fetchReviewsForJob = async (jobId) => {
    try {
      const response = await authApiClient.get(`/jobs/${jobId}/reviews/`);
      const reviewsData = response.data.map(review => ({
        ...review,
        job_id: jobId,
        job_title: jobs.find(j => j.id === jobId)?.title
      }));
      
      // Update reviews state with fresh data for this job
      setReviews(prev => [
        ...prev.filter(review => review.job_id !== jobId),
        ...reviewsData
      ]);
      
      setSelectedJobForReviews(jobId);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      alert('Failed to load reviews for this job.');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      try {
        await authApiClient.delete(`/auth/users/${userId}/`);
        setUsers(prev => prev.filter(u => u.id !== userId));
        setStats(prev => ({ ...prev, totalUsers: prev.totalUsers - 1 }));
        alert('User deleted successfully!');
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Failed to delete user.");
      }
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      applied: 'bg-yellow-100 text-yellow-800',
      interview: 'bg-blue-100 text-blue-800',
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: '⏳',
      applied: '📤',
      interview: '📅',
      accepted: '✅',
      rejected: '❌'
    };
    return icons[status?.toLowerCase()] || '📋';
  };

  const filteredUsers = users.filter(u => 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredJobs = jobs.filter(j =>
    j.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredApplications = applications
    .filter(app => !selectedJobForApplicants || app.job_id === selectedJobForApplicants)
    .filter(app =>
      app.job_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.company_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const filteredReviews = reviews.filter(review =>
    review.job_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.comment?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white text-xl">
                👑
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-500">Manage your platform</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {stats.pendingApplications > 0 && (
                  <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                    {stats.pendingApplications}
                  </span>
                )}
              </button>

              {/* Admin Menu */}
              <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    {user?.first_name ? `${user.first_name} ${user.last_name}` : user?.email || 'Admin'}
                  </p>
                  <p className="text-xs text-purple-600 font-semibold">Administrator</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold uppercase">
                  {user?.first_name?.charAt(0) || user?.email?.charAt(0) || 'A'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 mb-8 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">Welcome back, Admin! 👋</h2>
              <p className="text-purple-100 text-lg">
                You have {stats.pendingApplications} pending applications to review.
              </p>
            </div>
            <button 
              onClick={() => setShowCreateJobModal(true)}
              className="bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold hover:bg-purple-50 transition-colors shadow-lg"
            >
              Post New Job
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {[
            {
              label: 'Total Users',
              value: stats.totalUsers,
              icon: '👥',
              color: 'from-blue-500 to-blue-600',
              subtext: `+${stats.newUsersThisMonth} this month`
            },
            {
              label: 'Total Jobs',
              value: stats.totalJobs,
              icon: '💼',
              color: 'from-green-500 to-emerald-600',
              subtext: `${stats.activeJobs} active`
            },
            {
              label: 'Total Applications',
              value: stats.totalApplications,
              icon: '📊',
              color: 'from-purple-500 to-purple-600',
              subtext: `${stats.pendingApplications} pending`
            },
            {
              label: 'Active Jobs',
              value: stats.activeJobs,
              icon: '✅',
              color: 'from-teal-500 to-cyan-600',
              subtext: `${stats.totalJobs - stats.activeJobs} inactive`
            },
            {
              label: 'Pending Reviews',
              value: stats.pendingApplications,
              icon: '⏳',
              color: 'from-yellow-500 to-orange-500',
              subtext: 'Need attention'
            },
            {
              label: 'Total Reviews',
              value: stats.totalReviews,
              icon: '⭐',
              color: 'from-pink-500 to-rose-600',
              subtext: 'User feedback'
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
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-gray-600 text-sm font-semibold mb-1">{stat.label}</p>
              <p className="text-gray-500 text-xs">{stat.subtext}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg mb-8 overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex gap-8 px-6 overflow-x-auto">
              {['overview', 'users', 'jobs', 'applications', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setSearchTerm('');
                  }}
                  className={`py-4 px-2 font-semibold capitalize transition-colors relative whitespace-nowrap ${
                    activeTab === tab
                      ? 'text-purple-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600"></div>
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
                      { label: 'Create Job', icon: '➕', color: 'from-blue-500 to-blue-600', action: () => setShowCreateJobModal(true) },
                      { label: 'View Users', icon: '👥', color: 'from-green-500 to-green-600', action: () => setActiveTab('users') },
                      { label: 'Manage Jobs', icon: '💼', color: 'from-purple-500 to-purple-600', action: () => setActiveTab('jobs') },
                      { label: 'Logout', icon: '🚪', color: 'from-orange-500 to-orange-600', action: logoutUser }
                    ].map((action, idx) => (
                      <button
                        key={idx}
                        onClick={action.action}
                        className="p-6 bg-white border-2 border-gray-200 rounded-xl hover:border-purple-500 hover:shadow-lg transition-all duration-300 group"
                      >
                        <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
                          {action.icon}
                        </div>
                        <p className="font-semibold text-gray-900 text-sm">{action.label}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Platform Summary */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Platform Summary</h3>
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">User Growth</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.newUsersThisMonth}</p>
                        <p className="text-xs text-gray-500">New users this month</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Job Posting Rate</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {stats.totalJobs > 0 ? Math.round((stats.activeJobs / stats.totalJobs) * 100) : 0}%
                        </p>
                        <p className="text-xs text-gray-500">Jobs currently active</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Application Rate</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {stats.totalJobs > 0 ? Math.round(stats.totalApplications / stats.totalJobs) : 0}
                        </p>
                        <p className="text-xs text-gray-500">Avg applications per job</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">User Management ({users.length})</h3>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b-2 border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">User</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Email</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Role</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Joined</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                            No users found.
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map((u) => (
                          <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white font-bold text-sm uppercase">
                                  {u.first_name?.charAt(0) || u.email?.charAt(0) || 'U'}
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-900">
                                    {u.first_name && u.last_name ? `${u.first_name} ${u.last_name}` : 'No Name'}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4 text-gray-700">{u.email}</td>
                            <td className="px-4 py-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                u.is_staff ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                                {u.is_staff ? 'Admin' : 'User'}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-gray-600 text-sm">
                              {u.date_joined ? new Date(u.date_joined).toLocaleDateString() : 'N/A'}
                            </td>
                            <td className="px-4 py-4">
                              <button
                                onClick={() => handleDeleteUser(u.id)}
                                className="text-red-600 hover:text-red-700 text-sm font-semibold"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Jobs Tab */}
            {activeTab === 'jobs' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Job Management ({jobs.length})</h3>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      placeholder="Search jobs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <button
                      onClick={() => setShowCreateJobModal(true)}
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                    >
                      + New Job
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {filteredJobs.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No jobs found.</p>
                  ) : (
                    filteredJobs.map((job) => (
                      <div key={job.id} className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-all duration-300">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="text-lg font-bold text-gray-900">{job.title || 'Untitled Job'}</h4>
                              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
                                {job.category || 'Uncategorized'}
                              </span>
                            </div>
                            <p className="text-purple-600 font-semibold mb-2">{job.company_name || 'No Company'}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                              <span className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                </svg>
                                {job.location || 'Location not specified'}
                              </span>
                              <span>
                                Posted {job.created_at ? new Date(job.created_at).toLocaleDateString() : 'N/A'}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-2">{job.description || 'No description'}</p>
                          </div>
                          <div className="flex flex-col gap-2 ml-4">
                            <button
                              onClick={() => fetchApplicantsForJob(job.id)}
                              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold hover:bg-blue-200 transition-colors text-sm whitespace-nowrap"
                            >
                              View Applicants
                            </button>
                            <button
                              onClick={() => fetchReviewsForJob(job.id)}
                              className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg font-semibold hover:bg-yellow-200 transition-colors text-sm whitespace-nowrap"
                            >
                              View Reviews
                            </button>
                            <button
                              onClick={() => openEditJobModal(job)}
                              className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-semibold hover:bg-purple-200 transition-colors text-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteJob(job.id)}
                              className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-semibold hover:bg-red-200 transition-colors text-sm"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Applications Tab */}
            {activeTab === 'applications' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Application Management ({filteredApplications.length})
                    </h3>
                    {selectedJobForApplicants && (
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-sm text-purple-600 font-semibold bg-purple-50 px-3 py-1 rounded-full">
                          Filtering by: {jobs.find(j => j.id === selectedJobForApplicants)?.title}
                        </span>
                        <button 
                          onClick={() => setSelectedJobForApplicants(null)}
                          className="text-xs text-gray-500 hover:text-gray-700 underline"
                        >
                          Clear Filter
                        </button>
                      </div>
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="Search applications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div className="space-y-4">
                  {filteredApplications.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No applications found.</p>
                  ) : (
                    filteredApplications.map((app) => (
                      <div key={app.id} className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-all duration-300">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="text-lg font-bold text-gray-900 mb-1">
                              {app.job_title || `Job #${app.job_id}`}
                            </h4>
                            <p className="text-purple-600 font-semibold mb-2">
                              Applicant: {app.user_name || app.user_email || `User #${app.user}`}
                            </p>
                            <p className="text-sm text-gray-600 mb-2">
                              Company: {app.company_name || 'N/A'}
                            </p>
                            {app.uploaded_resume && (
                              <p className="text-sm text-gray-600 mb-2">
                                📎 Custom Resume Uploaded
                              </p>
                            )}
                            {app.use_profile_resume && (
                              <p className="text-sm text-gray-600 mb-2">
                                📄 Using Profile Resume
                              </p>
                            )}
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Applied {app.applied_at ? new Date(app.applied_at).toLocaleDateString() : 'N/A'}
                              </span>
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(app.status)}`}>
                                {getStatusIcon(app.status)} {app.status || 'Applied'}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <select
                              value={app.status || 'applied'}
                              onChange={(e) => handleUpdateApplicationStatus(app.job_id, app.id, e.target.value)}
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                            >
                              <option value="applied">Applied</option>
                              <option value="pending">Pending</option>
                              <option value="interview">Interview</option>
                              <option value="accepted">Accepted</option>
                              <option value="rejected">Rejected</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Review Management ({reviews.length})</h3>
                  <input
                    type="text"
                    placeholder="Search reviews..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div className="space-y-4">
                  {filteredReviews.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No reviews found.</p>
                  ) : (
                    filteredReviews.map((review) => (
                      <div key={review.id} className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-all duration-300">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="text-lg font-bold text-gray-900">
                                {review.job_title || `Job #${review.job_id}`}
                              </h4>
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <span key={i} className={`text-lg ${i < (review.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}>
                                    ⭐
                                  </span>
                                ))}
                              </div>
                            </div>
                            <p className="text-purple-600 font-semibold mb-2">
                              Reviewer: {review.user_name || review.user_email || `User #${review.user}`}
                            </p>
                            <p className="text-sm text-gray-700 mb-2">
                              {review.comment || review.review || 'No comment provided'}
                            </p>
                            <p className="text-xs text-gray-500">
                              Posted {review.created_at ? new Date(review.created_at).toLocaleDateString() : 'N/A'}
                            </p>
                          </div>
                          <div className="flex flex-col gap-2 ml-4">
                            <button
                              onClick={() => handleDeleteReview(review.job_id, review.id)}
                              className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-semibold hover:bg-red-200 transition-colors text-sm"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Job Modal */}
      {showCreateJobModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Create New Job</h2>
            </div>
            <form onSubmit={handleCreateJob} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                  <input
                    type="text"
                    value={jobForm.category}
                    onChange={(e) => setJobForm({...jobForm, category: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., IT, Marketing, Finance"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Job Title</label>
                  <input
                    type="text"
                    value={jobForm.title}
                    onChange={(e) => setJobForm({...jobForm, title: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., Senior Software Engineer"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Company Name</label>
                  <input
                    type="text"
                    value={jobForm.company_name}
                    onChange={(e) => setJobForm({...jobForm, company_name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., Tech Corp"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    value={jobForm.location}
                    onChange={(e) => setJobForm({...jobForm, location: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., San Francisco, CA"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                  <textarea
                    value={jobForm.description}
                    onChange={(e) => setJobForm({...jobForm, description: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    rows="4"
                    placeholder="Job description..."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Requirements</label>
                  <textarea
                    value={jobForm.requirements}
                    onChange={(e) => setJobForm({...jobForm, requirements: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    rows="4"
                    placeholder="Job requirements..."
                    required
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateJobModal(false);
                    resetJobForm();
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                >
                  Create Job
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Job Modal */}
      {showEditJobModal && editingJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Edit Job</h2>
            </div>
            <form onSubmit={handleUpdateJob} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                  <input
                    type="text"
                    value={jobForm.category}
                    onChange={(e) => setJobForm({...jobForm, category: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Job Title</label>
                  <input
                    type="text"
                    value={jobForm.title}
                    onChange={(e) => setJobForm({...jobForm, title: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Company Name</label>
                  <input
                    type="text"
                    value={jobForm.company_name}
                    onChange={(e) => setJobForm({...jobForm, company_name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    value={jobForm.location}
                    onChange={(e) => setJobForm({...jobForm, location: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                  <textarea
                    value={jobForm.description}
                    onChange={(e) => setJobForm({...jobForm, description: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    rows="4"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Requirements</label>
                  <textarea
                    value={jobForm.requirements}
                    onChange={(e) => setJobForm({...jobForm, requirements: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    rows="4"
                    required
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditJobModal(false);
                    setEditingJob(null);
                    resetJobForm();
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                >
                  Update Job
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
