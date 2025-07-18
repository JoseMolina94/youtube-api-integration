import type { Metadata } from 'next'
import Header from '@/components/Header'
import { ToastProvider } from '@/contexts/ToastContext'
import { FavoritesProvider } from '@/contexts/FavoritesContext'

import './globals.css'

export const metadata: Metadata = {
  title: 'Youtube Store',
  description: 'Your favorite video store for youtube',
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
          <FavoritesProvider>
            <div>
              <Header />
              <div>
                {children}
              </div>
            </div>
          </FavoritesProvider>
        </ToastProvider>
      </body>
    </html>
  )
}
