'use client';

import { useState } from 'react';
import { CodeTabs } from '../code-tabs';
import { Copy } from 'lucide-react';

export function QuickQuickstart() {
  const javascriptCode = `// Quick start example
const apiKey = 'your_api_key_here';

// 1. Add a new subscriber
async function addSubscriber() {
  try {
    const response = await fetch('https://api.thenews.sixthgrid.com/v1/api/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': \`Bearer \${apiKey}\`
      },
      body: JSON.stringify({
        email: 'new.subscriber@example.com',
        name: 'Jane Smith',
        categoryId: 'your_category_id_here', // ✅ Required: specify newsletter category
        metadata: {
          campaign: "thenews website landing page",
          pageUrl: '',
          formId: "TheNews website general sub page",
        },
      })
    });

    const data = await response.json();

    if (response.ok) {
      console.log('Subscriber added successfully:', data);
    } else {
      console.error('Error adding subscriber:', data);
    }
  } catch (error) {
    console.error('Network error:', error);
  }
}

addSubscriber();`;

  const typescriptCode = `// Quick start example
const apiKey: string = 'your_api_key_here';

interface SubscriberMetadata {
 campaign:string;
  pageUrl: string;
  formId: string;
}

interface SubscribeRequest {
  email: string;
  name: string;
  categoryId: string; // ✅ Required
  metadata?: SubscriberMetadata;
}

interface SubscribeResponse {
  id: string;
  email: string;
  name: string;
  categoryId: string;
  metadata: SubscriberMetadata;
  created_at: string;
}

async function addSubscriber(): Promise<void> {
  try {
    const subscribeData: SubscribeRequest = {
      email: 'new.subscriber@example.com',
      name: 'Jane Smith',
      categoryId: 'your_category_id_here', // ✅ Required: specify newsletter category
      metadata: {
          campaign: "thenews website landing page",
          pageUrl: '',
          formId: "TheNews website general sub page",
        },
    };

    const response = await fetch('https://api.thenews.sixthgrid.com/v1/api/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': \`Bearer \${apiKey}\`
      },
      body: JSON.stringify(subscribeData)
    });

    const data = await response.json();

    if (response.ok) {
      const subscriber = data as SubscribeResponse;
      console.log('Subscriber added successfully:', subscriber);
    } else {
      console.error('Error adding subscriber:', data);
    }
  } catch (error) {
    console.error('Network error:', error);
  }
}

addSubscriber();`;

  const [copied, setCopied] = useState(false);
  const baseUrl = 'https://thenews.africa/api/';

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold tracking-tight text-black">Quick Start</h1>

      <div className="prose prose-gray max-w-none">
        <p>
          This guide will help you get started with the TheNews API quickly. We&apos;ll walk through the basic steps to add a new subscriber to your newsletter.
        </p>

        <h2>Prerequisites</h2>
        <ol>
          <li>
            Create a TheNews account at{' '}
            <a href="https://thenews.africa/sign-up" className="text-red-700 hover:text-amber-800">
              https://thenews.africa/sign-up
            </a>
          </li>
          <li>Obtain your API key from the dashboard.</li>
        </ol>

        <h2>Step 1: Set Up Your Environment</h2>
        <p>Make sure you have your API key ready. You&apos;ll need to include it in all requests.</p>

        <h2>Step 2: Add a Subscriber</h2>
        <p>
          Use the <code>/api/subscribe</code> endpoint to add a user to your list.
        </p>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md mt-4">
          <strong className="text-yellow-800">📌 Note:</strong>
          <p className="text-yellow-700 text-sm mt-1">
            Every subscriber must be linked to a newsletter category using a valid <code>categoryId</code>. 
            Create and manage categories via your{' '}
            <a
              href="https://thenews.sixthgrid.com/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-600 underline"
            >
              TheNews Dashboard
            </a>.
          </p>
        </div>
      </div>

      <CodeTabs javascript={javascriptCode} typescript={typescriptCode} title="Adding a Subscriber" />

      <div className="prose prose-gray max-w-none">
        <h2>Step 3: Verify the Response</h2>
        <p>If successful, you should get a response like this:</p>

        <pre className="bg-gray-100 p-3 rounded-md overflow-x-auto text-sm">
          <code>{`{
  "id": "sub_1234567890",
  "email": "new.subscriber@example.com",
  "name": "Jane Smith",
  "categoryId": "your_category_id_here",
  "preferences": {
    "newsletter_frequency": "weekly",
    "topics": ["technology", "marketing"]
  },
  "created_at": "2023-05-01T12:00:00Z"
}`}</code>
        </pre>

        {/* <h2>Next Steps</h2>
        <ul>
          <li>
            Explore the full{' '}
            <a href="/docs/api/subscribe" className="text-amber-600 hover:text-amber-800">
              Subscribe API documentation
            </a>
          </li>
          <li>
            Use the{' '}
            <a href="/docs/sdk" className="text-amber-600 hover:text-amber-800">
              JavaScript SDK
            </a>{' '}
            for smoother integration
          </li>
          <li>
            Learn about{' '}
            <a href="/docs/rate-limits" className="text-amber-600 hover:text-amber-800">
              rate limits
            </a>{' '}
            and best practices
          </li>
        </ul> */}

        <h2>API Base URL</h2>
        <div className="bg-black rounded-md overflow-hidden">
          <div className="flex justify-between items-center px-4 py-2 border-b border-gray-700">
            <span className="text-white text-sm">API Base URL</span>
            <button
              onClick={() => copyToClipboard(baseUrl)}
              className="text-gray-400 hover:text-white text-sm flex items-center gap-1"
            >
              {copied ? 'Copied!' : <Copy size={16} />}
            </button>
          </div>
          <pre className="p-4 text-amber-400 text-sm overflow-x-auto">{baseUrl}</pre>
        </div>
      </div>
    </div>
  );
}
