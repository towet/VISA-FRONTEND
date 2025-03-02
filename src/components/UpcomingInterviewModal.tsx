import React, { useState } from 'react';
import { Calendar, CheckCircle, Clock, Users, DollarSign } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

interface UpcomingInterviewModalProps {
  onClose: () => void;
}

export function UpcomingInterviewModal({ onClose }: UpcomingInterviewModalProps) {
  const [step, setStep] = useState<'confirm' | 'date' | 'payment' | 'complete'>('confirm');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [transactionMessage, setTransactionMessage] = useState('');

  const handleDateConfirm = () => {
    if (selectedDate) {
      setStep('payment');
    }
  };

  const handlePaymentSubmit = () => {
    if (transactionMessage.trim()) {
      setStep('complete');
    }
  };

  return (
    <div className="p-6">
      {/* Progress Bar */}
      <div className="flex justify-between items-center mb-8">
        <div className="w-full bg-gray-200 h-1 absolute left-0 top-0">
          <div 
            className="h-full bg-blue-600 transition-all duration-300"
            style={{ 
              width: 
                step === 'confirm' ? '25%' : 
                step === 'date' ? '50%' :
                step === 'payment' ? '75%' : '100%' 
            }}
          />
        </div>
        <div className="flex justify-between w-full mt-6">
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'confirm' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
              <Users className="w-4 h-4" />
            </div>
            <span className="text-xs mt-1">Confirm</span>
          </div>
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'date' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
              <Calendar className="w-4 h-4" />
            </div>
            <span className="text-xs mt-1">Date</span>
          </div>
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'payment' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
              <DollarSign className="w-4 h-4" />
            </div>
            <span className="text-xs mt-1">Payment</span>
          </div>
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'complete' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
              <CheckCircle className="w-4 h-4" />
            </div>
            <span className="text-xs mt-1">Complete</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Calendar className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Upcoming Interview</h2>
        <p className="text-gray-600">Schedule your interview with company supervisors</p>
      </div>

      {step === 'confirm' && (
        <div>
          {/* Interview Details Card */}
          <div className="bg-blue-50 rounded-lg p-6 mb-6">
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Company Interview Details</h3>
                <p className="text-gray-600 mt-1">
                  Confirm your application to proceed with scheduling your interview with our Canadian company supervisors.
                </p>
              </div>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 border border-gray-200 flex items-center">
              <Users className="w-5 h-5 text-blue-600 mr-3" />
              <span className="text-sm">Direct Supervisor Interview</span>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200 flex items-center">
              <Clock className="w-5 h-5 text-blue-600 mr-3" />
              <span className="text-sm">Flexible Scheduling</span>
            </div>
          </div>

          <button
            onClick={() => setStep('date')}
            className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
          >
            <span>Continue to Schedule</span>
            <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}

      {step === 'date' && (
        <div className="space-y-4">
          <div className="bg-green-50 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Calendar className="w-6 h-6 text-green-600 mr-3" />
              <h3 className="text-lg font-semibold">Select Preferred Date</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Choose your preferred interview date. Our team will confirm the exact time based on supervisor availability.
            </p>
            <div className="bg-white rounded-lg shadow p-4">
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                minDate={new Date()}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholderText="Select a date"
                dateFormat="MMMM d, yyyy"
              />
            </div>
          </div>
          <button
            onClick={handleDateConfirm}
            disabled={!selectedDate}
            className={`w-full bg-gradient-to-r from-green-400 to-blue-500 text-white py-3 rounded-lg mt-4 flex items-center justify-center ${!selectedDate ? 'opacity-50 cursor-not-allowed' : 'hover:from-green-500 hover:to-blue-600'}`}
          >
            <Calendar className="w-5 h-5 mr-2" />
            Confirm Date
          </button>
        </div>
      )}

      {step === 'payment' && (
        <div className="space-y-4">
          <div className="bg-yellow-50 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <DollarSign className="w-6 h-6 text-yellow-600 mr-3" />
              <h3 className="text-lg font-semibold">Payment Verification</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Please paste your transaction message as proof of payment. This helps us verify your payment quickly.
            </p>
            <textarea
              value={transactionMessage}
              onChange={(e) => setTransactionMessage(e.target.value)}
              placeholder="Paste your transaction message here..."
              className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
            />
          </div>
          <button
            onClick={handlePaymentSubmit}
            disabled={!transactionMessage.trim()}
            className={`w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-white py-3 rounded-lg mt-4 flex items-center justify-center ${!transactionMessage.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:from-yellow-500 hover:to-yellow-600'}`}
          >
            <DollarSign className="w-5 h-5 mr-2" />
            Submit Payment Proof
          </button>
        </div>
      )}

      {step === 'complete' && (
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Thank You!</h3>
          <div className="bg-green-50 rounded-lg p-6 text-left">
            <p className="text-gray-700 mb-4">
              Your interview request has been submitted successfully. Our team will:
            </p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                Verify your payment within 2 hours
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                Send you detailed instructions for the next steps
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                Confirm your selected interview date and time
              </li>
            </ul>
          </div>
          <button
            onClick={onClose}
            className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg mt-4 hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
