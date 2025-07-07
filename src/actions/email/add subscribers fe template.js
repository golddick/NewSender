// //frontend implementation of addsubscribers route 

// // components/IntegrationSubscribeForm.tsx
// 'use client'

// import { useState } from 'react'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Checkbox } from '@/components/ui/checkbox'
// import { Label } from '@/components/ui/label'
// import { toast } from 'sonner'
// import { Loader2 } from 'lucide-react'

// interface IntegrationSubscribeFormProps {
//   appName: string
//   apiKey: string
//   campaignId?: string
//   defaultEmail?: string
//   defaultName?: string
//   source?: string
//   availablePreferences?: {
//     id: string
//     label: string
//     defaultChecked?: boolean
//   }[]
// }

// export function IntegrationSubscribeForm({
//   appName,
//   apiKey,
//   campaignId,
//   defaultEmail = '',
//   defaultName = '',
//   source = 'website-form',
//   availablePreferences = []
// }: IntegrationSubscribeFormProps) {
//   const [email, setEmail] = useState(defaultEmail)
//   const [name, setName] = useState(defaultName)
//   const [preferences, setPreferences] = useState<Record<string, boolean>>(
//     availablePreferences.reduce((acc, pref) => ({
//       ...acc,
//       [pref.id]: pref.defaultChecked ?? true
//     }), {})
//   )
//   const [isLoading, setIsLoading] = useState(false)

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setIsLoading(true)

//     try {
//       const response = await fetch(`/api/integrations/${appName}/subscribe`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'x-api-key': apiKey
//         },
//         body: JSON.stringify({
//           email,
//           name: name || undefined,
//           campaignId,
//           source,
//           metadata: {
//             pageUrl: typeof window !== 'undefined' ? window.location.href : '',
//             preferences: availablePreferences.length > 0 ? preferences : undefined
//           }
//         })
//       })

//       const data = await response.json()

//       if (!response.ok) {
//         throw new Error(data.error || 'Subscription failed')
//       }

//       toast.success('Successfully subscribed!')
      
//       // Reset form if not prefilled
//       if (!defaultEmail) setEmail('')
//       if (!defaultName) setName('')

//     } catch (error) {
//       toast.error(
//         error instanceof Error ? error.message : 'An error occurred'
//       )
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const togglePreference = (prefId: string) => {
//     setPreferences(prev => ({
//       ...prev,
//       [prefId]: !prev[prefId]
//     }))
//   }

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       <div className="space-y-2">
//         <Label htmlFor="email">Email*</Label>
//         <Input
//           id="email"
//           type="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           placeholder="your@email.com"
//           required
//           disabled={isLoading}
//         />
//       </div>

//       <div className="space-y-2">
//         <Label htmlFor="name">Name (Optional)</Label>
//         <Input
//           id="name"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           placeholder="Your name"
//           disabled={isLoading}
//         />
//       </div>

//       {availablePreferences.length > 0 && (
//         <div className="space-y-3">
//           <Label>Email Preferences</Label>
//           <div className="space-y-2">
//             {availablePreferences.map((pref) => (
//               <div key={pref.id} className="flex items-center gap-2">
//                 <Checkbox
//                   id={`pref-${pref.id}`}
//                   checked={preferences[pref.id]}
//                   onCheckedChange={() => togglePreference(pref.id)}
//                   disabled={isLoading}
//                 />
//                 <Label htmlFor={`pref-${pref.id}`} className="font-normal">
//                   {pref.label}
//                 </Label>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       <Button 
//         type="submit" 
//         className="w-full"
//         disabled={isLoading || !email}
//       >
//         {isLoading ? (
//           <>
//             <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//             Processing...
//           </>
//         ) : (
//           'Subscribe'
//         )}
//       </Button>
//     </form>
//   )
// }



