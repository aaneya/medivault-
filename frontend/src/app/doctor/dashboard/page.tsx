'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import { accessAPI, recordsAPI } from '@/lib/api';

export default function DoctorDashboard() {
  const { user, role, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'patients' | 'requests' | 'upload' | 'activity'>('patients');
  const [searchPatientId, setSearchPatientId] = useState('');

  const { data: requests } = useSWR(
    user && activeTab === 'requests' ? '/api/access/requests/mine' : null,
    () => accessAPI.getMyRequests()
  );

  const { data: auditLogs } = useSWR(
    user && activeTab === 'activity' ? '/api/audit/mine' : null,
    () => accessAPI.getMyRequests()
  );

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center h-screen">Loading...</div>
      </>
    );
  }

  if (!user || role !== 'doctor') {
    router.push('/login');
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-sora font-bold">Doctor Portal</h1>
          <p className="text-text-lightSecond dark:text-text-darkSecond mt-2">
            Manage patient records and access requests
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-border-light dark:border-border-dark mb-6 overflow-x-auto">
          {(['patients', 'requests', 'upload', 'activity'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 font-medium capitalize border-b-2 transition whitespace-nowrap ${
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
          {activeTab === 'patients' && (
            <div className="card">
              <h2 className="font-semibold mb-4">Request Patient Access</h2>
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  // Handle patient search and access request
                }}
              >
                <div>
                  <label className="block text-sm font-medium mb-2">Patient ID / Phone</label>
                  <input
                    type="text"
                    placeholder="Enter patient identifier"
                    value={searchPatientId}
                    onChange={(e) => setSearchPatientId(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Reason for Access</label>
                  <textarea placeholder="e.g., Follow-up consultation" className="w-full" rows={3} />
                </div>
                <button type="submit" className="btn btn-primary w-full">
                  Request Access
                </button>
              </form>
            </div>
          )}

          {activeTab === 'requests' && (
            <div className="grid gap-4">
              {requests?.data?.requests?.length ? (
                requests.data.requests.map((req: any) => (
                  <div key={req.id} className="card">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">Patient: {req.patientId}</h3>
                        <p className="text-sm text-text-lightSecond dark:text-text-darkSecond mt-1">
                          Status: {req.status}
                        </p>
                        <p className="text-xs text-text-lightSecond dark:text-text-darkSecond mt-2">
                          Requested {new Date(req.requestedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded text-xs font-medium ${
                        req.status === 'approved'
                          ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                          : req.status === 'denied'
                          ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                          : 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400'
                      }`}>
                        {req.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="card text-center py-12">
                  <p className="text-text-lightSecond dark:text-text-darkSecond">No access requests</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'upload' && (
            <div className="card">
              <h2 className="font-semibold mb-4">Upload Patient Record</h2>
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  // Handle record upload
                }}
              >
                <div>
                  <label className="block text-sm font-medium mb-2">Patient ID</label>
                  <input type="text" placeholder="Patient identifier" className="w-full" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Record Title</label>
                  <input type="text" placeholder="e.g., Prescription" className="w-full" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">File</label>
                  <input type="file" accept=".pdf,.jpg,.png" className="w-full" />
                </div>
                <button type="submit" className="btn btn-primary w-full">
                  Upload Record
                </button>
              </form>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="space-y-2">
              {auditLogs?.data?.logs?.length ? (
                auditLogs.data.logs.map((log: any) => (
                  <div key={log.id} className="card text-sm">
                    <div className="flex justify-between">
                      <span>{log.action.toUpperCase()}</span>
                      <span className="text-text-lightSecond dark:text-text-darkSecond">
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="card text-center py-12">
                  <p className="text-text-lightSecond dark:text-text-darkSecond">No activity</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
