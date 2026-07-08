import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter, Source_Serif_4 } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
})

const siteUrl = 'https://globalmigrationhub.com'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Global Migration Hub | Trusted Visa & Immigration Consultancy',
    template: '%s | Global Migration Hub',
  },
  description:
    'Global Migration Hub provides expert work permit services, up-to-date immigration news, and a secure client portal to track your visa status. Trusted guidance for your relocation journey.',
  keywords: [
    'immigration consultancy',
    'work permit services',
    'visa status',
    'visa application',
    'immigration news',
    'global migration',
    'relocation services',
  ],
  authors: [{ name: 'Global Migration Hub' }],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: siteUrl,
    title: 'Global Migration Hub | Trusted Visa & Immigration Consultancy',
    description:
      'Expert work permit services, immigration news, and a secure client portal to track your visa status.',
    siteName: 'Global Migration Hub',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Global Migration Hub | Trusted Visa & Immigration Consultancy',
    description:
      'Expert work permit services, immigration news, and a secure client portal to track your visa status.',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#211735',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${sourceSerif.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
