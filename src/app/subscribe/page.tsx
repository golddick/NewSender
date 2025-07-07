

import React, { Suspense } from 'react'
import SubscribePage from './_component/subscribePage'
import Loader from '@/components/Loader'
import { SubscribeFormPage } from './_component/subPageForm'

const page = () => {
  return (
    <Suspense fallback={<Loader/>}>
      {/* <SubscribePage/> */}
      <SubscribeFormPage/>
    </Suspense>
  )
}

export default page

