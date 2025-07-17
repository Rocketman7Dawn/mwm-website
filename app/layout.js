            import './globals.css'
            import Link from 'next/link'

            export const metadata = {
              title: 'Mindfulness with Mind',
              description: 'Supporting mindful businesses with holistic AI.',
            }

            export default function RootLayout({ children }) {
              return (
                <html lang="en">
                  <body style={{
                    margin: 0,
                    padding: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '100vh',
                    fontFamily: 'sans-serif'
                  }}>
                    {/* Header with Logo */}
                    <header style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '1rem',
                      backgroundColor: '#ffffff',
                      borderBottom: '1px solid #eee'
                    }}>
                      <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                        <img
                          src="/logo.png"
                          alt="Mindfulness with Mind Logo"
                          style={{ height: '40px', marginRight: '1rem' }}
                        />
                      </Link>
                    </header>

                    {/* Main Content */}
                    <main style={{ flexGrow: 1 }}>
                      {children}
                    </main>

                    {/* Footer */}
                    <footer style={{
                      textAlign: 'center',
                      padding: '1rem',
                      fontSize: '0.9rem',
                      backgroundColor: '#f9f9f9'
                    }}>
                      <Link href="/privacy-policy" style={{ marginRight: '2rem' }}>
                        Privacy Policy
                      </Link>
                      <Link href="/terms-of-service">
                        Terms of Service
                      </Link>
                    </footer>
                  </body>
                </html>
              )
            }
