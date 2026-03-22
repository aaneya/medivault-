'use client';

import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function Home() {
  const { user, role } = useAuth();

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-bg-light to-bg-light dark:from-bg-dark dark:to-bg-darkSecond">
        {/* Hero */}
        <div className="max-w-6xl mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl md:text-6xl font-sora font-bold mb-6">
            Secure Medical Records
          </h1>
          <p className="text-xl text-text-lightSecond dark:text-text-darkSecond mb-8 max-w-2xl mx-auto">
            MediVault combines blockchain technology with secure cloud storage to give you complete control over your medical records.
          </p>

          {!user ? (
            <div className="flex gap-4 justify-center">
              <Link href="/login" className="btn btn-primary px-8">
                Sign In
              </Link>
              <Link href="/register" className="btn btn-secondary px-8">
                Register
              </Link>
            </div>
          ) : (
            <div className="flex gap-4 justify-center">
              {role === 'patient' && (
                <Link href="/patient/dashboard" className="btn btn-primary px-8">
                  Go to Dashboard
                </Link>
              )}
              {role === 'doctor' && (
                <Link href="/doctor/dashboard" className="btn btn-primary px-8">
                  Doctor Portal
                </Link>
              )}
              {role === 'admin' && (
                <Link href="/admin/dashboard" className="btn btn-primary px-8">
                  Admin Panel
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Features */}
        <div className="max-w-6xl mx-auto px-4 py-20">
          <h2 className="text-3xl font-sora font-bold text-center mb-12">Why MediVault?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Blockchain Secured',
                description: 'SHA-256 hash anchored to Polygon Mumbai for tamper proof records',
              },
              {
                title: 'Full Control',
                description: 'Approve or deny doctor access to your medical records',
              },
              {
                title: 'IPFS Storage',
                description: 'Decentralized file storage with signed URLs for secure access',
              },
            ].map((feature) => (
              <div key={feature.title} className="card">
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-text-lightSecond dark:text-text-darkSecond">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
