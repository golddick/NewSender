

import React, { Suspense } from 'react'
import SubscribePage from './_component/subscribePage'

const page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SubscribePage/>
    </Suspense>
  )
}

export default page

