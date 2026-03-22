'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import { recordsAPI, accessAPI } from '@/lib/api';

export default function PatientDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'records' | 'upload' | 'access' | 'verify'>('records');

  const { data: records, mutate: mutateRecords } = useSWR(
    user ? '/api/records' : null,
    () => recordsAPI.list()
  );

  const { data: accessRequests } = useSWR(
    user && activeTab === 'access' ? '/api/access-requests/pending' : null,
    () => accessAPI.getPendingRequests()
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
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-sora font-bold">My Health Records</h1>
          <p className="text-text-lightSecond dark:text-text-darkSecond mt-2">
            Manage and share your medical records securely
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-border-light dark:border-border-dark mb-6 overflow-x-auto">
          {(['records', 'upload', 'access', 'verify'] as const).map((tab) => (
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
          {activeTab === 'records' && (
            <div className="grid gap-4">
              {records?.data?.records?.length ? (
                records.data.records.map((record: any) => (
                  <div key={record.id} className="card">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{record.title}</h3>
                        <p className="text-sm text-text-lightSecond dark:text-text-darkSecond mt-1">
                          {record.description || 'No description'}
                        </p>
                        <p className="text-xs text-text-lightSecond dark:text-text-darkSecond mt-2">
                          Uploaded {new Date(record.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="px-3 py-1 bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400 text-xs rounded capitalize">
                        {record.fileType}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="card text-center py-12">
                  <p className="text-text-lightSecond dark:text-text-darkSecond">No records yet</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'upload' && (
            <div className="card">
              <h2 className="font-semibold mb-4">Upload New Record</h2>
              <form className="space-y-4" onSubmit={(e) => {
                e.preventDefault();
                // Handle upload
              }}>
                <div>
                  <label className="block text-sm font-medium mb-2">Record Title</label>
                  <input type="text" placeholder="e.g., Blood Test Report" className="w-full" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea placeholder="Additional details..." className="w-full" rows={3} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">File</label>
                  <input type="file" accept=".pdf,.jpg,.png" className="w-full" />
                </div>
                <button type="submit" className="btn btn-primary w-full">
                  Upload
                </button>
              </form>
            </div>
          )}

          {activeTab === 'access' && (
            <div className="grid gap-4">
              {accessRequests?.data?.requests?.length ? (
                accessRequests.data.requests.map((req: any) => (
                  <div key={req.id} className="card">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{req.doctorId}</h3>
                        <p className="text-sm text-text-lightSecond dark:text-text-darkSecond mt-1">
                          Reason: {req.reason || 'Not specified'}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button className="btn btn-primary text-sm">Approve</button>
                        <button className="btn btn-secondary text-sm">Deny</button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="card text-center py-12">
                  <p className="text-text-lightSecond dark:text-text-darkSecond">No pending requests</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'verify' && (
            <div className="card">
              <h2 className="font-semibold mb-4">Verify Record Integrity</h2>
              <p className="text-sm text-text-lightSecond dark:text-text-darkSecond mb-4">
                Verify that your records haven't been tampered with using blockchain anchoring.
              </p>
              <div className="space-y-2">
                {records?.data?.records?.map((record: any) => (
                  <button
                    key={record.id}
                    className="block w-full text-left card hover:border-brand-500"
                  >
                    {record.title}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
