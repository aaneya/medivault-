'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/Navbar';
import { authAPI } from '@/lib/api';
import Link from 'next/link';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'patient' | 'doctor'>('patient');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (role === 'doctor' && !email) {
        setError('Email required for doctors');
        setLoading(false);
        return;
      }

      if (!password || password.length < 6) {
        setError('Password must be at least 6 characters');
        setLoading(false);
        return;
      }

      // Register with Firebase
      await register(email || phone, password);

      // Create user record via API
      await authAPI.register({
        email: email || phone,
        password,
        role,
        displayName: email || phone,
      });

      if (role === 'doctor') {
        router.push('/onboarding');
      } else {
        router.push('/patient/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-bg-light dark:bg-bg-dark flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="card">
            <h1 className="text-2xl font-sora font-bold mb-2">Create Account</h1>
            <p className="text-text-lightSecond dark:text-text-darkSecond mb-6">
              Join MediVault to manage your medical records
            </p>

            {error && (
              <div className="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-3 rounded mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Role selector */}
              <div>
                <label className="block text-sm font-medium mb-2">Account Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['patient', 'doctor'] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => {
                        setRole(r);
                        setEmail('');
                        setPhone('');
                      }}
                      className={`py-2 px-3 rounded-md border text-sm font-medium capitalize transition ${
                        role === r
                          ? 'bg-brand-500 text-white border-brand-500'
                          : 'bg-bg-light dark:bg-bg-darkSecond border-border-light dark:border-border-dark'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Email for doctor */}
              {role === 'doctor' && (
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full"
                  />
                </div>
              )}

              {/* Phone for patient */}
              {role === 'patient' && (
                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+91 XXXXXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full"
                  />
                </div>
              )}

              {/* Password */}
              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <input
                  type="password"
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full"
              >
                {loading ? 'Creating account...' : 'Register'}
              </button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-text-lightSecond dark:text-text-darkSecond">
                Already have an account?{' '}
              </span>
              <Link href="/login" className="text-brand-500 hover:underline font-medium">
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
