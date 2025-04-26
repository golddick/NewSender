import React, { Suspense } from 'react'
import NewEmailPage from './_component/NewEmailPage'

const page = () => {
  return (
      <Suspense fallback={<div>Loading...</div>}>
          <NewEmailPage/>
      </Suspense>
  )
}

export default page
