import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { initializeDatabase } from '../../lib/initSupabase';

interface User {
  id: string;
  username: string;
  password: string;
  email: string;
  full_name: string;
  companies?: Company[];
}

interface Company {
  id: number;
  name: string;
  description: string;
  location: string;
  working_hours: string;
  image: string;
}

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [newUser, setNewUser] = useState<Omit<User, 'id'>>({
    username: '',
    password: '',
    email: '',
    full_name: '',
  });
  const [selectedCompanies, setSelectedCompanies] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      try {
        await initializeDatabase();
        await Promise.all([fetchUsers(), fetchCompanies()]);
      } catch (error) {
        console.error('Error during initialization:', error);
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);

  const getNextNumber = (users: User[]) => {
    const emailPattern = /canadavisaexpert(\d+)@gmail\.com/;
    let maxEmailNum = 1;

    users.forEach(user => {
      const emailMatch = user.email.match(emailPattern);
      if (emailMatch) {
        const num = parseInt(emailMatch[1]);
        maxEmailNum = Math.max(maxEmailNum, num + 1);
      }
    });

    return maxEmailNum;
  };

  const fetchUsers = async () => {
    try {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select(`
          *,
          user_companies (
            company_id
          ),
          companies:user_companies(
            companies(*)
          )
        `);

      if (userError) throw userError;

      const transformedUsers = userData?.map(user => ({
        ...user,
        companies: user.companies?.map((c: any) => c.companies) || []
      })) || [];

      setUsers(transformedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchCompanies = async () => {
    try {
      console.log('Fetching companies...');
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching companies:', error);
        throw error;
      }
      
      console.log('Companies fetched:', data);
      setCompanies(data || []);
    } catch (error) {
      console.error('Error in fetchCompanies:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUser(prev => ({ ...prev, [name]: value }));
  };

  const handleCompanySelection = (companyId: number) => {
    setSelectedCompanies(prev => {
      if (prev.includes(companyId)) {
        return prev.filter(id => id !== companyId);
      } else {
        return [...prev, companyId];
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!newUser.username) {
        alert('Username is required');
        return;
      }

      const nextNum = getNextNumber(users);
      
      const userToCreate = {
        ...newUser,
        email: `canadavisaexpert${nextNum}@gmail.com`,
        full_name: `Canada Visa Expert ${nextNum}`
      };

      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert([userToCreate])
        .select()
        .single();

      if (userError) throw userError;

      if (selectedCompanies.length > 0 && userData) {
        const userCompanyRelations = selectedCompanies.map(companyId => ({
          user_id: userData.id,
          company_id: companyId
        }));

        const { error: relationError } = await supabase
          .from('user_companies')
          .insert(userCompanyRelations);

        if (relationError) throw relationError;
      }

      await fetchUsers();

      setNewUser({
        username: '',
        password: '',
        email: '',
        full_name: '',
      });
      setSelectedCompanies([]);

    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const { error: relationError } = await supabase
        .from('user_companies')
        .delete()
        .eq('user_id', userId);

      if (relationError) throw relationError;

      const { error: userError } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (userError) throw userError;

      await fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">User Management</h2>
      
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={newUser.username}
              onChange={handleInputChange}
              placeholder="Enter username"
              className="border p-2 rounded w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={newUser.password}
              onChange={handleInputChange}
              placeholder="Password"
              className="border p-2 rounded w-full"
              required
            />
          </div>
        </div>

        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Assign Companies</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {companies.map(company => (
              <label key={company.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedCompanies.includes(company.id)}
                  onChange={() => handleCompanySelection(company.id)}
                  className="form-checkbox"
                />
                <span>{company.name}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </button>
      </form>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Users</h3>
        <div className="grid gap-4">
          {users.map(user => (
            <div key={user.id} className="border p-4 rounded shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold">{user.username}</h4>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <p className="text-sm text-gray-600">{user.full_name}</p>
                  <div className="mt-2">
                    <p className="text-sm font-medium">Assigned Companies:</p>
                    <ul className="text-sm text-gray-600 ml-4 list-disc">
                      {user.companies && user.companies.length > 0 ? (
                        user.companies.map((company: Company) => (
                          <li key={company.id}>{company.name}</li>
                        ))
                      ) : (
                        <li>No companies assigned</li>
                      )}
                    </ul>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteUser(user.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}