// "use client"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Progress } from "@/components/ui/progress"
// import { Switch } from "@/components/ui/switch"
// import { Label } from "@/components/ui/label"
// import { Separator } from "@/components/ui/separator"
// import { CreditCard, Download, Calendar, Zap, Check, AlertTriangle, Plus, Edit, Trash2 } from "lucide-react"
// import { useToast } from "@/hooks/use-toast"

// export function SubscriptionSettings() {
//   const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")
//   const [autoRenew, setAutoRenew] = useState(true)
//   const [isLoading, setIsLoading] = useState(false)
//   const { toast } = useToast()

//   const currentPlan = {
//     name: "Professional",
//     price: billingCycle === "monthly" ? 29 : 290,
//     cycle: billingCycle,
//     features: [
//       "Up to 10,000 subscribers",
//       "Unlimited email campaigns",
//       "Advanced analytics",
//       "Priority support",
//       "Custom integrations",
//       "A/B testing",
//     ],
//   }

//   const usage = {
//     subscribers: { current: 2450, limit: 10000 },
//     emails: { current: 15420, limit: 50000 },
//     campaigns: { current: 23, limit: 100 },
//     integrations: { current: 5, limit: 20 },
//   }

//   const plans = [
//     {
//       name: "Starter",
//       price: { monthly: 9, yearly: 90 },
//       features: [
//         "Up to 1,000 subscribers",
//         "5,000 emails per month",
//         "Basic analytics",
//         "Email support",
//         "Standard templates",
//       ],
//       limits: {
//         subscribers: 1000,
//         emails: 5000,
//         campaigns: 10,
//         integrations: 3,
//       },
//     },
//     {
//       name: "Professional",
//       price: { monthly: 29, yearly: 290 },
//       features: [
//         "Up to 10,000 subscribers",
//         "50,000 emails per month",
//         "Advanced analytics",
//         "Priority support",
//         "Custom integrations",
//         "A/B testing",
//       ],
//       limits: {
//         subscribers: 10000,
//         emails: 50000,
//         campaigns: 100,
//         integrations: 20,
//       },
//       popular: true,
//     },
//     {
//       name: "Enterprise",
//       price: { monthly: 99, yearly: 990 },
//       features: [
//         "Unlimited subscribers",
//         "Unlimited emails",
//         "Advanced analytics & reporting",
//         "24/7 phone support",
//         "Custom integrations",
//         "White-label options",
//         "Dedicated account manager",
//       ],
//       limits: {
//         subscribers: "Unlimited",
//         emails: "Unlimited",
//         campaigns: "Unlimited",
//         integrations: "Unlimited",
//       },
//     },
//   ]

//   const paymentMethods = [
//     {
//       id: "1",
//       type: "card",
//       last4: "4242",
//       brand: "Visa",
//       expiryMonth: 12,
//       expiryYear: 2025,
//       isDefault: true,
//     },
//     {
//       id: "2",
//       type: "card",
//       last4: "5555",
//       brand: "Mastercard",
//       expiryMonth: 8,
//       expiryYear: 2024,
//       isDefault: false,
//     },
//   ]

//   const billingHistory = [
//     {
//       id: "1",
//       date: "2024-01-01",
//       amount: 29.0,
//       status: "paid",
//       description: "Professional Plan - Monthly",
//       invoice: "INV-2024-001",
//     },
//     {
//       id: "2",
//       date: "2023-12-01",
//       amount: 29.0,
//       status: "paid",
//       description: "Professional Plan - Monthly",
//       invoice: "INV-2023-012",
//     },
//     {
//       id: "3",
//       date: "2023-11-01",
//       amount: 29.0,
//       status: "paid",
//       description: "Professional Plan - Monthly",
//       invoice: "INV-2023-011",
//     },
//   ]

//   const handlePlanChange = (planName: string) => {
//     setIsLoading(true)
//     setTimeout(() => {
//       setIsLoading(false)
//       toast({
//         title: "Plan updated",
//         description: `Successfully switched to ${planName} plan.`,
//       })
//     }, 2000)
//   }

//   const handleCancelSubscription = () => {
//     toast({
//       title: "Subscription cancelled",
//       description: "Your subscription will remain active until the end of the current billing period.",
//       variant: "destructive",
//     })
//   }

