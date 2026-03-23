'use client';

import React from 'react';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import { onboardingAPI } from '@/lib/api';

export default function OnboardingPendingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const { data: status } = useSWR(
    user ? '/api/onboarding/status' : null,
    () => onboardingAPI.status()
  );

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center h-screen">Loading...</div>
      </>
    );
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-bg-light dark:bg-bg-dark flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="card text-center">
            <div className="mb-4 text-5xl">⏳</div>
            <h1 className="text-2xl font-sora font-bold mb-2">Application Under Review</h1>

            {status?.data?.reviewStatus === 'pending' && (
              <>
                <p className="text-text-lightSecond dark:text-text-darkSecond mb-4">
                  Your doctor application is being reviewed by our verification team. This typically takes 24-48 hours.
                </p>
                <p className="text-sm text-text-lightSecond dark:text-text-darkSecond">
                  Submitted on{' '}
                  {status.data.submittedAt
                    ? new Date(status.data.submittedAt).toLocaleDateString()
                    : 'Recently'}
                </p>
              </>
            )}

            {status?.data?.reviewStatus === 'rejected' && (
              <>
                <p className="text-red-600 dark:text-red-400 mb-4">
                  Your application was not approved.
                </p>
                <p className="text-sm text-text-lightSecond dark:text-text-darkSecond mb-6">
                  Reason: {status.data.rejectionReason || 'No details provided'}
                </p>
                <button
                  onClick={() => router.push('/onboarding')}
                  className="btn btn-primary w-full"
                >
                  Resubmit Application
                </button>
              </>
            )}

            {status?.data?.reviewStatus === 'approved' && (
              <>
                <p className="text-green-600 dark:text-green-400 mb-4">
                  Your application has been approved!
                </p>
                <button
                  onClick={() => router.push('/doctor/dashboard')}
                  className="btn btn-primary w-full"
                >
                  Go to Dashboard
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
