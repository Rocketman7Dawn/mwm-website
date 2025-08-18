'use client'

import { getProviders, signIn } from "next-auth/react"
import { useEffect, useState } from "react"

export default function SignInPage() {
  const [providers, setProviders] = useState(null)

  useEffect(() => {
    getProviders().then(setProviders)
  }, [])

  if (!providers) return <div>Loading...</div>

  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h1>Sign in</h1>
      {Object.values(providers).map(provider => (
        <div key={provider.name}>
          <button onClick={() => signIn(provider.id)}>
            Sign in with {provider.name}
          </button>
        </div>
      ))}
    </div>
  )
}
