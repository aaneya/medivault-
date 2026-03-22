'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { onboardingAPI } from '@/lib/api';

export default function OnboardingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    licenseNumber: '',
    specialty: '',
    hospital: '',
    hospitalAddress: '',
    hospitalPhone: '',
    yearsExperience: '',
    licenseDocRef: '',
    idDocRef: '',
    selfieRef: '',
  });

  const [uploading, setUploading] = useState(false);

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

  const handleFileUpload = async (type: 'license' | 'id' | 'selfie', file: File) => {
    setUploading(true);
    try {
      const response = await onboardingAPI.uploadDoc(user.uid, type, file);
      const { storageRef } = response.data;
      setFormData((prev) => ({
        ...prev,
        [`${type}DocRef`]: storageRef,
      }));
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      await onboardingAPI.submit(formData);
      router.push('/onboarding/pending');
    } catch (error) {
      console.error('Submission failed:', error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto p-4 md:p-6 py-12">
        {/* Progress */}
        <div className="mb-8">
          <h1 className="text-3xl font-sora font-bold mb-4">Doctor Verification</h1>
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`flex-1 h-2 rounded-full transition ${
                  s <= step ? 'bg-brand-500' : 'bg-border-light dark:bg-border-dark'
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-text-lightSecond dark:text-text-darkSecond mt-4">
            Step {step} of 4
          </p>
        </div>

        {/* Step 1: Personal Info */}
        {step === 1 && (
          <div className="card space-y-4">
            <h2 className="font-semibold">Personal Information</h2>
            <input
              type="text"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full"
            />
            <input
              type="text"
              placeholder="Medical License Number"
              value={formData.licenseNumber}
              onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
              className="w-full"
            />
            <input
              type="text"
              placeholder="Specialty"
              value={formData.specialty}
              onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
              className="w-full"
            />
            <input
              type="number"
              placeholder="Years of Experience"
              value={formData.yearsExperience}
              onChange={(e) => setFormData({ ...formData, yearsExperience: e.target.value })}
              className="w-full"
            />
            <button
              onClick={() => setStep(2)}
              className="btn btn-primary w-full"
            >
              Next
            </button>
          </div>
        )}

        {/* Step 2: Hospital Info */}
        {step === 2 && (
          <div className="card space-y-4">
            <h2 className="font-semibold">Hospital Information</h2>
            <input
              type="text"
              placeholder="Hospital Name"
              value={formData.hospital}
              onChange={(e) => setFormData({ ...formData, hospital: e.target.value })}
              className="w-full"
            />
            <input
              type="text"
              placeholder="Hospital Address"
              value={formData.hospitalAddress}
              onChange={(e) => setFormData({ ...formData, hospitalAddress: e.target.value })}
              className="w-full"
            />
            <input
              type="tel"
              placeholder="Hospital Phone"
              value={formData.hospitalPhone}
              onChange={(e) => setFormData({ ...formData, hospitalPhone: e.target.value })}
              className="w-full"
            />
            <div className="flex gap-2">
              <button onClick={() => setStep(1)} className="btn btn-secondary flex-1">
                Back
              </button>
              <button onClick={() => setStep(3)} className="btn btn-primary flex-1">
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Document Upload */}
        {step === 3 && (
          <div className="card space-y-4">
            <h2 className="font-semibold">Upload Documents</h2>
            
            <div>
              <label className="block text-sm font-medium mb-2">License Certificate (PDF)</label>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => handleFileUpload('license', e.target.files![0])}
                disabled={uploading}
                className="w-full"
              />
              {formData.licenseDocRef && <p className="text-xs text-green-600 mt-1">✓ Uploaded</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">ID Document (PDF/JPG)</label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg"
                onChange={(e) => handleFileUpload('id', e.target.files![0])}
                disabled={uploading}
                className="w-full"
              />
              {formData.idDocRef && <p className="text-xs text-green-600 mt-1">✓ Uploaded</p>}
            </div>

            <div className="flex gap-2">
              <button onClick={() => setStep(2)} className="btn btn-secondary flex-1">
                Back
              </button>
              <button onClick={() => setStep(4)} className="btn btn-primary flex-1" disabled={!formData.licenseDocRef || !formData.idDocRef}>
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Selfie */}
        {step === 4 && (
          <div className="card space-y-4">
            <h2 className="font-semibold">Selfie Verification</h2>
            <p className="text-sm text-text-lightSecond dark:text-text-darkSecond">
              Take a clear selfie for verification
            </p>
            
            <div>
              <label className="block text-sm font-medium mb-2">Selfie Photo (JPG)</label>
              <input
                type="file"
                accept=".jpg,.jpeg,.png"
                onChange={(e) => handleFileUpload('selfie', e.target.files![0])}
                disabled={uploading}
                className="w-full"
              />
              {formData.selfieRef && <p className="text-xs text-green-600 mt-1">✓ Uploaded</p>}
            </div>

            <div className="flex gap-2">
              <button onClick={() => setStep(3)} className="btn btn-secondary flex-1">
                Back
              </button>
              <button
                onClick={handleSubmit}
                className="btn btn-primary flex-1"
                disabled={!formData.selfieRef || uploading}
              >
                {uploading ? 'Uploading...' : 'Submit'}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
