import type { Metadata } from 'next'
import Header from '@/components/Header'
import { ToastProvider } from '@/contexts/ToastContext'

import './globals.css'

export const metadata: Metadata = {
  title: 'Video Store TV',
  description: 'Video Store TV Web',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className='min-h-screen flex flex-col justify-between' >
        <ToastProvider>
          <div>
            <Header />
            <div>
              {children}
            </div>
          </div>
        </ToastProvider>
      </body>
    </html>
  )
}
