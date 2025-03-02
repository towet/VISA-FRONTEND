import React from 'react';
import { FileText, Lock, ArrowRight } from 'lucide-react';

interface JoinModalProps {
  companyName: string;
  onApplyNow: () => void;
}

export function JoinModal({ companyName, onApplyNow }: JoinModalProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Join {companyName}</h2>
      </div>

      <div className="space-y-4">
        <p className="text-gray-600">
          To join this company, you need to finish your immigration and work permit processing. Complete your application now to secure your position.
        </p>

        <div className="bg-gray-50 p-4 rounded-lg space-y-3">
          <div className="flex items-start space-x-3">
            <Lock className="w-5 h-5 text-blue-500 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-medium text-gray-900">Secure Processing</h4>
              <p className="text-sm text-gray-500">Your personal information is protected by industry-standard encryption</p>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={onApplyNow}
        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-[1.02] flex items-center justify-center space-x-2"
      >
        <span>Apply Now</span>
        <ArrowRight className="w-5 h-5" />
      </button>

      <p className="text-center text-sm text-gray-500">
        Limited positions available. Don't miss this opportunity!
      </p>
    </div>
  );
}