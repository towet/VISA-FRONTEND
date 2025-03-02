import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { WelcomeBanner } from './components/WelcomeBanner';
import { CompanyCard } from './components/CompanyCard';
import { Modal } from './components/Modal';
import { JoinModal } from './components/JoinModal';
import { WorkPermitModal } from './components/WorkPermitModal';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { supabase } from './lib/supabase';
import { initializeDatabase } from './lib/initSupabase';
import { UserCircle2 } from 'lucide-react';
import { UpcomingInterviewModal } from './components/UpcomingInterviewModal';
import { LoginPromptModal } from './components/LoginPromptModal';
import { Calendar, Users, Building2, GraduationCap, Clock, ArrowRight, Bell } from 'lucide-react';
import WhatsAppButton from './components/WhatsAppButton';

interface Company {
  id: number;
  name: string;
  description: string;
  location: string;
  image: string;
  working_hours: string;
}

interface User {
  id: string; // Changed from number to string for UUID
  username: string;
  full_name: string;
  email: string;
}

function App() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showWorkPermitModal, setShowWorkPermitModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [loginCredentials, setLoginCredentials] = useState({ username: '', password: '' });
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loginError, setLoginError] = useState('');
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
  const [isLoginPromptOpen, setIsLoginPromptOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Replace with your actual auth state

  useEffect(() => {
    initializeDatabase();
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchUserCompanies();
    } else {
      setCompanies([]);
      setIsLoading(false); // Set loading to false when there's no user
    }
  }, [currentUser]);

  const fetchUserCompanies = async () => {
    if (!currentUser) return;
    
    try {
      const { data: userCompanies, error: userCompaniesError } = await supabase
        .from('user_companies')
        .select('company_id')
        .eq('user_id', currentUser.id);

      if (userCompaniesError) throw userCompaniesError;

      const companyIds = userCompanies.map(uc => uc.company_id);

      const { data: companies, error: companiesError } = await supabase
        .from('companies')
        .select('*')
        .in('id', companyIds);

      if (companiesError) throw companiesError;
      setCompanies(companies || []);
    } catch (error) {
      console.error('Error fetching user companies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    try {
      const { data: users, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', loginCredentials.username)
        .eq('password', loginCredentials.password)
        .single();

      if (error) throw error;

      if (users) {
        setCurrentUser(users);
        setShowLoginModal(false);
        setLoginCredentials({ username: '', password: '' });
      } else {
        setLoginError('Invalid username or password');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setLoginError('Invalid username or password');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCompanies([]);
  };

  const handleJoin = (companyName: string) => {
    setSelectedCompany(companyName);
    setShowJoinModal(true);
  };

  const handleApplyNow = () => {
    setShowJoinModal(false);
    setShowWorkPermitModal(true);
  };

  const handleComplete = () => {
    setShowWorkPermitModal(false);
  };

  const handleInterviewClick = () => {
    // Always show the interview modal for testing
    setIsInterviewModalOpen(true);
  };

  const handleLoginPromptLogin = () => {
    // Implement your login logic here
    setIsLoginPromptOpen(false);
    // After successful login:
    // setIsLoggedIn(true);
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (loginCredentials.username === 'admin' && loginCredentials.password === 'admin') {
      setIsAdmin(true);
      setShowAdminModal(false);
      setIsLoggedIn(true);
      setCurrentUser({
        id: 'admin',
        username: 'admin',
        full_name: 'Administrator',
        email: 'admin@example.com'
      });
    } else {
      setLoginError('Invalid admin credentials');
    }
  };

  const handleLoginClick = () => {
    setShowAdminModal(true);
    setLoginCredentials({ username: '', password: '' });
  };

  if (isAdmin) {
    return <AdminDashboard onLogout={() => setIsAdmin(false)} />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center logo-container">
              <img 
                src="https://th.bing.com/th/id/R.14966e45f1061faf931e253192ec8c5b?rik=XXQbXorrx7d7Ug&pid=ImgRaw&r=0" 
                alt="Visa Expert Logo" 
                className="h-12 w-auto object-contain rounded-lg shadow-sm"
              />
            </div>
            
            <div className="flex items-center space-x-4">
              {/* My Interviews Button */}
              <button
                onClick={handleInterviewClick}
                className="relative inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors group"
              >
                <Calendar className="w-5 h-5 mr-2" />
                <span className="font-medium">My Interviews</span>
                {isLoggedIn && (
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    1
                  </span>
                )}
              </button>

              {/* Notifications */}
              <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
                <span className="sr-only">View notifications</span>
                <Bell className="w-6 h-6" />
                {isLoggedIn && (
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" />
                )}
              </button>

              {/* User menu */}
              <div className="relative">
                <button 
                  onClick={!isLoggedIn ? handleLoginClick : undefined}
                  className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
                >
                  <UserCircle2 className="w-8 h-8" />
                  <span className="hidden sm:block font-medium">
                    {isLoggedIn ? 'Admin Panel' : 'Admin'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <WelcomeBanner />

        {!currentUser ? (
          <div className="text-center mt-8">
            <button
              onClick={() => setShowLoginModal(true)}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Log in to View Available Opportunities
            </button>
          </div>
        ) : (
          <>
            <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">Congratulations on Your Qualification! 🎉</h2>
              <p className="text-lg text-gray-600">
                You have qualified to join these prestigious Canadian companies. Select which company you would prefer to work for and click "Join" to proceed with your application.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {companies.map((company) => (
                <CompanyCard
                  key={company.id}
                  {...company}
                  onJoin={() => handleJoin(company.name)}
                />
              ))}
              {companies.length === 0 && (
                <div className="col-span-3 text-center py-12">
                  <p className="text-gray-500">
                    You don't have any companies assigned to you yet.
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </main>

      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Your Gateway to Canadian Employment
            </h1>
            <p className="text-xl text-gray-600">
              Fast-track your career with our comprehensive work permit and interview services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Work Permit Card */}
            <div 
              onClick={() => setShowWorkPermitModal(true)}
              className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transform transition-all hover:scale-[1.02] hover:shadow-xl"
            >
              <div className="p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Work Permit</h3>
                <p className="text-gray-600 mb-4">
                  Secure your Canadian work permit with our streamlined application process
                </p>
                <div className="flex items-center text-blue-600">
                  <span className="font-medium">Apply Now</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </div>
              </div>
            </div>

            {/* Upcoming Interview Card */}
            <div 
              onClick={() => setIsInterviewModalOpen(true)}
              className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transform transition-all hover:scale-[1.02] hover:shadow-xl"
            >
              <div className="p-6">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Upcoming Interview</h3>
                <p className="text-gray-600 mb-4">
                  View and confirm your upcoming interview with company supervisors
                </p>
                <div className="flex items-center text-green-600">
                  <span className="font-medium">View Details</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </div>
              </div>
            </div>

            {/* Additional Services Card */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <GraduationCap className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Additional Services</h3>
                <p className="text-gray-600 mb-4">
                  Explore our range of support services for a smooth transition
                </p>
                <div className="flex items-center text-purple-600">
                  <span className="font-medium">Learn More</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </div>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex items-start space-x-4">
              <Clock className="w-6 h-6 text-blue-600 flex-shrink-0" />
              <div>
                <h4 className="text-lg font-semibold text-gray-900">Fast Processing</h4>
                <p className="text-gray-600">Quick turnaround time for all applications</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <Users className="w-6 h-6 text-blue-600 flex-shrink-0" />
              <div>
                <h4 className="text-lg font-semibold text-gray-900">Direct Interviews</h4>
                <p className="text-gray-600">Connect directly with potential employers</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <Building2 className="w-6 h-6 text-blue-600 flex-shrink-0" />
              <div>
                <h4 className="text-lg font-semibold text-gray-900">Full Support</h4>
                <p className="text-gray-600">Comprehensive guidance throughout the process</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <WhatsAppButton />
      <Modal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)}>
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Login to View Opportunities</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={loginCredentials.username}
                onChange={(e) => setLoginCredentials({ ...loginCredentials, username: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={loginCredentials.password}
                onChange={(e) => setLoginCredentials({ ...loginCredentials, password: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            {loginError && (
              <p className="text-sm text-red-600">{loginError}</p>
            )}
            <button
              type="submit"
              className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
            >
              Login
            </button>
          </form>
        </div>
      </Modal>

      <Modal isOpen={showAdminModal} onClose={() => setShowAdminModal(false)}>
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={loginCredentials.username}
                onChange={(e) => setLoginCredentials({ ...loginCredentials, username: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={loginCredentials.password}
                onChange={(e) => setLoginCredentials({ ...loginCredentials, password: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            {loginError && (
              <p className="text-red-500 text-sm">{loginError}</p>
            )}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Login
            </button>
          </form>
        </div>
      </Modal>

      <Modal isOpen={showJoinModal} onClose={() => setShowJoinModal(false)}>
        <JoinModal
          companyName={selectedCompany || ''}
          onApplyNow={handleApplyNow}
        />
      </Modal>

      <Modal isOpen={showWorkPermitModal} onClose={() => setShowWorkPermitModal(false)}>
        <WorkPermitModal onComplete={handleComplete} />
      </Modal>

      <Modal isOpen={isInterviewModalOpen} onClose={() => setIsInterviewModalOpen(false)}>
        <UpcomingInterviewModal onClose={() => setIsInterviewModalOpen(false)} />
      </Modal>

      <Modal isOpen={isLoginPromptOpen} onClose={() => setIsLoginPromptOpen(false)}>
        <LoginPromptModal 
          onClose={() => setIsLoginPromptOpen(false)}
          onLogin={handleLoginPromptLogin}
        />
      </Modal>
    </div>
  );
}

export default App;