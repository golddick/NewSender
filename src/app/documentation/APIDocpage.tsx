


'use client'










import { useState } from 'react';
import { ChevronRight, ChevronDown, Copy, ExternalLink, Menu, X } from 'lucide-react';
import Header from '@/shared/widgets/header';
import { XFooter } from '@/shared/widgets/footer/footer';

export default function ApiDocumentation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('introduction');
  const [copiedStates, setCopiedStates] = useState({
    baseUrl: false,
    authHeader: false,
    addSubscriber: false,
    responseSuccess: false,
    responseError: false
  });

interface CopiedStates {
    baseUrl: boolean;
    authHeader: boolean;
    addSubscriber: boolean;
    responseSuccess: boolean;
    responseError: boolean;
}

const copyToClipboard = (text: string, key: keyof CopiedStates): void => {
    navigator.clipboard.writeText(text);
    setCopiedStates((prev: CopiedStates) => ({ ...prev, [key]: true }));
    setTimeout(() => {
        setCopiedStates((prev: CopiedStates) => ({ ...prev, [key]: false }));
    }, 2000);
};

  const codeSnippets = {
    baseUrl: "https://api.thenews.com/v1",
    authHeader: `// Include this header in all API requests
fetch('https://api.thenews.com/v1/subscribers', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'YOUR_API_KEY'
  },
  body: JSON.stringify(data)
})
`,
    addSubscriber: `
    
   fetch("https://yourdomain.com/api/subscribe", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "thenews-api-key": "YOUR_GENERATED_API_KEY",  // moved to header
  },
  body: JSON.stringify({
    email: "user@example.com"
  }),
})
  .then(async (response) => {
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || "Subscription failed");
    }
    return response.json();
  })
  .then((data) => {
    console.log("✅ Subscribed successfully:", data);
  })
  .catch((error) => {
    console.error("❌ Error subscribing:", error.message);
  });

  
`,
    responseSuccess: `
    {
  "_id": "6634f04fc98a8e01a2f1aeee",
  "email": "user@example.com",
  "newsLetterOwnerId": "user_abc123",
  "source": "By API Source",
  "status": "Subscribed",
  "createdAt": "2025-05-03T14:02:00.123Z",
  "updatedAt": "2025-05-03T14:02:00.123Z",
  "__v": 0
}

  `,
    responseError: `
    {
  "success": false,
  "message": "Invalid email address",
  "error": {
    "code": "INVALID_EMAIL",
    "details": "The email address provided is not valid"
  }
}

  `
  };

interface ScrollToSectionProps {
    sectionId: string;
}

