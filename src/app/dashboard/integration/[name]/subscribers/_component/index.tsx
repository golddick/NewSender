'use client'


import { useAppName } from '@/lib/hooks/get.appName'
import React from 'react'
import { IntegrationSubscribers } from './app-integration-subscribers'

const SubscribePage = () => {

    const appName = useAppName()

  return (
    <div>
       <IntegrationSubscribers appName={appName} />
    </div>
  )
}

export default SubscribePage
