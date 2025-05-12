'use client'

import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { acceptTermsAndPrivacy } from '@/actions/acceptTerms';
import toast from 'react-hot-toast';
import { useUser } from '@clerk/nextjs';

interface LegalDocument {
  title: string;
  sections: Array<{
    heading: string;
    content: string | React.ReactNode;
    listItems?: string[];
  }>;
}


type MembershipStatus = {
    termsAccepted: boolean;
  };
  
  interface LegalPageClientProps {
    membershipStatus: MembershipStatus | null;
  }

export default function LegalPage({membershipStatus}:LegalPageClientProps) {
  const [activeTab, setActiveTab] = useState('terms');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useUser();
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    if (membershipStatus?.termsAccepted) {
      setAgreedToTerms(true);
      setAgreedToPrivacy(true);
      setDisabled(true);
    }
  }, [membershipStatus]);

  const legalInfo: { [key: string]: LegalDocument } = {
    terms: {
        title: 'Terms and Conditions',
        sections: [
          {
            heading: '1. Introduction',
            content:
              'Welcome to TheNews, a service provided by SixthGrid. These Terms and Conditions govern your use of our email marketing platform, APIs, and related services. By accessing or using TheNews, you agree to be bound by these Terms.'
          },
          {
            heading: '2. Definitions',
            content:
              '“TheNews”, “We”, “Us”, or “Our” refers to the platform operated by SixthGrid. “You” refers to any user, individual, or organization using the platform. “Services” include all tools and APIs provided by TheNews.'
          },
          {
            heading: '3. Use of Services',
            content:
              'You may use TheNews to create, send, and manage email campaigns or integrate our APIs into your systems. You agree to use these services lawfully, without violating anti-spam laws, data regulations, or infringing on others’ rights.'
          },
          {
            heading: '4. User Accounts',
            content:
              'You must create an account to access certain features. You are responsible for maintaining the confidentiality of your credentials and all activities under your account.'
          },
          {
            heading: '5. Intellectual Property',
            content:
              'All content and software provided through TheNews are the property of SixthGrid and are protected under intellectual property laws. You may not copy, modify, or distribute any materials without permission.'
          },
          {
            heading: '6. Legal Ownership',
            content:
              'All services, trademarks, content, and data are owned and protected under the parent company, SixthGrid.'
          }
        ]
      },
      privacy: {
        title: 'Privacy Policy',
        sections: [
          {
            heading: '1. Introduction',
            content:
              'Your privacy is important to us. This policy explains how TheNews, a platform by SixthGrid, collects, uses, and protects your personal data.'
          },
          {
            heading: '2. Information We Collect',
            content:
              'We collect data such as name, email, campaign statistics, and IP addresses when you register, send newsletters, or use our APIs.'
          },
          {
            heading: '3. How We Use Your Information',
            content: 'Your information is used to perform the following actions:',
            listItems: [
              'Provide and improve TheNews services',
              'Offer customer support',
              'Send account updates and service messages',
              'Ensure legal compliance and system security'
            ]
          },
          {
            heading: '4. Data Sharing',
            content:
              'We do not sell your data. Information may be shared only with trusted partners for service delivery, or if required by law, under SixthGrid’s privacy safeguards.'
          }
        ]
      },
      cookies: {
        title: 'Cookies Policy',
        sections: [
          {
            heading: '1. What Are Cookies',
            content:
              'Cookies are small data files stored on your device to enhance your experience. They help us remember your preferences and login sessions.'
          },
          {
            heading: '2. Cookie Usage Details',
            content: 'Below are the specific ways we use cookies:',
            listItems: [
              'Track user behavior for analytics',
              'Store session data',
              'Improve service performance'
            ]
          },
          {
            heading: '3. Disabling Cookies',
            content:
              'You can disable cookies in your browser settings. However, doing so may limit functionality on our platform.'
          }
        ]
      },
      licensing: {
        title: 'Licensing Agreement',
        sections: [
          {
            heading: '1. Grant of License',
            content:
              'SixthGrid grants you a limited, non-transferable license to use TheNews for personal or commercial email marketing and API integration.'
          },
          {
            heading: '2. Restrictions',
            content:
              'You may not redistribute, resell, reverse-engineer, or tamper with any services or APIs provided by TheNews.'
          },
          {
            heading: '3. Ownership and Legal Protection',
            content:
              'All rights, ownership, and protections of TheNews are held by its parent company, SixthGrid. Unauthorized use or reproduction will be subject to legal action.'
          }
        ]
      }
  };

  interface HandleSubmitEvent extends React.FormEvent<HTMLFormElement> {}

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!user) {
        toast.error('Please login to accept our terms and conditions ')
        return
    }

    if (!agreedToTerms || !agreedToPrivacy) {
      alert('Please agree to all terms to continue.');
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await acceptTermsAndPrivacy(); 
      toast.success('Thank you for agreeing to our legal terms!')
    //   alert('Thank you for agreeing to our legal terms!');
      console.log('Updated Membership:', result);
    } catch (error) {
      console.error('Failed to accept terms:', error);
      toast.error('There was an error updating your agreement. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-black text-white py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-gold-500">Legal Agreements</h1>
          <p className="mt-2">Please review and agree to the following legal documents</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {['terms', 'privacy', 'cookies', 'licensing'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-6 font-medium text-sm ${
                  activeTab === tab
                    ? 'border-b-2 border-gold-500 text-black'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {legalInfo[tab].title}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-8">
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h2 className="text-2xl font-bold text-black mb-4">
              {legalInfo[activeTab].title}
            </h2>
            {legalInfo[activeTab].sections.map((section, idx) => (
              <div key={idx} className="mb-6">
                <h3 className="text-xl font-semibold mb-2">{section.heading}</h3>
                <p className="mb-4">{section.content}</p>
                {section.listItems && (
                  <ul className="list-disc pl-6 mb-4">
                    {section.listItems.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
            {activeTab === 'terms' && (
              <div className="flex items-center mb-4">
                <input
                  id="agree-terms"
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={() => setAgreedToTerms(!agreedToTerms)}
                  className="h-4 w-4 text-gold-500 focus:ring-gold-500 border-gray-300 rounded"
                />
                <label htmlFor="agree-terms" className="ml-2 block text-sm text-gray-700">
                  I have read and agree to the Terms and Conditions
                </label>
              </div>
            )}
            {activeTab === 'privacy' && (
              <div className="flex items-center mb-4">
                <input
                  id="agree-privacy"
                  type="checkbox"
                  checked={agreedToPrivacy}
                  onChange={() => setAgreedToPrivacy(!agreedToPrivacy)}
                  className="h-4 w-4 text-gold-500 focus:ring-gold-500 border-gray-300 rounded"
                />
                <label htmlFor="agree-privacy" className="ml-2 block text-sm text-gray-700">
                  I have read and agree to the Privacy Policy
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={handleSubmit}
            className="bg-black hover:bg-gray-800 text-white font-bold py-3 px-8 rounded shadow-lg transition duration-300 border-2 border-gold-500"
          >
            Accept All Terms
          </button>
        </div>
      </main>
    </div>
  );
}