//   return (
//     <div className="space-y-8">
//       {/* Current Plan Overview */}
//       <div>
//         <h2 className="text-2xl font-bold tracking-tight mb-2">Subscription & Billing</h2>
//         <p className="text-muted-foreground mb-6">Manage your subscription plan, billing, and payment methods.</p>

//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center justify-between">
//               <div className="flex items-center gap-2">
//                 <Zap className="h-5 w-5 text-xred-500" />
//                 Current Plan: {currentPlan.name}
//               </div>
//               <Badge className="bg-xred-100 text-xred-800 hover:bg-xred-100">Active</Badge>
//             </CardTitle>
//             <CardDescription>
//               ${currentPlan.price}/{currentPlan.cycle === "monthly" ? "month" : "year"} • Next billing: January 1, 2024
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div className="space-y-4">
//                 <h4 className="font-medium">Plan Features</h4>
//                 <ul className="space-y-2">
//                   {currentPlan.features.map((feature, index) => (
//                     <li key={index} className="flex items-center gap-2 text-sm">
//                       <Check className="h-4 w-4 text-green-500" />
//                       {feature}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//               <div className="space-y-4">
//                 <h4 className="font-medium">Usage This Month</h4>
//                 <div className="space-y-4">
//                   <div>
//                     <div className="flex justify-between text-sm mb-1">
//                       <span>Subscribers</span>
//                       <span>
//                         {usage.subscribers.current.toLocaleString()} / {usage.subscribers.limit.toLocaleString()}
//                       </span>
//                     </div>
//                     <Progress value={(usage.subscribers.current / usage.subscribers.limit) * 100} className="h-2" />
//                   </div>
//                   <div>
//                     <div className="flex justify-between text-sm mb-1">
//                       <span>Emails Sent</span>
//                       <span>
//                         {usage.emails.current.toLocaleString()} / {usage.emails.limit.toLocaleString()}
//                       </span>
//                     </div>
//                     <Progress value={(usage.emails.current / usage.emails.limit) * 100} className="h-2" />
//                   </div>
//                   <div>
//                     <div className="flex justify-between text-sm mb-1">
//                       <span>Active Campaigns</span>
//                       <span>
//                         {usage.campaigns.current} / {usage.campaigns.limit}
//                       </span>
//                     </div>
//                     <Progress value={(usage.campaigns.current / usage.campaigns.limit) * 100} className="h-2" />
//                   </div>
//                   <div>
//                     <div className="flex justify-between text-sm mb-1">
//                       <span>Integrations</span>
//                       <span>
//                         {usage.integrations.current} / {usage.integrations.limit}
//                       </span>
//                     </div>
//                     <Progress value={(usage.integrations.current / usage.integrations.limit) * 100} className="h-2" />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Plan Comparison */}
//       <div>
//         <div className="flex items-center justify-between mb-6">
//           <h3 className="text-xl font-semibold">Available Plans</h3>
//           <div className="flex items-center gap-4">
//             <Label htmlFor="billing-toggle">Monthly</Label>
//             <Switch
//               id="billing-toggle"
//               checked={billingCycle === "yearly"}
//               onCheckedChange={(checked) => setBillingCycle(checked ? "yearly" : "monthly")}
//             />
//             <Label htmlFor="billing-toggle">
//               Yearly{" "}
//               <Badge variant="secondary" className="ml-1">
//                 Save 17%
//               </Badge>
//             </Label>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           {plans.map((plan) => (
//             <Card key={plan.name} className={`relative ${plan.popular ? "border-xred-500 shadow-lg" : ""}`}>
//               {plan.popular && (
//                 <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
//                   <Badge className="bg-xred-500 hover:bg-xred-500">Most Popular</Badge>
//                 </div>
//               )}
//               <CardHeader>
//                 <CardTitle className="flex items-center justify-between">
//                   {plan.name}
//                   {currentPlan.name === plan.name && <Badge variant="outline">Current</Badge>}
//                 </CardTitle>
//                 <div className="text-3xl font-bold">
//                   ${plan.price[billingCycle]}
//                   <span className="text-lg font-normal text-muted-foreground">
//                     /{billingCycle === "monthly" ? "mo" : "yr"}
//                   </span>
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 <ul className="space-y-3 mb-6">
//                   {plan.features.map((feature, index) => (
//                     <li key={index} className="flex items-center gap-2 text-sm">
//                       <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
//                       {feature}
//                     </li>
//                   ))}
//                 </ul>
//                 <Button
//                   className={`w-full ${
//                     currentPlan.name === plan.name
//                       ? "bg-gray-100 text-gray-500 cursor-not-allowed"
//                       : "bg-xred-500 hover:bg-xred-600"
//                   }`}
//                   disabled={currentPlan.name === plan.name || isLoading}
//                   onClick={() => handlePlanChange(plan.name)}
//                 >
//                   {currentPlan.name === plan.name ? "Current Plan" : `Upgrade to ${plan.name}`}
//                 </Button>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       </div>

