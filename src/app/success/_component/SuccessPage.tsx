'use client'

import { useEffect, useState, useTransition } from 'react'
import { useSearchParams } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { verifyPaystackPayment } from '@/actions/paystack.verify'

// Import the server action

export default function SuccessPage() {
  const { user, isLoaded } = useUser()
  const searchParams = useSearchParams()
  const [loading, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [verified, setVerified] = useState(false)

  useEffect(() => {
    if (!isLoaded) return

    const reference = searchParams.get('reference')
    if (!reference || !user?.id) {
      setError('Missing payment reference or user not authenticated.')
      return
    }

    startTransition(async () => {
      try {
        const result = await verifyPaystackPayment(reference)

        if (!result?.success) {
          throw new Error('Verification failed')
        }

        setVerified(true)
      } catch (err: any) {
        setError(err.message || 'Something went wrong.')
      }
    })
  }, [isLoaded, user, searchParams])

  if (loading) {
    return <div className="grid place-items-center h-screen">Verifying subscription...</div>
  }

  if (error) {
    return <div className="grid place-items-center h-screen text-red-600">{error}</div>
  }

  if (!verified) return null

  return (
    <div className="w-full h-screen grid place-items-center text-center">
      <div>
        <h5 className="text-xl font-semibold mb-2">🎉 Subscription Successful!</h5>
        <p className="mb-6">Thanks for subscribing. You’re all set.</p>
        <div className="flex items-center justify-center gap-4">
        <Link href="/">
          <Button>Return Home</Button>
        </Link>
        <Link href="/dashboard">
          <Button>
            Go to Dashboard
          </Button>
        </Link>
        </div>
      </div>
    </div>
  )
}
