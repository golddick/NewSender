import { CodeTabs } from "../code-tabs"

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
        preferences: {
          newsletter_frequency: 'weekly',
          topics: ['technology', 'marketing']
        }
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

// Call the function
addSubscriber();`

  const typescriptCode = `// Quick start example
const apiKey: string = 'your_api_key_here';

interface SubscriberPreferences {
  newsletter_frequency: 'daily' | 'weekly' | 'monthly';
  topics: string[];
}

interface SubscribeRequest {
  email: string;
  name: string;
  preferences?: SubscriberPreferences;
}

interface SubscribeResponse {
  id: string;
  email: string;
  name: string;
  preferences: SubscriberPreferences;
  created_at: string;
}

// 1. Add a new subscriber
async function addSubscriber(): Promise<void> {
  try {
    const subscribeData: SubscribeRequest = {
      email: 'new.subscriber@example.com',
      name: 'Jane Smith',
      preferences: {
        newsletter_frequency: 'weekly',
        topics: ['technology', 'marketing']
      }
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

// Call the function
addSubscriber();`

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-black">Quick Start</h1>

      <div className="prose prose-gray max-w-none">
        <p>
          This guide will help you get started with the TheNews API quickly. We&apos;ll walk through the basic steps to add a
          new subscriber to your newsletter.
        </p>

        <h2>Prerequisites</h2>
        <ol>
          <li>
            Create a TheNews account at{" "}
            <a href="https://thenews.sixthgrid.com/signup" className="text-amber-600 hover:text-amber-800">
              https://thenews.sixthgrid.com/signup
            </a>
          </li>
          <li>Obtain your API key from the dashboard</li>
        </ol>

        <h2>Step 1: Set Up Your Environment</h2>
        <p>First, make sure you have your API key ready. You&apos;ll need to include it in all API requests.</p>

        <h2>Step 2: Make Your First API Request</h2>
        <p>
          Let&apos;s add a new subscriber to your newsletter list. This is done using the <code>/api/subscribe</code>{" "}
          endpoint.
        </p>
      </div>

      <CodeTabs javascript={javascriptCode} typescript={typescriptCode} title="Adding a Subscriber" />

      <div className="prose prose-gray max-w-none">
        <h2>Step 3: Verify the Response</h2>
        <p>If successful, you should receive a response similar to:</p>
        <pre className="bg-gray-100 p-3 rounded-md">
          <code>{`{
  "id": "sub_1234567890",
  "email": "new.subscriber@example.com",
  "name": "Jane Smith",
  "preferences": {
    "newsletter_frequency": "weekly",
    "topics": ["technology", "marketing"]
  },
  "created_at": "2023-05-01T12:00:00Z"
}`}</code>
        </pre>

        <h2>Next Steps</h2>
        <p>Now that you&apos;ve successfully added a subscriber, you can explore other API endpoints:</p>
        <ul>
          <li>
            Explore the{" "}
            <a href="#subscribe" className="text-amber-600 hover:text-amber-800">
              Subscribe API
            </a>{" "}
            in more detail
          </li>
          <li>
            Check out our{" "}
            <a href="#javascript" className="text-amber-600 hover:text-amber-800">
              JavaScript SDK
            </a>{" "}
            for easier integration
          </li>
          <li>
            Learn about{" "}
            <a href="#rate-limits" className="text-amber-600 hover:text-amber-800">
              Rate Limits
            </a>{" "}
            to ensure your application runs smoothly
          </li>
        </ul>
      </div>
    </div>
  )
}