const scrollToSection = ({ sectionId }: ScrollToSectionProps): void => {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
    setActiveTab(sectionId);
    if (isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
    }
};

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
      {/* Header */}

       <Header />



      <div className="flex flex-col md:flex-row flex-1">
        {/* Sidebar */}
        <aside className="bg-gray-100 w-full md:w-64 p-4 md:p-6 md:fixed md:h-screen md:left-0 z-10">
          <div className="mb-6">
            <h2 className="font-bold text-lg mb-2">Documentation</h2>
            <p className="text-sm text-gray-600">theNews API v0.1 <span className=' text-gold-700 bg-gold-100 p-1 rounded-md text-xs'>BETA</span></p>
          </div>
          
          <nav className="space-y-1">
            <button 
              onClick={() => scrollToSection({ sectionId: 'introduction' })}
              className={`w-full text-left p-2 rounded-md ${activeTab === 'introduction' ? 'bg-amber-100 text-amber-800' : 'hover:bg-gray-200'}`}
            >
              Introduction
            </button>
            <button 
              onClick={() => scrollToSection({ sectionId: 'authentication' })}
              className={`w-full text-left p-2 rounded-md ${activeTab === 'authentication' ? 'bg-amber-100 text-amber-800' : 'hover:bg-gray-200'}`}
            >
              Authentication
            </button>
            <button 
              onClick={() => scrollToSection({ sectionId: 'add-subscriber' })}
              className={`w-full text-left p-2 rounded-md ${activeTab === 'add-subscriber' ? 'bg-amber-100 text-amber-800' : 'hover:bg-gray-200'}`}
            >
              Add Subscriber
            </button>
            <button 
              onClick={() => scrollToSection({ sectionId: 'error-handling' })}
              className={`w-full text-left p-2 rounded-md ${activeTab === 'error-handling' ? 'bg-amber-100 text-amber-800' : 'hover:bg-gray-200'}`}
            >
              Error Handling
            </button>
            <button 
              onClick={() => scrollToSection({ sectionId: 'rate-limits' })}
              className={`w-full text-left p-2 rounded-md ${activeTab === 'rate-limits' ? 'bg-amber-100 text-amber-800' : 'hover:bg-gray-200'}`}
            >
              Rate Limits
            </button>
          </nav>

          <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <h3 className="font-bold text-amber-800 mb-2">Need Help?</h3>
            <p className="text-sm mb-4">Our support team is here to help with any questions.</p>
            <button className="w-full bg-amber-400 hover:bg-amber-500 text-black font-medium py-2 px-4 rounded-md transition-colors flex items-center justify-center">
              Contact Support <ExternalLink size={16} className="ml-1" />
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto md:ml-64">
          <section id="introduction" className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Introduction</h2>
            <p className="mb-4">Welcome to theNews API documentation. Our API enables developers to integrate email newsletter functionality directly into their applications.</p>
            <p className="mb-6">Currently, we offer the ability to add subscribers to your newsletter lists. More features will be added soon.</p>
            
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-3">Base URL</h3>
              <div className="bg-black rounded-md">
                <div className="flex justify-between items-center px-4 py-2 border-b border-gray-700">
                  <span className="text-white">API Base URL</span>
                  <button 
                    onClick={() => copyToClipboard(codeSnippets.baseUrl, 'baseUrl')}
                    className="text-gray-400 hover:text-white"
                  >
                    {copiedStates.baseUrl ? 'Copied!' : <Copy size={16} />}
                  </button>
                </div>
                <pre className="p-4 text-amber-400 overflow-x-auto scrollbar-thin">
                  {codeSnippets.baseUrl}
                </pre>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-3">Getting Started</h3>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Sign up for theNews account</li>
                <li>Navigate to the API section in your dashboard</li>
                <li>Generate your API key</li>
                <li>Start making API requests</li>
              </ol>
            </div>
          </section>
          
          <section id="authentication" className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Authentication</h2>
            <p className="mb-6">All API requests require authentication using your API key. You can find your API key in the Dashboard under API Settings.</p>
            
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-3">API Key Authentication</h3>
              <p className="mb-4">Include your API key in the header of all requests:</p>
              
              <div className="bg-black rounded-md">
                <div className="flex justify-between items-center px-4 py-2 border-b border-gray-700">
                  <span className="text-white">Authentication Header</span>
                  <button 
                    onClick={() => copyToClipboard(codeSnippets.authHeader, 'authHeader')}
                    className="text-gray-400 hover:text-white"
                  >
                    {copiedStates.authHeader ? 'Copied!' : <Copy size={16} />}
                  </button>
                </div>
                <pre className="p-4 text-green-400 overflow-x-auto scrollbar-thin">
                  {codeSnippets.authHeader}
                </pre>
              </div>
            </div>
          </section>
          
          <section id="add-subscriber" className="mb-12">
  <h2 className="text-2xl font-bold mb-4">Add Subscriber</h2>
  <p className="mb-6">Add a new subscriber to your newsletter list using your API key.</p>

  <div className="mb-6">
    <h3 className="text-lg font-semibold mb-2">HTTP Request</h3>
    <div className="flex bg-gray-800 text-white p-2 rounded-md mb-2">
      <span className="bg-green-600 px-2 py-1 rounded mr-2">POST</span>
      <code>/api/subscribe</code>
    </div>
  </div>

  <div className="mb-6">
    <h3 className="text-lg font-semibold mb-2">Headers</h3>
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-md">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4 border-b text-left">Header</th>
            <th className="py-2 px-4 border-b text-left">Required</th>
            <th className="py-2 px-4 border-b text-left">Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="py-2 px-4 border-b">TheNews-api-key</td>
            <td className="py-2 px-4 border-b">Yes</td>
            <td className="py-2 px-4 border-b">Your JWT-based API key used for authentication</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <div className="mb-6">
    <h3 className="text-lg font-semibold mb-2">Request Body</h3>
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-md">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4 border-b text-left">Parameter</th>
            <th className="py-2 px-4 border-b text-left">Type</th>
            <th className="py-2 px-4 border-b text-left">Required</th>
            <th className="py-2 px-4 border-b text-left">Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="py-2 px-4 border-b">email</td>
            <td className="py-2 px-4 border-b">String</td>
            <td className="py-2 px-4 border-b">Yes</td>
            <td className="py-2 px-4 border-b">Email address of the subscriber</td>
          </tr>
          <tr>
            <td className="py-2 px-4 border-b">source</td>
            <td className="py-2 px-4 border-b">String</td>
            <td className="py-2 px-4 border-b">No</td>
            <td className="py-2 px-4 border-b">The source of the subscription (default: &quot;By API&quot;)</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <div className="mb-6">
    <h3 className="text-lg font-semibold mb-2">Example Request</h3>
    <div className="bg-black rounded-md">
      <div className="flex justify-between items-center px-4 py-2 border-b border-gray-700">
        <span className="text-white">JavaScript</span>
        <button 
          onClick={() => copyToClipboard(codeSnippets.addSubscriber, 'addSubscriber')}
          className="text-gray-400 hover:text-white"
        >
          {copiedStates.addSubscriber ? 'Copied!' : <Copy size={16} />}
        </button>
      </div>
      <pre className="p-4 text-green-400 overflow-x-auto scrollbar-thin">
        {codeSnippets.addSubscriber}
      </pre>
    </div>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div className=' w-full'>
      <h3 className="text-lg font-semibold mb-2">Success Response (200 OK)</h3>
      <div className="bg-black rounded-md">
        <div className="flex justify-between items-center px-4 py-2 border-b border-gray-700">
          <span className="text-white">Response</span>
          <button 
            onClick={() => copyToClipboard(codeSnippets.responseSuccess, 'responseSuccess')}
            className="text-gray-400 hover:text-white"
          >
            {copiedStates.responseSuccess ? 'Copied!' : <Copy size={16} />}
          </button>
        </div>
        <pre className="p-4 text-blue-400 overflow-x-auto scrollbar-thin">
          {codeSnippets.responseSuccess}
        </pre>
            </div>
      </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Error Response (400+)</h3>
            <div className="bg-black rounded-md">
              <div className="flex justify-between items-center px-4 py-2 border-b border-gray-700">
                <span className="text-white">Response</span>
                <button 
                  onClick={() => copyToClipboard(codeSnippets.responseError, 'responseError')}
                  className="text-gray-400 hover:text-white"
                >
                  {copiedStates.responseError ? 'Copied!' : <Copy size={16} />}
                </button>
              </div>
              <pre className="p-4 text-red-400 overflow-x-auto scrollbar-thin">
                {codeSnippets.responseError}
              </pre>
            </div>
          </div>

        </div>
          </section>

          
          <section id="error-handling" className="mb-12">
  <h2 className="text-2xl font-bold mb-4">Error Handling</h2>
  <p className="mb-6">
    The <code>/api/subscribe</code> endpoint uses standard HTTP response codes to indicate the success or failure of a request. Below are the possible response codes and their meanings.
  </p>

  <div className="overflow-x-auto">
    <table className="min-w-full bg-white border border-gray-200 rounded-md">
      <thead className="bg-gray-100">
        <tr>
          <th className="py-2 px-4 border-b text-left">Code</th>
          <th className="py-2 px-4 border-b text-left">Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="py-2 px-4 border-b">200 - OK</td>
          <td className="py-2 px-4 border-b">The subscriber was successfully created.</td>
        </tr>
        <tr>
          <td className="py-2 px-4 border-b">400 - Bad Request</td>
          <td className="py-2 px-4 border-b">Missing or invalid fields in the request (e.g., email not provided or invalid format).</td>
        </tr>
        <tr>
          <td className="py-2 px-4 border-b">401 - Unauthorized</td>
          <td className="py-2 px-4 border-b">The API key is missing, invalid, or the token is malformed.</td>
        </tr>
        <tr>
          <td className="py-2 px-4 border-b">403 - Forbidden</td>
          <td className="py-2 px-4 border-b">The API key is valid but the user has reached their monthly subscriber limit based on plan.</td>
        </tr>
        <tr>
          <td className="py-2 px-4 border-b">404 - Not Found</td>
          <td className="py-2 px-4 border-b">The membership for the authenticated user was not found.</td>
        </tr>
        <tr>
          <td className="py-2 px-4 border-b">409 - Conflict</td>
          <td className="py-2 px-4 border-b">The email address already exists in the subscriber list.</td>
        </tr>
        <tr>
          <td className="py-2 px-4 border-b">429 - Too Many Requests</td>
          <td className="py-2 px-4 border-b">The hourly limit for adding subscribers has been exceeded based on the user&lsquo;s plan.</td>
        </tr>
        <tr>
          <td className="py-2 px-4 border-b">500 - Server Error</td>
          <td className="py-2 px-4 border-b">An unexpected server error occurred. Please try again later.</td>
        </tr>
      </tbody>
    </table>
  </div>
          </section>

          
          <section id="rate-limits" className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Rate Limits</h2>
          <p className="mb-4">
            The <code>/api/subscribe</code> endpoint applies rate limits based on your subscription plan. These limits control how many subscribers you can add per hour to prevent abuse and ensure platform stability.
          </p>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-md">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 border-b text-left">Plan</th>
                  <th className="py-2 px-4 border-b text-left">Subscriber Limit / Hour</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-2 px-4 border-b">Free</td>
                  <td className="py-2 px-4 border-b">10 subscribers</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b">Lunch</td>
                  <td className="py-2 px-4 border-b">100 subscribers</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b">Scale</td>
                  <td className="py-2 px-4 border-b">1,000 subscribers</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-6 bg-amber-50 border border-amber-200 p-4 rounded-md">
            <div className="flex items-start">
              <div className="mr-3 mt-1 text-amber-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-amber-800">Note</h4>
                <p className="text-amber-700">
                  If you exceed your hourly rate limit, the API will respond with a <code>429 Too Many Requests</code> status code. You should implement an appropriate retry or backoff strategy in your client application.
                </p>
              </div>
            </div>
          </div>
          </section>


            {/* Footer */}
      <XFooter />
        </main>
      </div>
      
    
    </div>
  );
}