import React, { useState, useEffect } from 'react';
import { Shield, Plane, FileCheck, ArrowRight, Users } from 'lucide-react';
import axios from 'axios';

interface WorkPermitModalProps {
  onComplete: () => void;
}

interface ExchangeRates {
  [key: string]: number;
}

const currencies = [
  // Most Used
  { code: 'USD', name: 'US Dollar' },
  { code: 'EUR', name: 'Euro' },
  { code: 'GBP', name: 'British Pound' },
  
  // Africa
  { code: 'KES', name: 'Kenyan Shilling' },
  { code: 'NGN', name: 'Nigerian Naira' },
  { code: 'ZAR', name: 'South African Rand' },
  { code: 'UGX', name: 'Ugandan Shilling' },
  { code: 'TZS', name: 'Tanzanian Shilling' },
  { code: 'GHS', name: 'Ghanaian Cedi' },
  { code: 'EGP', name: 'Egyptian Pound' },
  
  // Americas
  { code: 'CAD', name: 'Canadian Dollar' },
  
  // Europe
  { code: 'CHF', name: 'Swiss Franc' },
  
  // Asia
  { code: 'JPY', name: 'Japanese Yen' },
  { code: 'CNY', name: 'Chinese Yuan' },
  { code: 'INR', name: 'Indian Rupee' },
  { code: 'SGD', name: 'Singapore Dollar' },
  
  // Middle East
  { code: 'AED', name: 'UAE Dirham' },
  { code: 'SAR', name: 'Saudi Riyal' },
  
  // Oceania
  { code: 'AUD', name: 'Australian Dollar' },
  { code: 'NZD', name: 'New Zealand Dollar' }
];

// Get the API URL from environment or default to the new API URL (removed trailing slash)
const API_URL = import.meta.env.VITE_API_URL || 'https://visa-api.netlify.app';

export function WorkPermitModal({ onComplete }: WorkPermitModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const baseAmount = 7; // Base amount in USD

  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const response = await axios.get(
          `https://api.exchangerate-api.com/v4/latest/USD`
        );
        // setExchangeRates(response.data.rates);
      } catch (err) {
        console.error('Error fetching exchange rates:', err);
      }
    };

    fetchExchangeRates();
  }, []);

  const convertAmount = (amount: number, targetCurrency: string): string => {
    return `${amount} USD`;
  };

  const handlePayment = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get token
      console.log('Getting token...');
      const tokenResponse = await axios.get(`${API_URL}/api/get-token`);
      const tokenData = tokenResponse.data;
      
      if (!tokenData.token) {
        throw new Error('Failed to get token');
      }

      console.log('Token received:', tokenData);

      // Submit order
      const orderData = {
        id: `visa_expert_${Date.now()}`,
        currency: selectedCurrency,
        amount: baseAmount,
        description: 'Work Permit Application Fee',
        callback_url: 'https://visa-api.netlify.app/api/ipn',
        notification_id: '',
        branch: 'Visa Expert',
        billing_address: {
          email_address: 'customer@example.com',
          phone_number: '0700000000',
          country_code: 'KE',
          first_name: 'Customer',
          middle_name: '',
          last_name: 'Name',
          line_1: 'Nairobi',
          line_2: '',
          city: 'Nairobi',
          state: '',
          postal_code: '',
          zip_code: '',
        },
      };

      console.log('Submitting order with data:', orderData);

      const submitResponse = await axios.post(`${API_URL}/api/submit-order`, {
        token: tokenData.token,
        orderData,
      });

      const submitData = submitResponse.data;
      console.log('Order submitted successfully:', submitData);

      if (submitData.order_tracking_id) {
        const redirectUrl = `https://pay.pesapal.com/iframe/PesapalIframe3/Index?OrderTrackingId=${submitData.order_tracking_id}`;
        console.log('Redirecting to:', redirectUrl);
        window.location.href = redirectUrl;
      } else {
        throw new Error('No order tracking ID received');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Payment failed';
      setError(errorMessage);
      console.error('Payment error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-h-[90vh] overflow-y-auto px-4 sm:px-6">
      {/* Header Section */}
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Process Work Permit</h2>
        <p className="text-gray-500 mt-2">Your gateway to working in Canada</p>
      </div>

      {/* Currency Selection and Fee Section */}
      <div className="bg-blue-50 p-6 rounded-lg shadow-sm">
        <div className="flex flex-col space-y-4">
          {/* Currency Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <label className="text-sm font-medium text-gray-700">
              Select your preferred currency:
            </label>
            <select
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
              className="w-full sm:w-auto p-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white hover:bg-gray-50 transition-colors duration-200"
            >
              {currencies.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.code} - {currency.name}
                </option>
              ))}
            </select>
          </div>

          {/* Fee Display */}
          <div className="mt-4 p-4 bg-white rounded-lg border border-blue-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Processing Fee</h3>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <p className="text-2xl font-bold text-blue-600">
                {selectedCurrency === 'USD' ? `$${baseAmount}` : `${baseAmount}`} {selectedCurrency}
              </p>
              <span className="text-sm text-gray-500">Fully refundable</span>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors duration-200">
          <div className="flex items-start space-x-3">
            <FileCheck className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900">Work Permit</h3>
              <p className="text-sm text-gray-600">Valid for up to 3 years</p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors duration-200">
          <div className="flex items-start space-x-3">
            <Shield className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900">Permanent Residency</h3>
              <p className="text-sm text-gray-600">Certificate of PR included</p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors duration-200">
          <div className="flex items-start space-x-3">
            <Plane className="w-6 h-6 text-purple-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900">Travel Support</h3>
              <p className="text-sm text-gray-600">Sponsored visa & accommodation</p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors duration-200">
          <div className="flex items-start space-x-3">
            <Users className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900">Direct Interview</h3>
              <p className="text-sm text-gray-600">With company employers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Process Steps */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-4">How it works:</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm">1</div>
            <p className="text-sm text-gray-600">Select your preferred currency</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm">2</div>
            <p className="text-sm text-gray-600">Process payment using secure gateway</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm">3</div>
            <p className="text-sm text-gray-600">Receive confirmation and next steps via email</p>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-6">
        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <span>Process Application</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
}
