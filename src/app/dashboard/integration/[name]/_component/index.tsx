'use client'

import { useAppName } from '@/lib/hooks/get.appName'
import React from 'react'
import { SingleIntegration } from './single-app-Integration'

const IntegrationComponent = () => {
      const appName = useAppName()
  return (
    <div>
       <SingleIntegration appName={appName}/>
    </div>
  )
}

export default IntegrationComponent
