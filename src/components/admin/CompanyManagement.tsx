import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Company {
  id?: number;
  name: string;
  description: string;
  location: string;
  image: string;
  working_hours: string;
}

export function CompanyManagement() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [newCompany, setNewCompany] = useState<Omit<Company, 'id'>>({
    name: '',
    description: '',
    location: '',
    image: '',
    working_hours: ''
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCompanies(data || []);
    } catch (error) {
      console.error('Error fetching companies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('companies')
        .insert([newCompany])
        .select()
        .single();
      
      if (error) throw error;

      // Add the new company to the list
      if (data) {
        setCompanies([data, ...companies]);
      }

      // Reset the form
      setNewCompany({
        name: '',
        description: '',
        location: '',
        image: '',
        working_hours: ''
      });
    } catch (error) {
      console.error('Error adding company:', error);
    }
  };

  const handleDeleteCompany = async (id: number) => {
    try {
      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setCompanies(companies.filter(company => company.id !== id));
    } catch (error) {
      console.error('Error deleting company:', error);
    }
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Add New Company</h2>
        <form onSubmit={handleAddCompany} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Company Name
            </label>
            <input
              type="text"
              id="name"
              value={newCompany.name}
              onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              value={newCompany.description}
              onChange={(e) => setNewCompany({ ...newCompany, description: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows={3}
              required
            />
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <input
              type="text"
              id="location"
              value={newCompany.location}
              onChange={(e) => setNewCompany({ ...newCompany, location: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">
              Image URL
            </label>
            <input
              type="url"
              id="image"
              value={newCompany.image}
              onChange={(e) => setNewCompany({ ...newCompany, image: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="working_hours" className="block text-sm font-medium text-gray-700">
              Working Hours
            </label>
            <input
              type="text"
              id="working_hours"
              value={newCompany.working_hours}
              onChange={(e) => setNewCompany({ ...newCompany, working_hours: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="e.g., 9:00 AM to 5:00 PM, Monday to Friday"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Company
          </button>
        </form>
      </div>

      <div className="bg-white shadow-sm rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Existing Companies</h3>
          <div className="space-y-4">
            {companies.map((company) => (
              <div
                key={company.id}
                className="border rounded-lg p-4 flex items-start justify-between"
              >
                <div>
                  <h4 className="text-lg font-medium">{company.name}</h4>
                  <p className="text-gray-500 mt-1">{company.location}</p>
                  <p className="text-sm text-gray-600 mt-2">{company.description}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Working Hours: {company.working_hours}
                  </p>
                </div>
                <button
                  onClick={() => company.id && handleDeleteCompany(company.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
            {companies.length === 0 && (
              <p className="text-gray-500 text-center py-4">No companies added yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}