import { useEventStore } from '@/lib/data';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

// Hydrate the store on the client side
if (typeof window !== 'undefined') {
  useEventStore.persist.rehydrate()
}

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Sathyabama Institute Portal",
  description: "Portal for students and faculty of Sathyabama Institute",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={inter.className}>
      <body className={inter.className}>{children}</body>
    </html>
  )
}

