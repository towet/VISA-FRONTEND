import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface Company {
  id: number;
  name: string;
  description: string;
  location: string;
  image: string;
  workingHours: string;
}

interface UserDashboardProps {
  username: string;
  position: string;
  onLogout: () => void;
}

export function UserDashboard({ username, position, onLogout }: UserDashboardProps) {
  const [assignedCompanies, setAssignedCompanies] = useState<Company[]>([]);

  useEffect(() => {
    fetchAssignedCompanies();
  }, []);

  const fetchAssignedCompanies = async () => {
    // First get the user's data to get their assigned companies
    const { data: userData } = await supabase
      .from('users')
      .select('assigned_companies')
      .eq('username', username)
      .single();

    if (userData && userData.assigned_companies) {
      // Then fetch the companies data
      const { data: companiesData } = await supabase
        .from('companies')
        .select('*')
        .in('id', userData.assigned_companies);

      if (companiesData) {
        setAssignedCompanies(companiesData);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome, {username}!</h1>
              <p className="mt-1 text-sm text-gray-500">Position: {position}</p>
            </div>
            <button
              onClick={onLogout}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-green-50 border border-green-400 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-green-800 mb-2">
            Congratulations! 🎉
          </h2>
          <p className="text-green-700">
            You have been successfully selected to join these prestigious Canadian companies to work as {position}
          </p>
          <ul className="mt-4 text-green-700">
            <li>✓ Pre-approved positions</li>
            <li>✓ Sponsored work permit</li>
            <li>✓ Fast-track processing</li>
          </ul>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {assignedCompanies.map((company) => (
            <div
              key={company.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <div className="h-48 w-full overflow-hidden">
                <img
                  src={company.image}
                  alt={company.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {company.name}
                </h3>
                <p className="text-gray-600 mb-4">{company.description}</p>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Location:</span> {company.location}
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Working Hours:</span>{' '}
                    {company.workingHours}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
