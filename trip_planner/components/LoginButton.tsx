'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { useEffect, useState } from 'react'

export default function LoginButton() {
  const [mounted, setMounted] = useState(false)
  const { data: session, status } = useSession()

  useEffect(() => {
    setMounted(true)
  }, [])

  // עד שהרכיב עולה, אל תרנדר כלום
  if (!mounted || status === 'loading') return null

  if (session) {
    return (
      <div className="p-4 bg-green-100 rounded-md">
        <p>Hello, {session.user?.name}</p>
        <button onClick={() => signOut()} className="bg-red-500 text-white px-4 py-2 rounded">
          Log out
        </button>
      </div>
    )
  }

  return (
    <button onClick={() => signIn('google')} className="bg-blue-600 text-white px-4 py-2 rounded">
      Login with Google
    </button>
  )
}
