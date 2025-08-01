
import { NewsletterOwnerNotificationCategory } from "@prisma/client";
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

export const notificationTemplates: Record<NewsletterOwnerNotificationCategory, NotificationTemplate> = {
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
 
  
 

};
