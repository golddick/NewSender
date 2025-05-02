import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

const Page = () => {
  return (
    <div className='w-full h-screen grid place-items-center'>
        <h5>Congratulation you subscribed successfully!</h5>
        <Link href={'/'}>
        <Button>
          Return Home
        </Button>
        </Link>
    </div>
  )
}

export default Page