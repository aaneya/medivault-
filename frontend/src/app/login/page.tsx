'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/Navbar';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [step, setStep] = useState<'credentials' | 'otp'>('credentials');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [role, setRole] = useState<'patient' | 'doctor' | 'admin'>('patient');
  
  const { login } = useAuth();
  const router = useRouter();

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (role === 'patient' && !phone) {
        setError('Phone number required for patients');
        setLoading(false);
        return;
      }
      
      if ((role === 'doctor' || role === 'admin') && (!email || !password)) {
        setError('Email and password required');
        setLoading(false);
        return;
      }

      // For patients: phone-based OTP
      if (role === 'patient') {
        // TODO: Send OTP to phone
        setStep('otp');
      } else {
        // For doctors/admins: Email + password
        await login(email, password);
        router.push(`/${role}/dashboard`);
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
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
            <h1 className="text-2xl font-sora font-bold mb-2">MediVault</h1>
            <p className="text-text-lightSecond dark:text-text-darkSecond mb-6">
              Secure access to your medical records
            </p>

            {error && (
              <div className="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-3 rounded mb-4">
                {error}
              </div>
            )}

            {step === 'credentials' && (
              <form onSubmit={handleCredentialsSubmit} className="space-y-4">
                {/* Role selector */}
                <div>
                  <label className="block text-sm font-medium mb-2">Account Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['patient', 'doctor', 'admin'] as const).map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => {
                          setRole(r);
                          setEmail('');
                          setPassword('');
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

                {/* Phone for patient */}
                {role === 'patient' && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="+91 XXXXXXXXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="w-full"
                    />
                  </div>
                )}

                {/* Email for doctor/admin */}
                {(role === 'doctor' || role === 'admin') && (
                  <>
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
                    <div>
                      <label className="block text-sm font-medium mb-2">Password</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full"
                      />
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary w-full"
                >
                  {loading ? 'Signing in...' : 'Continue'}
                </button>
              </form>
            )}

            {step === 'otp' && (
              <div className="space-y-4">
                <p className="text-sm text-text-lightSecond dark:text-text-darkSecond">
                  Enter the 6-digit OTP sent to {phone}
                </p>
                <div className="flex gap-2 justify-center">
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <input
                      key={i}
                      type="text"
                      maxLength={1}
                      className="w-12 h-12 text-center text-2xl border border-border-light dark:border-border-dark rounded-lg"
                    />
                  ))}
                </div>
                <button
                  onClick={() => setStep('credentials')}
                  className="btn btn-secondary w-full"
                >
                  Back
                </button>
              </div>
            )}

            <div className="mt-6 text-center text-sm">
              <span className="text-text-lightSecond dark:text-text-darkSecond">
                Don't have an account?{' '}
              </span>
              <Link href="/register" className="text-brand-500 hover:underline font-medium">
                Register
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
