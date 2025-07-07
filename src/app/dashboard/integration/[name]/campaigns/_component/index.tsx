'use client'

import React from 'react'
import { CampaignPreview } from './campaign-preview'
import { useAppName } from '@/lib/hooks/get.appName'
import { useCampaignId } from '@/lib/hooks/get.campaignID'

const CampaignComponent = () => {

     const appName = useAppName()
      const campaignId = useCampaignId()

  return (
    <div>
       <CampaignPreview appName={appName} campaignId={campaignId}/>
    </div>
  )
}

export default CampaignComponent
