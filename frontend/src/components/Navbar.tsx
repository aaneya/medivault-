'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export const Navbar: React.FC = () => {
  const { user, logout, role } = useAuth();
  const [isDark, setIsDark] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const toggleDarkMode = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <nav className="bg-bg-light dark:bg-bg-darkSecond border-b border-border-light dark:border-border-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">M</span>
            </div>
            <span className="font-sora font-bold text-lg hidden sm:inline">MediVault</span>
          </Link>

          <div className="flex items-center gap-4">
            {user && (
              <>
                <span className="text-sm text-text-lightSecond dark:text-text-darkSecond hidden sm:inline">
                  {user.email}
                </span>
                <button
                  onClick={toggleDarkMode}
                  className="dark-toggle"
                  aria-label="Toggle dark mode"
                >
                  {isDark ? '☀️' : '🌙'}
                </button>
                <button
                  onClick={() => logout()}
                  className="btn btn-secondary text-sm"
                >
                  Logout
                </button>
              </>
            )}
            {!user && (
              <Link href="/login" className="btn btn-primary text-sm">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
