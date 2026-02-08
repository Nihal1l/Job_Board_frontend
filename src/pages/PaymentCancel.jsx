import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import apiClient from '../services/api-client';

const PaymentCancel = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    handlePaymentCancel();
  }, []);

  const handlePaymentCancel = async () => {
    try {
      const transactionId = searchParams.get('transaction_id') || searchParams.get('tran_id');
      console.log('Payment Cancel Page Loaded. Transaction ID:', transactionId);
      
      const authTokensStr = localStorage.getItem('authTokens');
      const authTokens = authTokensStr ? JSON.parse(authTokensStr) : null;

      if (authTokens?.access) {
        // Notify backend about cancellation
        await apiClient.post('/payment/cancel/', {
          transaction_id: transactionId,
          status: 'cancelled'
        }, {
          headers: {
            'Authorization': `JWT ${authTokens.access}`
          }
        });
      }
    } catch (error) {
      console.error('Error logging cancellation:', error);
    }
  };

  const goToPricing = () => {
    navigate('/upgrade-plan');
  };

  const goToHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50 flex items-center justify-center px-6 py-12">
      <div className="max-w-2xl w-full">
        
        {/* Cancel Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-400 to-amber-500 p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="absolute w-64 h-64 bg-white opacity-10 rounded-full -top-32 -right-32"></div>
              <div className="absolute w-96 h-96 bg-white opacity-10 rounded-full -bottom-48 -left-48"></div>
            </div>
            
            <div className="relative z-10">
              {/* Cancel Icon */}
              <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-full mb-6">
                <svg className="w-16 h-16 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Payment Cancelled
              </h1>
              <p className="text-orange-100 text-lg">
                Your payment has been cancelled
              </p>
            </div>
          </div>

          {/* Body */}
          <div className="p-8 md:p-12">
            
            {/* Message */}
            <div className="text-center mb-8">
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                No worries! Your payment was cancelled and no charges were made to your account.
                You can try again whenever you're ready.
              </p>
            </div>

            {/* Why Subscribe */}
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 mb-8">
              <h3 className="font-bold text-gray-900 mb-4 text-lg">Why Subscribe?</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-orange-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <p className="text-gray-700">Get unlimited access to premium job listings</p>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-orange-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                  <p className="text-gray-700">AI-powered resume builder and career insights</p>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-orange-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <p className="text-gray-700">Priority support and dedicated career advisor</p>
                </div>
              </div>
            </div>

            {/* Special Offer */}
            <div className="bg-gradient-to-r from-orange-500 to-amber-600 rounded-2xl p-6 mb-8 text-center text-white">
              <h3 className="font-bold text-xl mb-2">Limited Time Offer!</h3>
              <p className="text-orange-100 mb-4">
                Use code <span className="bg-white text-orange-600 px-3 py-1 rounded-lg font-bold">SAVE20</span> to get 20% off your first month
              </p>
              <p className="text-sm text-orange-100">
                Offer expires in 24 hours
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={goToPricing}
                className="flex-1 bg-gradient-to-r from-orange-500 to-amber-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                Try Again
              </button>
              <button
                onClick={goToHome}
                className="flex-1 bg-gray-100 text-gray-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-200 transition-colors duration-300"
              >
                Back to Home
              </button>
            </div>

            {/* Help Section */}
            <div className="mt-8 pt-8 border-t border-gray-200 text-center">
              <p className="text-gray-600 text-sm mb-2">
                Have questions about our plans?
              </p>
              <div className="flex items-center justify-center gap-4 text-sm">
                <a href="/faq" className="text-orange-600 hover:text-orange-700 font-semibold">
                  View FAQ
                </a>
                <span className="text-gray-400">•</span>
                <a href="mailto:support@jobportal.com" className="text-orange-600 hover:text-orange-700 font-semibold">
                  Contact Support
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Reassurance */}
        <div className="text-center mt-8 text-gray-600 text-sm">
          <p>✓ No charges were made • ✓ Your account is safe</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancel;
