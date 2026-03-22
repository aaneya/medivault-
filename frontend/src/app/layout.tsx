import type { Metadata } from 'next';
import { AuthProvider } from '@/context/AuthContext';
import '@/globals.css';

export const metadata: Metadata = {
  title: 'MediVault - Secure Medical Records',
  description: 'Blockchain-secured medical records platform with DigiLocker-style interface',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    userScalable: false,
    viewportFit: 'cover',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
        <div id="recaptcha-container" />
      </body>
    </html>
  );
}
