import React from 'react';
import { X, LogIn, Building2, Calendar } from 'lucide-react';

interface LoginPromptModalProps {
  onClose: () => void;
  onLogin: () => void;
}

export function LoginPromptModal({ onClose, onLogin }: LoginPromptModalProps) {
  return (
    <div className="p-4 sm:p-6 max-w-lg w-full bg-white rounded-2xl shadow-xl overflow-y-auto max-h-[90vh]">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Schedule Your Interview</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-500 transition-colors p-2"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      {/* Content */}
      <div className="space-y-4 sm:space-y-6">
        {/* Steps */}
        <div className="bg-blue-50 p-4 sm:p-6 rounded-xl space-y-4">
          <h3 className="text-base sm:text-lg font-semibold text-blue-900 flex items-center">
            <span className="bg-blue-100 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-blue-600 mr-2 sm:mr-3 flex-shrink-0">
              1
            </span>
            <span>Login or Create Account</span>
          </h3>
          <div className="ml-8 sm:ml-11 space-y-2">
            <p className="text-sm sm:text-base text-blue-800">First, you'll need to login or create a new account to proceed.</p>
            <button
              onClick={onLogin}
              className="flex items-center space-x-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm sm:text-base"
            >
              <LogIn className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Login Now</span>
            </button>
          </div>
        </div>

        <div className="bg-gray-50 p-4 sm:p-6 rounded-xl space-y-4">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
            <span className="bg-gray-200 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-gray-600 mr-2 sm:mr-3 flex-shrink-0">
              2
            </span>
            <span>Select Company & Apply</span>
          </h3>
          <div className="ml-8 sm:ml-11">
            <p className="text-sm sm:text-base text-gray-600">Browse available companies and submit your application.</p>
          </div>
        </div>

        <div className="bg-gray-50 p-4 sm:p-6 rounded-xl space-y-4">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
            <span className="bg-gray-200 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-gray-600 mr-2 sm:mr-3 flex-shrink-0">
              3
            </span>
            <span>Schedule Interview</span>
          </h3>
          <div className="ml-8 sm:ml-11">
            <p className="text-sm sm:text-base text-gray-600">Choose your preferred interview date and complete the process.</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500">
            <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Interview scheduling made easy</span>
          </div>
          <button
            onClick={onLogin}
            className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base"
          >
            <LogIn className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Get Started</span>
          </button>
        </div>
      </div>
    </div>
  );
}
