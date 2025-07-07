import { getMembershipStatus } from '@/actions/membership/getTermsMembership'
import LegalPage from '@/modules/legal'
import { XFooter } from '@/shared/widgets/footer/footer'
import Header from '@/shared/widgets/header'
import React from 'react'

const page = async () => {

    const membershipStatus = await getMembershipStatus();

  return (
    <>
     <Header />
      <LegalPage membershipStatus={membershipStatus}/>
      <XFooter />
    </>
  )
}

export default page
