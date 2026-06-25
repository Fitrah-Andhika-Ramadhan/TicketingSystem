import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'VibeDesk - Ticket Management System',
  description: 'Professional ticket management and support system for efficient customer support',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

import { Toaster } from '@/components/ui/sonner'
import ClientDbInitializer from '@/components/ClientDbInitializer'
import CustomCursor from '@/components/CustomCursor'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <CustomCursor />
        <ClientDbInitializer />
        {children}
        <Toaster richColors position="top-right" />
        {process.env.NODE_ENV === 'production' && <Analytics />}
        
        {/* Google Translate Script */}
        <script type="text/javascript" src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit" async defer></script>
        <script type="text/javascript" dangerouslySetInnerHTML={{
          __html: `
            function googleTranslateElementInit() {
              new google.translate.TranslateElement({
                pageLanguage: 'id',
                includedLanguages: 'en,id',
                autoDisplay: false
              }, 'google_translate_element');
            }
          `
        }} />
      </body>
    </html>
  )
}
