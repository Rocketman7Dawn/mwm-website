'use client'

import './globals.css'
import { SessionProvider } from 'next-auth/react'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <main className="min-h-screen">
            {children}
          </main>
          <footer className="mt-10 text-sm text-center text-gray-500 p-4">
            <p>
              <a href="/privacy" className="underline hover:text-black">Privacy Policy</a> | 
              <a href="/terms" className="underline hover:text-black ml-2">Terms of Use</a>
            </p>
          </footer>
        </SessionProvider>
      </body>
    </html>
  )
}
