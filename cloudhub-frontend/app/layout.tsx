import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CloudHub',
  description: 'CloudHub is a community marketplace for creating and joining hackathons with all the tools, mentorship, and infrastructure needed for success. Launch or participate in hackathons with escrow services and AI tools.',
  generator: 'CloudHub',
  metadataBase: new URL('https://hub.lynq.ae'),
  keywords: ['hackathon platform', 'hackathon marketplace', 'community hackathons', 'mentorship', 'tech hackathons', 'hackathon tools', 'coding competitions', 'AI tools'],
  openGraph: {
    title: 'CloudHub',
    description: 'Join the leading hackathon community marketplace with trusted escrow services, AI tools, and expert mentorship for creators and participants.',
    url: 'https://hub.lynq.ae',
    siteName: 'CloudHub',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'CloudHub Hackathon Marketplace'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CloudHub | Hackathon Community Marketplace',
    description: 'Create or join hackathons with all the tools and services needed for success.',
    images: ['/twitter-image.jpg']
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
