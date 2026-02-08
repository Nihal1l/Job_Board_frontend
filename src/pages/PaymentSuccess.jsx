import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import apiClient from '../services/api-client';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [processing, setProcessing] = useState(true);
  const [paymentData, setPaymentData] = useState(null);
  const [statusMessage, setStatusMessage] = useState('Initializing verification...');
  const [errorHeader, setErrorHeader] = useState(null);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTimer(t => t + 1), 1000);
    handlePaymentSuccess();
    return () => clearInterval(interval);
  }, []);

  const handlePaymentSuccess = async () => {
    try {
      // Get payment details from URL params - Support multiple formats
      const transactionId = 
        searchParams.get('transaction_id') || 
        searchParams.get('tran_id') || 
        searchParams.get('tranID') || 
        searchParams.get('payment_id') ||
        searchParams.get('tr_id');

      const planId = searchParams.get('plan_id') || searchParams.get('plan');
      const amount = searchParams.get('amount') || searchParams.get('store_amount');

      console.log('Payment Success Debug - Transaction ID:', transactionId, 'Params:', Object.fromEntries(searchParams.entries()));

      if (!transactionId) {
        setStatusMessage('We couldn\'t find a transaction ID in the URL. If you just completed a payment, please refresh or contact support.');
        setProcessing(false);
        return;
      }

      setStatusMessage(`Found Transaction: ${transactionId}. Verifying with server...`);

      // Call success endpoint to confirm payment
      const authTokensStr = localStorage.getItem('authTokens');
      const authTokens = authTokensStr ? JSON.parse(authTokensStr) : null;
      
      if (!authTokens?.access) {
        console.error('No auth token found in PaymentSuccess');
        setErrorHeader('Authentication Required');
        setStatusMessage('Please log in so we can link this payment to your account.');
        setProcessing(false);
        return;
      }

      const response = await apiClient.post('/payment/success/', {
        transaction_id: transactionId,
        plan_id: planId,
        amount: amount,
        status: 'completed',
        // Pass all params just in case backend needs them for verification
        raw_params: Object.fromEntries(searchParams.entries())
      }, {
        headers: {
          'Authorization': `JWT ${authTokens.access}`
        }
      });

      console.log('Payment confirmation response:', response.data);
      setPaymentData(response.data);
      setStatusMessage('Verification Complete! Your account is now active.');
      setProcessing(false);

    } catch (error) {
      console.error('Error confirming payment:', error);
      setErrorHeader('Verification Failed');
      const msg = error.response?.data?.message || error.response?.data?.error || error.message;
      setStatusMessage(`Verification failed: ${msg}`);
      setProcessing(false);
    }
  };

  const goToDashboard = () => navigate('/dashboard');
  const goToHome = () => navigate('/');

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-12">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          
          {/* Status Header */}
          <div className={`p-10 text-center ${errorHeader ? 'bg-red-600' : processing ? 'bg-blue-600' : 'bg-emerald-600'} text-white transition-colors duration-500`}>
            <div className="flex justify-center mb-6">
              {processing ? (
                <div className="w-20 h-20 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : errorHeader ? (
                <div className="text-6xl text-white">⚠️</div>
              ) : (
                <div className="text-6xl text-white">✅</div>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-black mb-2">
              {processing ? 'Confirming Payment' : errorHeader ? errorHeader : 'Payment Confirmed'}
            </h1>
            <p className="text-white text-opacity-90 font-medium">
              {statusMessage}
            </p>
          </div>

          <div className="p-8 md:p-10">
            {/* Success Details */}
            {paymentData && (
              <div className="bg-emerald-50 rounded-2xl p-6 mb-8 border border-emerald-100">
                <h3 className="text-emerald-900 font-bold mb-4 uppercase tracking-wider text-sm">Transaction Summary</h3>
                <div className="space-y-4">
                  <div className="flex justify-between border-b border-emerald-200 pb-2">
                    <span className="text-emerald-700">Ref ID:</span>
                    <span className="font-mono font-bold text-emerald-900">{paymentData.transaction_id || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between border-b border-emerald-200 pb-2">
                    <span className="text-emerald-700">Subscription:</span>
                    <span className="font-bold text-emerald-900">{paymentData.plan_name || 'Premium'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-emerald-700">Amount Paid:</span>
                    <span className="font-black text-emerald-600 text-xl">৳{paymentData.amount || '0.00'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* If stuck in processing for too long */}
            {processing && timer > 5 && (
              <div className="bg-blue-50 p-4 rounded-xl mb-6 text-sm text-blue-800 animate-pulse">
                Thinking longer than usual... This can happen if the network is slow.
              </div>
            )}

            {/* Error Actions */}
            {errorHeader && (
              <div className="mb-8">
                <button 
                  onClick={() => window.location.reload()}
                  className="w-full bg-red-600 text-white py-4 rounded-xl font-bold hover:bg-red-700 transition-all mb-4"
                >
                  Retry Verification
                </button>
              </div>
            )}

            {/* Standard Actions */}
            {!processing && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={goToDashboard}
                  className="bg-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-emerald-700 transition-all shadow-lg hover:shadow-emerald-200"
                >
                  Go to Dashboard
                </button>
                <button
                  onClick={goToHome}
                  className="bg-gray-100 text-gray-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-200 transition-all"
                >
                  Back to Home
                </button>
              </div>
            )}

            {/* Debug Info (Only shows if no ID found or error) */}
            {(errorHeader || (!processing && !paymentData)) && (
              <div className="mt-8 pt-6 border-t border-gray-100">
                <p className="text-xs text-gray-400 mb-2 font-bold uppercase">Debug Diagnostics</p>
                <div className="bg-gray-50 p-4 rounded-lg overflow-auto max-h-32">
                  <pre className="text-[10px] text-gray-500">
                    URL Parameters: {JSON.stringify(Object.fromEntries(searchParams.entries()), null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
