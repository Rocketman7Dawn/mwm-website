'use client'
import Link from 'next/link'
import Image from 'next/image'

export default function HomePage() {
  return (
    <main style={{
      textAlign: 'center',
      padding: '2rem'
    }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <Image
          src="/logo.png"
          alt="Mindfulness with Mind Logo"
          width={150}
          height={150}
        />
      </div>

      <h1>Welcome to Mindfulness with Mind</h1>
      <p>Supporting mindful businesses with inspired AI.</p>

      <Link href="/auth/signin">
        <button style={{
          marginTop: '2rem',
          padding: '0.75rem 1.5rem',
          fontSize: '1rem',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}>
          Client Dashboard
        </button>
      </Link>
    </main>
  )
}
