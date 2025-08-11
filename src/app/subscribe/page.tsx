

import React, { Suspense } from 'react'
import SubscribePage from './_component/subscribePage'
import Loader from '@/components/Loader'
import { URLSubscribeFormPage } from './_component/subPageForm'

const page = () => {
  return (
    <Suspense fallback={<Loader/>}>
      {/* <SubscribePage/> */}
      <URLSubscribeFormPage/>
    </Suspense>
  )
}

export default page

