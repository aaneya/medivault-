'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import { adminAPI } from '@/lib/api';

export default function AdminDashboard() {
  const { user, role, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'hospitals' | 'doctors' | 'platform'>('doctors');
  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const { data: pendingOnboarding, mutate: mutatePending } = useSWR(
    user && activeTab === 'doctors' ? '/api/admin/onboarding/pending' : null,
    () => adminAPI.getPendingOnboarding()
  );

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center h-screen">Loading...</div>
      </>
    );
  }

  if (!user || role !== 'admin') {
    router.push('/login');
    return null;
  }

  const handleApprove = async (uid: string) => {
    try {
      await adminAPI.reviewOnboarding(uid, 'approve');
      mutatePending();
      setReviewingId(null);
    } catch (error) {
      console.error('Approval failed:', error);
    }
  };

  const handleReject = async (uid: string) => {
    try {
      await adminAPI.reviewOnboarding(uid, 'reject', rejectionReason);
      mutatePending();
      setReviewingId(null);
      setRejectionReason('');
    } catch (error) {
      console.error('Rejection failed:', error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-sora font-bold">Admin Dashboard</h1>
          <p className="text-text-lightSecond dark:text-text-darkSecond mt-2">
            Manage platform, doctors, and hospitals
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-border-light dark:border-border-dark mb-6">
          {(['hospitals', 'doctors', 'platform'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 font-medium capitalize border-b-2 transition ${
                activeTab === tab
                  ? 'border-brand-500 text-brand-500'
                  : 'border-transparent text-text-lightSecond dark:text-text-darkSecond'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div>
          {activeTab === 'doctors' && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Pending Doctor Onboarding</h2>
              {pendingOnboarding?.data?.submissions?.length ? (
                pendingOnboarding.data.submissions.map((submission: any) => (
                  <div key={submission.uid} className="card">
                    {reviewingId !== submission.uid ? (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-text-lightSecond dark:text-text-darkSecond">Name</p>
                            <p className="font-semibold">{submission.fullName}</p>
                          </div>
                          <div>
                            <p className="text-sm text-text-lightSecond dark:text-text-darkSecond">License</p>
                            <p className="font-semibold">{submission.licenseNumber}</p>
                          </div>
                          <div>
                            <p className="text-sm text-text-lightSecond dark:text-text-darkSecond">Specialty</p>
                            <p className="font-semibold">{submission.specialty}</p>
                          </div>
                          <div>
                            <p className="text-sm text-text-lightSecond dark:text-text-darkSecond">Hospital</p>
                            <p className="font-semibold">{submission.hospital}</p>
                          </div>
                        </div>

                        <div className="space-y-2 mb-4">
                          {submission.licenseDocRef_url && (
                            <a
                              href={submission.licenseDocRef_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-brand-500 hover:underline text-sm"
                            >
                              📄 View License Document
                            </a>
                          )}
                          {submission.idDocRef_url && (
                            <a
                              href={submission.idDocRef_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-brand-500 hover:underline text-sm block"
                            >
                              📄 View ID Document
                            </a>
                          )}
                          {submission.selfieRef_url && (
                            <a
                              href={submission.selfieRef_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-brand-500 hover:underline text-sm block"
                            >
                              📸 View Selfie
                            </a>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => setReviewingId(submission.uid)}
                            className="btn btn-primary flex-1"
                          >
                            Review
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="space-y-4">
                        <p className="font-semibold">{submission.fullName}</p>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Rejection Reason (if rejecting)
                          </label>
                          <textarea
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="Leave empty to approve"
                            className="w-full"
                            rows={3}
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApprove(submission.uid)}
                            className="btn btn-primary flex-1"
                            disabled={!!rejectionReason}
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(submission.uid)}
                            className="btn btn-secondary flex-1"
                            disabled={!rejectionReason}
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => {
                              setReviewingId(null);
                              setRejectionReason('');
                            }}
                            className="btn btn-ghost flex-1"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="card text-center py-12">
                  <p className="text-text-lightSecond dark:text-text-darkSecond">
                    No pending doctor applications
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'hospitals' && (
            <div className="card text-center py-12">
              <p className="text-text-lightSecond dark:text-text-darkSecond">Hospital management coming soon</p>
            </div>
          )}

          {activeTab === 'platform' && (
            <div className="card space-y-4">
              <h2 className="font-semibold">Platform Statistics</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Total Users', value: '0' },
                  { label: 'Active Doctors', value: '0' },
                  { label: 'Medical Records', value: '0' },
                  { label: 'Verified Records', value: '0' },
                ].map((stat) => (
                  <div key={stat.label} className="bg-brand-50 dark:bg-brand-900/20 p-4 rounded">
                    <p className="text-xs text-text-lightSecond dark:text-text-darkSecond">{stat.label}</p>
                    <p className="text-2xl font-bold text-brand-600 dark:text-brand-400 mt-2">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
