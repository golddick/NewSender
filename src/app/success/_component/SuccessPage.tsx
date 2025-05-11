'use client'

import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const reference = searchParams.get('reference')

  return (
    <div className="w-full h-screen grid place-items-center text-center">
      <div>
        <h5 className="text-xl font-semibold mb-2">🎉 Subscription Successful!</h5>
        <p className="mb-2">Thanks for subscribing.</p>
        {reference && (
          <p className="text-sm text-gray-500 mb-6">
            Payment Ref: <span className="font-mono">{reference}</span>
          </p>
        )}
        <div className="flex items-center justify-center gap-4">
          <Link href="/">
            <Button>Return Home</Button>
          </Link>
          <Link href="/dashboard">
            <Button>Go to Dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
