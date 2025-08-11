

// src/app/dashboard/auto-email/[id]/page.tsx

import { useEmailID } from '@/lib/hooks/get.email_ID'
import { EmailDetails } from '../_component/email-details'



export default function Page() {

  const EmailID = useEmailID()

  return <EmailDetails emailId={EmailID} />
}
