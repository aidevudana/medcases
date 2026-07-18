import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Medicine Kuppiya — Short Appointments Dashboard',
  description: 'Final MBBS clerkship study notes, RUSL 13th Batch. All appointment topics enriched with AI. © Udana Anjana',
  keywords: 'MBBS, RUSL, medicine, clerkship, study notes, orthopedics, neurology',
  authors: [{ name: 'Udana Anjana', url: 'https://aidevudana.github.io/udanaanjana' }],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
