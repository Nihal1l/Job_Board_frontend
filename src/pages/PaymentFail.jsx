import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import apiClient from '../services/api-client';

const PaymentFail = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [errorDetails, setErrorDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    handlePaymentFailure();
  }, []);

  const handlePaymentFailure = async () => {
    setLoading(true);
    try {
      const transactionId = searchParams.get('transaction_id') || searchParams.get('tran_id') || searchParams.get('tranID');
      const errorCode = searchParams.get('error_code') || searchParams.get('error');
      const errorMessage = searchParams.get('error_message') || searchParams.get('msg');
      
      console.log('Payment Fail Page Loaded:', { transactionId, errorCode, errorMessage });

      // Log failure to backend if possible
      const authTokensStr = localStorage.getItem('authTokens');
      const authTokens = authTokensStr ? JSON.parse(authTokensStr) : null;

      if (authTokens?.access) {
        try {
          const response = await apiClient.post('/payment/fail/', {
            transaction_id: transactionId,
            error_code: errorCode,
            error_message: errorMessage,
            status: 'failed',
            raw_params: Object.fromEntries(searchParams.entries())
          }, {
            headers: {
              'Authorization': `JWT ${authTokens.access}`
            }
          });

          console.log('Payment failure log response:', response.data);
          setErrorDetails(response.data);
        } catch (apiErr) {
          console.error('API Fail Log Error:', apiErr);
        }
      }
    } catch (error) {
      console.error('Error in failure handler:', error);
    } finally {
      setLoading(false);
    }
  };

  const tryAgain = () => navigate('/upgrade-plan');
  const goToHome = () => navigate('/');

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-12">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          
          {/* Header */}
          <div className="bg-red-600 p-10 text-center text-white">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <span className="text-4xl text-white">❌</span>
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-black mb-2">Payment Failed</h1>
            <p className="text-white text-opacity-90 font-medium">
              We couldn't process your transaction.
            </p>
          </div>

          <div className="p-8 md:p-10">
            {/* Error Message Section */}
            <div className="bg-red-50 border border-red-100 rounded-2xl p-6 mb-8">
              <h3 className="text-red-900 font-bold mb-2 uppercase tracking-wider text-sm">What went wrong?</h3>
              <p className="text-red-700 font-medium italic">
                "{searchParams.get('error_message') || searchParams.get('error') || 'The transaction was declined by the payment gateway or bank.'}"
              </p>
            </div>

            {/* Assistance Section */}
            <div className="space-y-4 mb-8">
              <h3 className="text-gray-900 font-bold mb-4">You can try the following:</h3>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl">
                  <span className="text-2xl">💳</span>
                  <span className="text-sm text-gray-600">Check if your card has sufficient funds.</span>
                </div>
                <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl">
                  <span className="text-2xl">🏦</span>
                  <span className="text-sm text-gray-600">Contact your bank for potential blocks.</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={tryAgain}
                className="bg-red-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-red-700 transition-all shadow-lg hover:shadow-red-200"
              >
                Try Again
              </button>
              <button
                onClick={goToHome}
                className="bg-gray-100 text-gray-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-200 transition-all"
              >
                Back to Home
              </button>
            </div>

            {/* Debug Diagnostics */}
            <div className="mt-10 pt-6 border-t border-gray-100">
              <p className="text-xs text-gray-400 mb-2 font-bold uppercase">Transaction Details</p>
              <div className="bg-gray-50 p-4 rounded-lg overflow-auto max-h-40">
                <pre className="text-[10px] text-gray-500">
                  Transaction ID: {searchParams.get('transaction_id') || searchParams.get('tran_id') || 'N/A'}
                  {"\n"}Timestamp: {new Date().toLocaleString()}
                  {"\n"}URL Params: {JSON.stringify(Object.fromEntries(searchParams.entries()), null, 2)}
                </pre>
              </div>
            </div>

            <div className="text-center mt-8">
              <a href="mailto:support@jobportal.com" className="text-blue-600 font-bold hover:underline">
                Contact Support for Help
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFail;
