
import { $Enums, NewsletterOwnerNotificationCategory } from "@prisma/client";
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
    featuredImage?: string;
    details?:  Record<string, string>;
  };
};

export const notificationTemplates: Record<$Enums.NewsletterOwnerNotificationCategory, NotificationTemplate> = {
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
        "Dedicated support to help you succeed"
      ],
      details: {
        "Support Email": "support@thenews.com",
        "Help Center": "https://thenews.com/help",
        "Welcome Guide": "https://thenews.com/welcome-guide"
      },
      featuredImage: "https://deg9tan1ik.ufs.sh/f/1WGKJuv35CFkBNs0wB1JWPFR0NQxC4zpoyu2aGBVSvd9kj63",
    }
  },
  NEWSLETTER: {
    icon: Newspaper,
    color: "bg-green-100 text-green-800",
    title: "Newsletter",
    subtitle: "Hello and Welcome",
    description: "Send confirmation mail and welcome new subscribers.",
    defaultContent: {
      title: "Your Weekly Update",
      body: "Welcome to our newsletter! Whether you're here for updates, inspiration, or exclusive content, we've got something for you.",
      cta: "Explore",
      ctaUrl: "/news",
      features: [
        "Personalized recommendations",
        "Weekly industry updates",
        "Access to exclusive events",
      ],
      featuredImage: "https://deg9tan1ik.ufs.sh/f/1WGKJuv35CFkBNs0wB1JWPFR0NQxC4zpoyu2aGBVSvd9kj63",
    },
  },
  NEW_BLOG: {
    icon: BookOpen,
    color: "bg-purple-100 text-purple-800",
    title: "New Blog Post",
    description: "Notify users when a new blog post is published.",
    defaultContent: {
      title: "Check Out Our New Blog Post",
      body: "We’ve just published a new blog article you might find interesting.",
      cta: "Read Blog",
      ctaUrl: "/blog",
      featuredImage: "https://deg9tan1ik.ufs.sh/f/1WGKJuv35CFkBNs0wB1JWPFR0NQxC4zpoyu2aGBVSvd9kj63",
    },
  },
  KYC_APPROVAL: {
    icon: Shield,
    color: "bg-indigo-100 text-indigo-800",
    title: "KYC Approved",
    description: "Notify users when their KYC is approved.",
    defaultContent: {
      title: "Your KYC Has Been Approved",
      body: "Congratulations! Your KYC verification was successful.",
      cta: "Go to Dashboard",
      ctaUrl: "/dashboard",
    },
  },
  FLAGGED: {
    icon: AlertCircle,
    color: "bg-red-100 text-red-800",
    title: "Flagged Content",
    description: "Notify when content is flagged for review.",
    defaultContent: {
      title: "Content Flagged",
      body: "Your content has been flagged for review. Please check your dashboard.",
      cta: "Review Content",
      ctaUrl: "/dashboard/flags",
    },
  },
  FLAGGED_RESOLVED: {
    icon: CheckCircle,
    color: "bg-green-100 text-green-800",
    title: "Flag Resolved",
    description: "Notify when flagged content is resolved.",
    defaultContent: {
      title: "Content Issue Resolved",
      body: "Good news! The issue with your flagged content has been resolved.",
      cta: "View Content",
      ctaUrl: "/dashboard/content",
    },
  },
};
