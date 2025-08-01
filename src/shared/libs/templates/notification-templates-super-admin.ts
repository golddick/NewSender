
import { SystemNotificationCategory } from "@prisma/client";
import {
  Mail,
  Newspaper,
  BookOpen,
  CheckCircle,
  Shield,
  CreditCard,
  AlertCircle,
  Plug,
  Bell,
  Trophy,
} from "lucide-react";

type NotificationTemplate = {
  icon: React.ElementType;
  color: string;
  title: string;
  subtitle?: string;
  description: string;
  defaultContent: {
    title: string;
    body: string;
    cta: string;
    ctaUrl: string;
    features?: string[];
  };
};

export const notificationTemplates: Record<SystemNotificationCategory, NotificationTemplate> = {
  WELCOME: {
    icon: Mail,
    color: "bg-blue-100 text-blue-800",
    title: "Welcome Email",
    subtitle: "Welcome to Our Platform",
    description: "Welcome new users and help them get started.",
    defaultContent: {
      title: "Welcome to Our Platform!",
      body: "Thanks for signing up! Let's get you started with the best experience.",
      cta: "Go to Dashboard",
      ctaUrl: "/dashboard",
       features: [
        "Quick onboarding with step-by-step guidance",
        "Access to powerful tools for managing your account",
        "Dedicated support to help you succeed",
      ],
    },
     
  },
  NEWSLETTER: {
    icon: Newspaper,
    color: "bg-green-100 text-green-800",
    title: "Newsletter",
    description: "Send updates and news to your users.",
    defaultContent: {
      title: "Your Weekly Update",
      body: "Here are the latest updates and insights for you this week.",
      cta: "Read Now",
      ctaUrl: "/news",
    },
  },
  NEW_BLOG: {
    icon: BookOpen,
    color: "bg-purple-100 text-purple-800",
    title: "New Blog Post",
    description: "Notify users when a new blog post is published.",
    defaultContent: {
      title: "Check Out Our New Blog Post",
      body: "We’ve published a new blog post that you might find interesting.",
      cta: "Read Blog",
      ctaUrl: "/blog",
    },
  },
  BLOG_POST_ENAGEMENT: {
    icon: BookOpen,
    color: "bg-purple-100 text-purple-800",
    title: "New Blog Post",
    description: "Notify users when a new blog post is published.",
    defaultContent: {
      title: "Check Out Our New Blog Post",
      body: "We’ve published a new blog post that you might find interesting.",
      cta: "Read Blog",
      ctaUrl: "/blog",
    },
  },
  BLOG_APPROVAL: {
    icon: CheckCircle,
    color: "bg-yellow-100 text-yellow-800",
    title: "Blog Approval",
    description: "Notify authors when their blog post is approved.",
    defaultContent: {
      title: "Your Blog Has Been Approved",
      body: "Your recent blog submission has been reviewed and approved.",
      cta: "View Post",
      ctaUrl: "/blog/my-posts",
    },
  },
  NEW_KYC: {
    icon: Shield,
    color: "bg-indigo-100 text-indigo-800",
    title: "KYC Submission",
    description: "Notify users when they submit KYC details.",
    defaultContent: {
      title: "KYC Submission Received",
      body: "We've received your KYC details and are reviewing them.",
      cta: "View Status",
      ctaUrl: "/kyc",
    },
  },
  KYC_APPROVAL: {
    icon: CheckCircle,
    color: "bg-green-100 text-green-800",
    title: "KYC Approved",
    description: "Notify users when their KYC verification is approved.",
    defaultContent: {
      title: "KYC Verification Successful",
      body: "Your KYC has been successfully approved. You can now enjoy full access.",
      cta: "Go to Dashboard",
      ctaUrl: "/dashboard",
    },
  },
  PAYMENT_SUCCESS: {
    icon: CreditCard,
    color: "bg-pink-100 text-pink-800",
    title: "Payment Successful",
    description: "Notify users of successful payments.",
    defaultContent: {
      title: "Payment Confirmation",
      body: "Your payment has been successfully processed. Thank you!",
      cta: "View Receipt",
      ctaUrl: "/billing",
    },
  },
  CAMPAIGN_ALERT: {
    icon: Bell,
    color: "bg-red-100 text-red-800",
    title: "Campaign Alert",
    description: "Notify users of important campaign events.",
    defaultContent: {
      title: "Campaign Update",
      body: "There's an important update regarding your campaign.",
      cta: "View Campaign",
      ctaUrl: "/campaigns",
    },
  },
  SECURITY_ALERT: {
    icon: AlertCircle,
    color: "bg-orange-100 text-orange-800",
    title: "Security Alert",
    description: "Notify users of suspicious activities or breaches.",
    defaultContent: {
      title: "Security Alert",
      body: "We've detected suspicious activity in your account. Please review immediately.",
      cta: "Secure Account",
      ctaUrl: "/security",
    },
  },
  INTEGRATION_SUCCESS: {
    icon: Plug,
    color: "bg-teal-100 text-teal-800",
    title: "Integration Success",
    description: "Notify users when an integration is successfully completed.",
    defaultContent: {
      title: "Integration Successful",
      body: "Your integration has been successfully set up.",
      cta: "Manage Integrations",
      ctaUrl: "/integrations",
    },
  },
  SUBSCRIPTION_REMINDER: {
    icon: Bell,
    color: "bg-gray-100 text-gray-800",
    title: "Subscription Reminder",
    description: "Remind users about upcoming subscription renewals.",
    defaultContent: {
      title: "Subscription Renewal Reminder",
      body: "Your subscription is about to expire. Renew today to continue uninterrupted service.",
      cta: "Renew Now",
      ctaUrl: "/billing",
    },
  },
  ACHIEVEMENT: {
    icon: Trophy,
    color: "bg-yellow-200 text-yellow-800",
    title: "Achievement Unlocked",
    description: "Celebrate user achievements and milestones.",
    defaultContent: {
      title: "Congratulations!",
      body: "You've unlocked a new achievement. Keep up the great work!",
      cta: "View Achievement",
      ctaUrl: "/achievements",
    },
  },
};
