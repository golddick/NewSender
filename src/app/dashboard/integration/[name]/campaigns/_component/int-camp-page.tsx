'use client'

import { useAppName } from '@/lib/hooks/get.appName'
import React from 'react'
import { IntegrationCampaigns } from './integration-campaigns'

const IntCampPage = () => {
    const appName = useAppName()
  return (
    <div>
       <IntegrationCampaigns  appName={appName} />
    </div>
  )
}

export default IntCampPage
