import React from 'react';
import { CheckCircle, Award, Clock, Briefcase, MapPin, UserCheck } from 'lucide-react';

export function WelcomeBanner() {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-lg mb-8">
      <div className="flex items-start space-x-3 mb-6">
        <Award className="w-8 h-8 text-yellow-300" />
        <div>
          <h2 className="text-2xl font-semibold mb-2">Congratulations! 🎉</h2>
          <p className="text-blue-100">
            You have been successfully selected to join these prestigious Canadian companies.
          </p>
        </div>
      </div>

      <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm mb-6">
        <h3 className="text-lg font-semibold mb-3 text-yellow-300 flex items-center">
          <Award className="w-5 h-5 mr-2" />
          After completion you are guaranteed:
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start space-x-3">
            <Briefcase className="w-5 h-5 text-blue-200 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-medium">Canadian Work Permit</h4>
              <p className="text-sm text-blue-100">Valid for up to 3 years</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-blue-200 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-medium">Certificate of Permanent Residency</h4>
              <p className="text-sm text-blue-100">Fast-track processing</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <MapPin className="w-5 h-5 text-blue-200 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-medium">Sponsored Benefits</h4>
              <p className="text-sm text-blue-100">Travel, accommodation & visa</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <UserCheck className="w-5 h-5 text-blue-200 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-medium">Direct Interview</h4>
              <p className="text-sm text-blue-100">With company supervisor</p>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center text-sm">
        <div className="inline-flex items-center space-x-2 bg-red-800/90 px-6 py-3 rounded-full shadow-md border border-red-700/50">
          <CheckCircle className="w-5 h-5 text-white/90" />
          <span className="text-white/90 font-medium">Government Approved Program</span>
        </div>
      </div>
    </div>
  );
}