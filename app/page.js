'use client'

export default function HomePage() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '80vh',
      textAlign: 'center',
      padding: '2rem'
    }}>
      {/* Large Logo */}
      <img
        src="/logo.png"
        alt="Mindfulness with Mind Logo"
        style={{ width: '150px', height: '150px', marginBottom: '1.5rem' }}
      />

      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
        Welcome to Mindfulness with Mind
      </h1>

      <p style={{ fontSize: '1.2rem', maxWidth: '600px' }}>
        Supporting mindful businesses with inspired AI.
      </p>
    </div>
  )
}
