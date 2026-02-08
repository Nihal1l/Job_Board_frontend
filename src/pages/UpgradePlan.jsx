import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/api-client';

const UpgradePlan = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [hoveredPlan, setHoveredPlan] = useState(null);
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [processingPayment, setProcessingPayment] = useState(false);

  // Icon mapping based on icon_type from API
  const iconMap = {
    'basic': '🌱',
    'pro': '⭐',
    'premium': '👑',
    'professional': '💼',
    'enterprise': '🚀'
  };

  // Color mapping for different plans
  const colorMap = {
    'Basic': { gradient: 'from-emerald-400 to-teal-500', shadow: 'shadow-emerald-200' },
    'Professional': { gradient: 'from-blue-500 to-indigo-600', shadow: 'shadow-blue-200' },
    'Premium': { gradient: 'from-purple-500 to-pink-600', shadow: 'shadow-purple-200' },
    'Pro': { gradient: 'from-violet-500 to-purple-600', shadow: 'shadow-violet-200' },
    'Enterprise': { gradient: 'from-amber-500 to-orange-600', shadow: 'shadow-amber-200' }
  };

  // Fetch premium features from API
  useEffect(() => {
    const fetchPlans = async () => {
      setLoading(true);
      setFetchError(null);
      try {
        console.log('Fetching pricing plans...');
        const response = await apiClient.get('/premiumFeatures/');
        console.log('Plans fetched successfully:', response.data);
        
        // Transform API data to match our component structure
        const transformedPlans = response.data.map(plan => ({
          id: plan.id,
          name: plan.name,
          description: plan.description,
          price: {
            monthly: plan.price,
            yearly: plan.price * 10 // Assuming 17% discount for yearly
          },
          icon: iconMap[plan.icon_type] || '💎',
          popular: plan.is_recommended,
          features: plan.items.map(item => item.text),
          colors: colorMap[plan.name] || { gradient: 'from-blue-500 to-indigo-600', shadow: 'shadow-blue-200' }
        }));

        setPlans(transformedPlans);
      } catch (error) {
        console.error('Error fetching plans:', error);
        setFetchError('Unable to load pricing plans. Please check your connection or try again later.');
        setPlans([]); // Clear plans on error
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);


  const [initError, setInitError] = useState(null);

  const initiatePayment = async (planId) => {
    setProcessingPayment(true);
    setSelectedPlan(planId);
    setInitError(null);

    try {
      const plan = plans.find(p => p.id === planId);
      const price = billingCycle === 'monthly' ? plan.price.monthly : plan.price.yearly;

      // Initiate payment
      const authTokensStr = localStorage.getItem('authTokens');
      const authTokens = authTokensStr ? JSON.parse(authTokensStr) : null;
      
      console.log('Initiating payment for plan:', planId, 'with amount:', price);
      
      if (!authTokens?.access) {
        setInitError('Authentication Error: Please log in again to continue.');
        setTimeout(() => navigate('/login'), 2000);
        return;
      }

      try {
        const response = await apiClient.post('/payment/initiate/', {
          plan_id: planId,
          plan_name: plan.name,
          amount: price,
          billing_cycle: billingCycle,
          currency: 'BDT'
        }, {
          headers: {
            'Authorization': `JWT ${authTokens.access}`
          }
        });

        console.log('Payment initiation response:', response);
        const data = response.data;

        if (data.payment_url) {
          window.location.href = data.payment_url;
        } else if (data.checkout_url) {
          window.location.href = data.checkout_url;
        } else {
          console.error('No payment URL in response:', data);
          setInitError(`Server Error: ${data.message || data.error || 'No payment URL received'}`);
        }
      } catch (error) {
        console.error('Payment initiation error:', error);
        const errorMsg = error.response?.data?.message || error.response?.data?.error || error.message;
        setInitError(`Payment Initiation Failed: ${errorMsg}`);
      }

    } catch (error) {
      console.error('Payment initiation error:', error);
      setInitError('Payment failed to initiate. Please try again.');
    } finally {
      // Don't reset processing if we are redirecting
      // But if there's an error, we must reset
      if (initError || !selectedPlan) {
        setProcessingPayment(false);
      }
    }
  };

  const handleSelectPlan = (planId) => {
    initiatePayment(planId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-xl">Loading pricing plans...</p>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-6">{fetchError}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
          >
            Retry Loading
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 py-20 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
          {initError && (
            <div className="mb-8 bg-red-100 border-l-4 border-red-500 p-4 rounded-lg animate-bounce">
              <div className="flex items-center justify-center gap-3">
                <span className="text-2xl">⚠️</span>
                <p className="text-red-700 font-bold">{initError}</p>
              </div>
            </div>
          )}
          <div className="inline-flex items-center gap-2 bg-white rounded-full px-6 py-2 shadow-md mb-6">
            <span className="text-2xl">💎</span>
            <span className="font-semibold text-gray-700">Premium Plans</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Choose Your Perfect
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Career Plan
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Unlock premium features and accelerate your job search journey with our flexible pricing options.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mb-16">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
              billingCycle === 'monthly'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Monthly
          </button>
          
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 relative ${
              billingCycle === 'yearly'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Yearly
            <span className="absolute -top-2 -right-2 bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xs px-2 py-1 rounded-full font-bold">
              -17%
            </span>
          </button>
        </div>

        {/* Pricing Cards */}
        {plans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {plans.map((plan, index) => {
              const price = billingCycle === 'monthly' ? plan.price.monthly : plan.price.yearly;
              const savings = billingCycle === 'yearly' ? (plan.price.monthly * 12 - plan.price.yearly) : 0;
              
              return (
                <div
                  key={plan.id}
                  className={`relative bg-white rounded-3xl p-8 transition-all duration-500 hover:shadow-2xl ${
                    plan.popular 
                      ? `ring-4 ring-blue-500 ring-opacity-50 ${plan.colors.shadow} shadow-2xl md:-mt-4 md:scale-105` 
                      : `${plan.colors.shadow} shadow-xl`
                  }`}
                  style={{
                    animation: `fadeInUp 0.6s ease-out ${index * 0.15}s forwards`,
                    opacity: 0
                  }}
                >
                  {/* Popular Badge */}
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full font-bold text-sm shadow-lg">
                        ⭐ RECOMMENDED
                      </div>
                    </div>
                  )}

                  {/* Icon */}
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${plan.colors.gradient} flex items-center justify-center text-4xl mb-6 shadow-lg transform transition-transform duration-300 hover:rotate-12 hover:scale-110`}>
                    {plan.icon}
                  </div>

                  {/* Plan Name & Description */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-6">{plan.description}</p>

                  {/* Price */}
                  <div className="mb-8">
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-5xl font-bold text-gray-900">৳{price}</span>
                      <span className="text-gray-500">/{billingCycle === 'monthly' ? 'month' : 'year'}</span>
                    </div>
                    {savings > 0 && (
                      <p className="text-sm text-green-600 font-semibold">
                        💰 Save ৳{savings} annually
                      </p>
                    )}
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => handleSelectPlan(plan.id)}
                    disabled={processingPayment && selectedPlan === plan.id}
                    className={`w-full py-4 rounded-xl font-bold text-lg mb-8 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${
                      plan.popular
                        ? `bg-gradient-to-r ${plan.colors.gradient} text-white hover:shadow-xl`
                        : 'bg-gray-900 text-white hover:bg-gray-800'
                    }`}
                  >
                    {processingPayment && selectedPlan === plan.id ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Processing...
                      </span>
                    ) : (
                      'Get Started'
                    )}
                  </button>

                  {/* Features */}
                  <div className="space-y-4">
                    <div className="text-sm font-semibold text-gray-900 mb-4">
                      WHAT'S INCLUDED:
                    </div>
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className={`flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br ${plan.colors.gradient} flex items-center justify-center`}>
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-700 text-sm leading-relaxed">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">😔</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No plans available</h3>
            <p className="text-gray-600">Please check back later.</p>
          </div>
        )}

        {/* Trust Signals */}
        <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
          <div className="flex flex-wrap items-center justify-center gap-12 mb-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-1">10k+</div>
              <div className="text-gray-600">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-1">98%</div>
              <div className="text-gray-600">Satisfaction Rate</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-1">24/7</div>
              <div className="text-gray-600">Support</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-1">500+</div>
              <div className="text-gray-600">Companies</div>
            </div>
          </div>
          
          <p className="text-gray-600 text-sm">
            🔒 Secure payment • 💳 Cancel anytime • 🎯 No hidden fees
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default UpgradePlan;
