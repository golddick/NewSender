import React, { Suspense } from 'react'
import NewEmailPage from './_component/NewEmailPage'
import Loader from '@/components/Loader'

const page = () => {
  return (
      <Suspense fallback={<Loader/>}>
          <NewEmailPage/>
      </Suspense>
  )
}

export default page
