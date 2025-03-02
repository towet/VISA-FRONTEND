import React from 'react';
import { Bell, User } from 'lucide-react';

interface HeaderProps {
  userName: string;
  isLoggedIn?: boolean;
  onLogout?: () => void;
  onLogin?: () => void;
}

export function Header({ userName, isLoggedIn, onLogout, onLogin }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="text-blue-600" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome, {userName}</h1>
              <p className="text-sm text-gray-500">Your Canadian dream awaits!</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">2</span>
              <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <Bell className="text-gray-600" />
              </button>
            </div>
            {isLoggedIn ? (
              <button
                onClick={onLogout}
                className="bg-red-800/90 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={onLogin}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}