//       {/* Payment Methods */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <CreditCard className="h-5 w-5" />
//             Payment Methods
//           </CardTitle>
//           <CardDescription>Manage your payment methods and billing information.</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-4">
//             {paymentMethods.map((method) => (
//               <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
//                 <div className="flex items-center gap-4">
//                   <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center">
//                     <CreditCard className="h-4 w-4" />
//                   </div>
//                   <div>
//                     <div className="font-medium">
//                       {method.brand} •••• {method.last4}
//                       {method.isDefault && (
//                         <Badge variant="secondary" className="ml-2">
//                           Default
//                         </Badge>
//                       )}
//                     </div>
//                     <div className="text-sm text-muted-foreground">
//                       Expires {method.expiryMonth}/{method.expiryYear}
//                     </div>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <Button variant="outline" size="sm">
//                     <Edit className="h-4 w-4 mr-1" />
//                     Edit
//                   </Button>
//                   <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent">
//                     <Trash2 className="h-4 w-4 mr-1" />
//                     Remove
//                   </Button>
//                 </div>
//               </div>
//             ))}
//             <Button variant="outline" className="w-full bg-transparent">
//               <Plus className="h-4 w-4 mr-2" />
//               Add New Payment Method
//             </Button>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Billing History */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <Calendar className="h-5 w-5" />
//             Billing History
//           </CardTitle>
//           <CardDescription>View and download your past invoices.</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-4">
//             {billingHistory.map((invoice) => (
//               <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
//                 <div className="flex items-center gap-4">
//                   <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
//                     <Check className="h-5 w-5 text-green-600" />
//                   </div>
//                   <div>
//                     <div className="font-medium">{invoice.description}</div>
//                     <div className="text-sm text-muted-foreground">
//                       {new Date(invoice.date).toLocaleDateString()} • {invoice.invoice}
//                     </div>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-4">
//                   <div className="text-right">
//                     <div className="font-medium">${invoice.amount.toFixed(2)}</div>
//                     <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{invoice.status}</Badge>
//                   </div>
//                   <Button variant="outline" size="sm">
//                     <Download className="h-4 w-4 mr-1" />
//                     Download
//                   </Button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </CardContent>
//       </Card>

//       {/* Billing Preferences */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Billing Preferences</CardTitle>
//           <CardDescription>Configure your billing and renewal settings.</CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <Label htmlFor="auto-renew" className="text-base font-medium">
//                 Auto-renewal
//               </Label>
//               <p className="text-sm text-muted-foreground">
//                 Automatically renew your subscription at the end of each billing period
//               </p>
//             </div>
//             <Switch id="auto-renew" checked={autoRenew} onCheckedChange={setAutoRenew} />
//           </div>
//           <Separator />
//           <div className="flex items-center justify-between">
//             <div>
//               <Label className="text-base font-medium">Email receipts</Label>
//               <p className="text-sm text-muted-foreground">Receive email receipts for all billing transactions</p>
//             </div>
//             <Switch defaultChecked />
//           </div>
//           <Separator />
//           <div className="flex items-center justify-between">
//             <div>
//               <Label className="text-base font-medium">Usage alerts</Label>
//               <p className="text-sm text-muted-foreground">Get notified when you&apos;re approaching your plan limits</p>
//             </div>
//             <Switch defaultChecked />
//           </div>
//         </CardContent>
//       </Card>

