import React from 'react';
import { MapPin, Clock, ArrowRight } from 'lucide-react';

interface CompanyCardProps {
  name: string;
  image: string;
  description: string;
  location: string;
  working_hours: string;
  onJoin?: () => void;
}

export function CompanyCard({ name, image, description, location, working_hours, onJoin }: CompanyCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all hover:shadow-xl hover:scale-[1.02]">
      <div className="relative">
        <img src={image} alt={name} className="w-full h-48 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <h3 className="absolute bottom-4 left-4 text-xl font-bold text-white">{name}</h3>
      </div>
      <div className="p-6">
        <p className="text-gray-600 mb-4">{description}</p>
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-gray-700">
            <MapPin className="w-5 h-5 text-blue-500" />
            <span>{location}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-700">
            <Clock className="w-5 h-5 text-blue-500" />
            <span className="text-sm text-gray-500">Working Hours:</span>
            <span>{working_hours}</span>
          </div>
        </div>
        <button
          onClick={onJoin}
          className="mt-6 w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-all flex items-center justify-center space-x-2 group"
        >
          <span>Join Company</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}