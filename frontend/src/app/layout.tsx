import type { Metadata } from 'next'
import Header from '@/components/Header'

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
        <div>
          <Header />
          <div>
            {children}
          </div>
        </div>

      </body>
    </html>
  )
}