//       {/* Danger Zone */}
//       <Card className="border-red-200">
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2 text-red-600">
//             <AlertTriangle className="h-5 w-5" />
//             Danger Zone
//           </CardTitle>
//           <CardDescription>These actions are irreversible. Please proceed with caution.</CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
//             <div>
//               <h4 className="font-medium">Cancel Subscription</h4>
//               <p className="text-sm text-muted-foreground">
//                 Cancel your subscription. You&apos;ll retain access until the end of your billing period.
//               </p>
//             </div>
//             <Button variant="destructive" onClick={handleCancelSubscription}>
//               Cancel Subscription
//             </Button>
//           </div>
//           <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
//             <div>
//               <h4 className="font-medium">Delete Account</h4>
//               <p className="text-sm text-muted-foreground">
//                 Permanently delete your account and all associated data. This action cannot be undone.
//               </p>
//             </div>
//             <Button variant="destructive">Delete Account</Button>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }








"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { CreditCard, Download, Calendar, Zap, Check, AlertTriangle, Plus, Edit, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

import { Plan, PlanSubscriptionStatus } from "@prisma/client"
import { cancelSubscription, downgradeToFreePlan, getBillingHistory, getCurrentSubscription, getUsageStats, toggleAutoRenew } from "@/actions/plan/subscription-plan"
import { availablePlans, PLAN_CONFIG } from "@/lib/planLimit"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { paystackSubscribe } from "@/actions/paystack/paystack.subscribe"
import toast from "react-hot-toast"
import Loader from "@/components/Loader"

type SubscriptionData = {
  plan: Plan
  subscriptionStatus: PlanSubscriptionStatus
  currentPeriodEnd: Date | null
  nextPaymentDate: Date | null
  amount: number
  currency: string
  subscriberLimit: number
  emailLimit: number
  campaignLimit: number
  appIntegratedLimit: number
  blogPostLimit: number
  aiGenerationLimit: number
}

type UsageData = {
  emailsSent: number
  subscribersAdded: number
  campaignsCreated: number
  appIntegrated: number
  blogPostsCreated: number
  aiGenerationsUsed: number
}

type BillingHistoryItem = {
  id: string
  date: string
  amount: number
  status: string
  description: string
  invoiceUrl: string
}

export function SubscriptionSettings() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")
  const [autoRenew, setAutoRenew] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useUser()
  const history = useRouter();
  const [subscription, setSubscription] = useState<SubscriptionData | any>()
  const [usage, setUsage] = useState<UsageData | any>()
  const [billingHistory, setBillingHistory] = useState<BillingHistoryItem[]>([])

useEffect(() => {
  const fetchData = async () => {
    setIsLoading(true)
    try {
      const [
        subscriptionResponse,
        usageResponse,
        billingHistoryResponse
      ] = await Promise.all([
        getCurrentSubscription(),
        getUsageStats(),
        getBillingHistory()
      ])

      // Null checks
      if (!subscriptionResponse) {
        throw new Error("Failed to fetch subscription data")
      }
      if (!usageResponse) {
        throw new Error("Failed to fetch usage stats")
      }
      if (!billingHistoryResponse) {
        throw new Error("Failed to fetch billing history")
      }

      // Error checks
      if ("error" in subscriptionResponse) {
        throw new Error(subscriptionResponse.error)
      }
      if ("error" in usageResponse) {
        throw new Error(usageResponse.error)
      }
      if ("error" in billingHistoryResponse) {
        throw new Error(billingHistoryResponse.error)
      }

      const subscriptionData = subscriptionResponse as SubscriptionData
      const usageData = usageResponse as UsageData
      const billingHistoryData = billingHistoryResponse as BillingHistoryItem[]

      setSubscription(subscriptionData)
      setUsage(usageData)
      setBillingHistory(billingHistoryData)
      setAutoRenew(subscriptionData.subscriptionStatus === "active")
    } catch (error) {
     
      toast.error(error instanceof Error? error.message : "Failed to load subscription data")
    } finally {
      setIsLoading(false)
    }
  }

  fetchData()
}, [])


const handlePlanChange = async (
  plan: "FREE" | "LAUNCH" | "SCALE",
  billingCycle: "monthly" | "yearly"
) => {
  if (!user || !user.id) {
    history.push("/");
    return;
  }

  try {
    if (plan === "FREE") {
      // Downgrade immediately without payment
      const response = await downgradeToFreePlan(user.id);
      if (response.success) {
        toast.success("You have been downgraded to the Free plan.");
        history.refresh()
      } else {
        toast.error(response.error || "Failed to downgrade to Free plan");
      }
      return;
    }

    // Otherwise, process paid plan subscription
    const authorizationUrl = await paystackSubscribe({
      planName: plan,
      userId: user.id,
      billingCycle,
    });

    if (authorizationUrl) {
      window.location.href = authorizationUrl;
      toast.success("Payment initiated. Please wait for your payment confirmation.");
    } else {
      toast.error("Failed to initiate payment");
    }
  } catch (error: any) {
    toast.error(error.message || "Payment failed");
  }
};





  

  const handleCancelSubscription = async () => {
    setIsLoading(true)
    try {
      const result = await cancelSubscription()
      
      if (!result.success) {
        throw new Error(result.error || "Failed to cancel subscription")
      }

      // Update local state
      if (subscription) {
        setSubscription({
          ...subscription,
          subscriptionStatus: "cancelled",
          nextPaymentDate: null
        })
      }

      
      toast.success("Successfull Your subscription will remain active until the end of the current billing period.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to cancel subscription")
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleAutoRenew = async (checked: boolean) => {
    const previousState = autoRenew
    setAutoRenew(checked)
    
    try {
      const result = await toggleAutoRenew(checked)
      
      if (!result.success) {
        throw new Error(result.error || "Failed to update auto-renewal")
      }

      // Update local state
      if (subscription) {
        setSubscription({
          ...subscription,
          subscriptionStatus: checked ? "active" : "inactive"
        })
      }
      toast.success("Auto-renewal status updated")
    } catch (error) {
      setAutoRenew(previousState)
     toast.error(error instanceof Error? error.message : "Failed to update auto-renewal")
    }
  }

  if (isLoading && !subscription) {
    return <Loader/>
  }

  if (!subscription || !usage) {
    return <div className="flex justify-center items-center h-64">Failed to load subscription data</div>
  }


  return (
    <div className="space-y-8">
      {/* Current Plan Overview */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-2">Subscription & Billing</h2>
        <p className="text-muted-foreground mb-6">Manage your subscription plan, billing, and payment methods.</p>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-xred-500" />
                Current Plan: {subscription.plan}
              </div>
              <Badge className={`${
                subscription.subscriptionStatus === "active" 
                  ? "bg-xred-100 text-xred-800 hover:bg-xred-100" 
                  : "bg-gray-100 text-gray-800 hover:bg-gray-100"
              }`}>
                {subscription.subscriptionStatus.charAt(0).toUpperCase() + subscription.subscriptionStatus.slice(1)}
              </Badge>
            </CardTitle>
            <CardDescription>
              ${subscription.amount / 100} {subscription.currency} / {billingCycle === "monthly" ? "month" : "year"} • 
              {subscription.nextPaymentDate ? ` Next billing: ${new Date(subscription.nextPaymentDate).toLocaleDateString()}` : " No upcoming billing"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium">Plan Features</h4>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500" />
                    Up to {subscription.subscriberLimit.toLocaleString()} subscribers
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500" />
                    {subscription.emailLimit.toLocaleString()} emails per month
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500" />
                    {subscription.campaignLimit.toLocaleString()} campaigns
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500" />
                    {subscription.appIntegratedLimit.toLocaleString()} app integrations
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500" />
                    {subscription.blogPostLimit.toLocaleString()} blog posts
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500" />
                    {subscription.aiGenerationLimit.toLocaleString()} AI generations
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="font-medium">Usage This Month</h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Subscribers</span>
                      <span>
                        {usage.subscribersAdded.toLocaleString()} / {subscription.subscriberLimit.toLocaleString()}
                      </span>
                    </div>
                    <Progress 
                      value={(usage.subscribersAdded / subscription.subscriberLimit) * 100} 
                      className="h-2" 
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Emails Sent</span>
                      <span>
                        {usage.emailsSent.toLocaleString()} / {subscription.emailLimit.toLocaleString()}
                      </span>
                    </div>
                    <Progress 
                      value={(usage.emailsSent / subscription.emailLimit) * 100} 
                      className="h-2" 
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Campaigns</span>
                      <span>
                        {usage.campaignsCreated.toLocaleString()} / {subscription.campaignLimit.toLocaleString()}
                      </span>
                    </div>
                    <Progress 
                      value={(usage.campaignsCreated / subscription.campaignLimit) * 100} 
                      className="h-2" 
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Integrations</span>
                      <span>
                        {usage.appIntegrated.toLocaleString()} / {subscription.appIntegratedLimit.toLocaleString()}
                      </span>
                    </div>
                    <Progress 
                      value={(usage.appIntegrated / subscription.appIntegratedLimit) * 100} 
                      className="h-2" 
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Plan Comparison */}
      <div>
  <div className="flex items-center justify-between mb-6">
    <h3 className="text-xl font-semibold">Available Plans</h3>
    <div className="flex items-center gap-4">
      <Label htmlFor="billing-toggle">Monthly</Label>
      <Switch
        id="billing-toggle"
        checked={billingCycle === "yearly"}
        onCheckedChange={(checked) => setBillingCycle(checked ? "yearly" : "monthly")}
      />
      <Label htmlFor="billing-toggle">
        Yearly{" "}
        <Badge variant="secondary" className="ml-1">
          Save 17%
        </Badge>
      </Label>
    </div>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {availablePlans.map((plan) => (
      <Card key={plan.id} className={`relative ${plan.popular ? "border-xred-500 shadow-lg" : ""}`}>
        {plan.popular && (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <Badge className="bg-red-500 hover:bg-red-500">Most Popular</Badge>
          </div>
        )}
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            {plan.name}
            {subscription.plan === plan.id && <Badge variant="outline">Current</Badge>}
          </CardTitle>
          <div className="text-3xl font-bold">
            N{plan.price[billingCycle]}
            <span className="text-lg font-normal text-muted-foreground">
              /{billingCycle === "monthly" ? "mo" : "yr"}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 mb-6">
            {plan.features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
          <Button
            className={`w-full ${
              subscription.plan === plan.id
                ? "bg-gray-100 text-black cursor-not-allowed"
                : "bg-black text-white hover:bg-red-600"
            }`}
            disabled={subscription.plan === plan.id || isLoading}
             onClick={() => handlePlanChange(plan.name as "FREE" | "LAUNCH" | "SCALE", billingCycle)}
          >
             {subscription.plan === plan.id ? "Current Plan" : `Switch to ${plan.name}`}
          </Button>
        </CardContent>
      </Card>
    ))}
  </div>
</div>




      {/* Billing History */}
      {
        billingHistory.length > 0 &&(
               <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Billing History
          </CardTitle>
          <CardDescription>View and download your past invoices.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {billingHistory.map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium">{invoice.description}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(invoice.date).toLocaleDateString()} • {invoice.id}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-medium">${invoice.amount.toFixed(2)} {subscription.currency}</div>
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{invoice.status}</Badge>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <a href={invoice.invoiceUrl} download>
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </a>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
              </Card>
                )
       }
   

      {/* Billing Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Billing Preferences</CardTitle>
          <CardDescription>Configure your billing and renewal settings.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="auto-renew" className="text-base font-medium">
                Auto-renewal
              </Label>
              <p className="text-sm text-muted-foreground">
                Automatically renew your subscription at the end of each billing period
              </p>
            </div>
            <Switch 
              id="auto-renew" 
              checked={autoRenew} 
              onCheckedChange={handleToggleAutoRenew}
              disabled={subscription.subscriptionStatus === "cancelled"}
            />
          </div>
         
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Usage alerts</Label>
              <p className="text-sm text-muted-foreground">Get notified when you&apos;re approaching your plan limits</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>These actions are irreversible. Please proceed with caution.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
            <div>
              <h4 className="font-medium">Cancel Subscription</h4>
              <p className="text-sm text-muted-foreground">
                Cancel your subscription. You&apos;ll retain access until the end of your billing period.
              </p>
            </div>
            <Button 
              variant="destructive" 
              onClick={handleCancelSubscription}
              disabled={subscription.subscriptionStatus === "cancelled" || isLoading}
            >
              {subscription.subscriptionStatus === "cancelled" ? "Cancellation Pending" : "Cancel Subscription"}
            </Button>
          </div>
          <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
            <div>
              <h4 className="font-medium">Delete Account</h4>
              <p className="text-sm text-muted-foreground">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
            </div>
            <Button variant="destructive">Delete Account</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


