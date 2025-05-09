


// 'use client'










// import { useState } from 'react';
// import { ChevronRight, ChevronDown, Copy, ExternalLink, Menu, X } from 'lucide-react';
// import Header from '@/shared/widgets/header';
// import { XFooter } from '@/shared/widgets/footer/footer';

// export default function ApiDocumentation() {
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [activeTab, setActiveTab] = useState('introduction');
//   const [copiedStates, setCopiedStates] = useState({
//     baseUrl: false,
//     authHeader: false,
//     addSubscriber: false,
//     responseSuccess: false,
//     responseError: false
//   });

// interface CopiedStates {
//     baseUrl: boolean;
//     authHeader: boolean;
//     addSubscriber: boolean;
//     responseSuccess: boolean;
//     responseError: boolean;
// }

// const copyToClipboard = (text: string, key: keyof CopiedStates): void => {
//     navigator.clipboard.writeText(text);
//     setCopiedStates((prev: CopiedStates) => ({ ...prev, [key]: true }));
//     setTimeout(() => {
//         setCopiedStates((prev: CopiedStates) => ({ ...prev, [key]: false }));
//     }, 2000);
// };

//   const codeSnippets = {
//     baseUrl: "https://api.thenews.com/v1",
//     authHeader: `// Include this header in all API requests
// fetch('https://api.thenews.com/v1/subscribers', {
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json',
//     'X-API-Key': 'YOUR_API_KEY'
//   },
//   body: JSON.stringify(data)
// })
// `,
//     addSubscriber: `
    
//    fetch("https://yourdomain.com/api/subscribe", {
//   method: "POST",
//   headers: {
//     "Content-Type": "application/json",
//     "thenews-api-key": "YOUR_GENERATED_API_KEY",  // moved to header
//   },
//   body: JSON.stringify({
//     email: "user@example.com"
//   }),
// })
//   .then(async (response) => {
//     if (!response.ok) {
//       const err = await response.json();
//       throw new Error(err.error || "Subscription failed");
//     }
//     return response.json();
//   })
//   .then((data) => {
//     console.log("✅ Subscribed successfully:", data);
//   })
//   .catch((error) => {
//     console.error("❌ Error subscribing:", error.message);
//   });

  
// `,
//     responseSuccess: `
//     {
//   "_id": "6634f04fc98a8e01a2f1aeee",
//   "email": "user@example.com",
//   "newsLetterOwnerId": "user_abc123",
//   "source": "By API Source",
//   "status": "Subscribed",
//   "createdAt": "2025-05-03T14:02:00.123Z",
//   "updatedAt": "2025-05-03T14:02:00.123Z",
//   "__v": 0
// }

//   `,
//     responseError: `
//     {
//   "success": false,
//   "message": "Invalid email address",
//   "error": {
//     "code": "INVALID_EMAIL",
//     "details": "The email address provided is not valid"
//   }
// }

//   `
//   };

// interface ScrollToSectionProps {
//     sectionId: string;
// }

// const scrollToSection = ({ sectionId }: ScrollToSectionProps): void => {
//     const element = document.getElementById(sectionId);
//     if (element) {
//         element.scrollIntoView({ behavior: 'smooth' });
//     }
//     setActiveTab(sectionId);
//     if (isMobileMenuOpen) {
//         setIsMobileMenuOpen(false);
//     }
// };

//   return (
//     <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
//       {/* Header */}

//        <Header />



//       <div className="flex flex-col md:flex-row flex-1">
//         {/* Sidebar */}
//         <aside className="bg-gray-100 w-full md:w-64 p-4 md:p-6 md:fixed md:h-screen md:left-0 z-10">
//           <div className="mb-6">
//             <h2 className="font-bold text-lg mb-2">Documentation</h2>
//             <p className="text-sm text-gray-600">theNews API v0.1 <span className=' text-gold-700 bg-gold-100 p-1 rounded-md text-xs'>BETA</span></p>
//           </div>
          
//           <nav className="space-y-1">
//             <button 
//               onClick={() => scrollToSection({ sectionId: 'introduction' })}
//               className={`w-full text-left p-2 rounded-md ${activeTab === 'introduction' ? 'bg-amber-100 text-amber-800' : 'hover:bg-gray-200'}`}
//             >
//               Introduction
//             </button>
//             <button 
//               onClick={() => scrollToSection({ sectionId: 'authentication' })}
//               className={`w-full text-left p-2 rounded-md ${activeTab === 'authentication' ? 'bg-amber-100 text-amber-800' : 'hover:bg-gray-200'}`}
//             >
//               Authentication
//             </button>
//             <button 
//               onClick={() => scrollToSection({ sectionId: 'add-subscriber' })}
//               className={`w-full text-left p-2 rounded-md ${activeTab === 'add-subscriber' ? 'bg-amber-100 text-amber-800' : 'hover:bg-gray-200'}`}
//             >
//               Add Subscriber
//             </button>
//             <button 
//               onClick={() => scrollToSection({ sectionId: 'error-handling' })}
//               className={`w-full text-left p-2 rounded-md ${activeTab === 'error-handling' ? 'bg-amber-100 text-amber-800' : 'hover:bg-gray-200'}`}
//             >
//               Error Handling
//             </button>
//             <button 
//               onClick={() => scrollToSection({ sectionId: 'rate-limits' })}
//               className={`w-full text-left p-2 rounded-md ${activeTab === 'rate-limits' ? 'bg-amber-100 text-amber-800' : 'hover:bg-gray-200'}`}
//             >
//               Rate Limits
//             </button>
//           </nav>

//           <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
//             <h3 className="font-bold text-amber-800 mb-2">Need Help?</h3>
//             <p className="text-sm mb-4">Our support team is here to help with any questions.</p>
//             <button className="w-full bg-amber-400 hover:bg-amber-500 text-black font-medium py-2 px-4 rounded-md transition-colors flex items-center justify-center">
//               Contact Support <ExternalLink size={16} className="ml-1" />
//             </button>
//           </div>
//         </aside>

//         {/* Main content */}
//         <main className="flex-1 p-4 md:p-8 overflow-y-auto md:ml-64">
//           <section id="introduction" className="mb-12">
//             <h2 className="text-2xl font-bold mb-4">Introduction</h2>
//             <p className="mb-4">Welcome to theNews API documentation. Our API enables developers to integrate email newsletter functionality directly into their applications.</p>
//             <p className="mb-6">Currently, we offer the ability to add subscribers to your newsletter lists. More features will be added soon.</p>
            
//             <div className="mb-8">
//               <h3 className="text-xl font-semibold mb-3">Base URL</h3>
            //   <div className="bg-black rounded-md">
            //     <div className="flex justify-between items-center px-4 py-2 border-b border-gray-700">
            //       <span className="text-white">API Base URL</span>
            //       <button 
            //         onClick={() => copyToClipboard(codeSnippets.baseUrl, 'baseUrl')}
            //         className="text-gray-400 hover:text-white"
            //       >
            //         {copiedStates.baseUrl ? 'Copied!' : <Copy size={16} />}
            //       </button>
            //     </div>
            //     <pre className="p-4 text-amber-400 overflow-x-auto scrollbar-thin">
            //       {codeSnippets.baseUrl}
            //     </pre>
            //   </div>
            // </div>
            
//             <div>
//               <h3 className="text-xl font-semibold mb-3">Getting Started</h3>
//               <ol className="list-decimal pl-5 space-y-2">
//                 <li>Sign up for theNews account</li>
//                 <li>Navigate to the API section in your dashboard</li>
//                 <li>Generate your API key</li>
//                 <li>Start making API requests</li>
//               </ol>
//             </div>
//           </section>
          
//           <section id="authentication" className="mb-12">
//             <h2 className="text-2xl font-bold mb-4">Authentication</h2>
//             <p className="mb-6">All API requests require authentication using your API key. You can find your API key in the Dashboard under API Settings.</p>
            
//             <div className="mb-8">
//               <h3 className="text-xl font-semibold mb-3">API Key Authentication</h3>
//               <p className="mb-4">Include your API key in the header of all requests:</p>
              
//               <div className="bg-black rounded-md">
//                 <div className="flex justify-between items-center px-4 py-2 border-b border-gray-700">
//                   <span className="text-white">Authentication Header</span>
//                   <button 
//                     onClick={() => copyToClipboard(codeSnippets.authHeader, 'authHeader')}
//                     className="text-gray-400 hover:text-white"
//                   >
//                     {copiedStates.authHeader ? 'Copied!' : <Copy size={16} />}
//                   </button>
//                 </div>
//                 <pre className="p-4 text-green-400 overflow-x-auto scrollbar-thin">
//                   {codeSnippets.authHeader}
//                 </pre>
//               </div>
//             </div>
//           </section>
          
//           <section id="add-subscriber" className="mb-12">
//   <h2 className="text-2xl font-bold mb-4">Add Subscriber</h2>
//   <p className="mb-6">Add a new subscriber to your newsletter list using your API key.</p>

//   <div className="mb-6">
//     <h3 className="text-lg font-semibold mb-2">HTTP Request</h3>
//     <div className="flex bg-gray-800 text-white p-2 rounded-md mb-2">
//       <span className="bg-green-600 px-2 py-1 rounded mr-2">POST</span>
//       <code>/api/subscribe</code>
//     </div>
//   </div>

//   <div className="mb-6">
//     <h3 className="text-lg font-semibold mb-2">Headers</h3>
//     <div className="overflow-x-auto">
//       <table className="min-w-full bg-white border border-gray-200 rounded-md">
//         <thead className="bg-gray-100">
//           <tr>
//             <th className="py-2 px-4 border-b text-left">Header</th>
//             <th className="py-2 px-4 border-b text-left">Required</th>
//             <th className="py-2 px-4 border-b text-left">Description</th>
//           </tr>
//         </thead>
//         <tbody>
//           <tr>
//             <td className="py-2 px-4 border-b">TheNews-api-key</td>
//             <td className="py-2 px-4 border-b">Yes</td>
//             <td className="py-2 px-4 border-b">Your JWT-based API key used for authentication</td>
//           </tr>
//         </tbody>
//       </table>
//     </div>
//   </div>

//   <div className="mb-6">
//     <h3 className="text-lg font-semibold mb-2">Request Body</h3>
//     <div className="overflow-x-auto">
//       <table className="min-w-full bg-white border border-gray-200 rounded-md">
//         <thead className="bg-gray-100">
//           <tr>
//             <th className="py-2 px-4 border-b text-left">Parameter</th>
//             <th className="py-2 px-4 border-b text-left">Type</th>
//             <th className="py-2 px-4 border-b text-left">Required</th>
//             <th className="py-2 px-4 border-b text-left">Description</th>
//           </tr>
//         </thead>
//         <tbody>
//           <tr>
//             <td className="py-2 px-4 border-b">email</td>
//             <td className="py-2 px-4 border-b">String</td>
//             <td className="py-2 px-4 border-b">Yes</td>
//             <td className="py-2 px-4 border-b">Email address of the subscriber</td>
//           </tr>
//           <tr>
//             <td className="py-2 px-4 border-b">source</td>
//             <td className="py-2 px-4 border-b">String</td>
//             <td className="py-2 px-4 border-b">No</td>
//             <td className="py-2 px-4 border-b">The source of the subscription (default: &quot;By API&quot;)</td>
//           </tr>
//         </tbody>
//       </table>
//     </div>
//   </div>

//   <div className="mb-6">
//     <h3 className="text-lg font-semibold mb-2">Example Request</h3>
//     <div className="bg-black rounded-md">
//       <div className="flex justify-between items-center px-4 py-2 border-b border-gray-700">
//         <span className="text-white">JavaScript</span>
//         <button 
//           onClick={() => copyToClipboard(codeSnippets.addSubscriber, 'addSubscriber')}
//           className="text-gray-400 hover:text-white"
//         >
//           {copiedStates.addSubscriber ? 'Copied!' : <Copy size={16} />}
//         </button>
//       </div>
//       <pre className="p-4 text-green-400 overflow-x-auto scrollbar-thin">
//         {codeSnippets.addSubscriber}
//       </pre>
//     </div>
//   </div>

//   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//     <div className=' w-full'>
//       <h3 className="text-lg font-semibold mb-2">Success Response (200 OK)</h3>
//       <div className="bg-black rounded-md">
//         <div className="flex justify-between items-center px-4 py-2 border-b border-gray-700">
//           <span className="text-white">Response</span>
//           <button 
//             onClick={() => copyToClipboard(codeSnippets.responseSuccess, 'responseSuccess')}
//             className="text-gray-400 hover:text-white"
//           >
//             {copiedStates.responseSuccess ? 'Copied!' : <Copy size={16} />}
//           </button>
//         </div>
//         <pre className="p-4 text-blue-400 overflow-x-auto scrollbar-thin">
//           {codeSnippets.responseSuccess}
//         </pre>
//             </div>
//       </div>

//           <div>
//             <h3 className="text-lg font-semibold mb-2">Error Response (400+)</h3>
//             <div className="bg-black rounded-md">
//               <div className="flex justify-between items-center px-4 py-2 border-b border-gray-700">
//                 <span className="text-white">Response</span>
//                 <button 
//                   onClick={() => copyToClipboard(codeSnippets.responseError, 'responseError')}
//                   className="text-gray-400 hover:text-white"
//                 >
//                   {copiedStates.responseError ? 'Copied!' : <Copy size={16} />}
//                 </button>
//               </div>
//               <pre className="p-4 text-red-400 overflow-x-auto scrollbar-thin">
//                 {codeSnippets.responseError}
//               </pre>
//             </div>
//           </div>

//         </div>
//           </section>

          
//           <section id="error-handling" className="mb-12">
//   <h2 className="text-2xl font-bold mb-4">Error Handling</h2>
//   <p className="mb-6">
//     The <code>/api/subscribe</code> endpoint uses standard HTTP response codes to indicate the success or failure of a request. Below are the possible response codes and their meanings.
//   </p>

//   <div className="overflow-x-auto">
//     <table className="min-w-full bg-white border border-gray-200 rounded-md">
//       <thead className="bg-gray-100">
//         <tr>
//           <th className="py-2 px-4 border-b text-left">Code</th>
//           <th className="py-2 px-4 border-b text-left">Description</th>
//         </tr>
//       </thead>
//       <tbody>
//         <tr>
//           <td className="py-2 px-4 border-b">200 - OK</td>
//           <td className="py-2 px-4 border-b">The subscriber was successfully created.</td>
//         </tr>
//         <tr>
//           <td className="py-2 px-4 border-b">400 - Bad Request</td>
//           <td className="py-2 px-4 border-b">Missing or invalid fields in the request (e.g., email not provided or invalid format).</td>
//         </tr>
//         <tr>
//           <td className="py-2 px-4 border-b">401 - Unauthorized</td>
//           <td className="py-2 px-4 border-b">The API key is missing, invalid, or the token is malformed.</td>
//         </tr>
//         <tr>
//           <td className="py-2 px-4 border-b">403 - Forbidden</td>
//           <td className="py-2 px-4 border-b">The API key is valid but the user has reached their monthly subscriber limit based on plan.</td>
//         </tr>
//         <tr>
//           <td className="py-2 px-4 border-b">404 - Not Found</td>
//           <td className="py-2 px-4 border-b">The membership for the authenticated user was not found.</td>
//         </tr>
//         <tr>
//           <td className="py-2 px-4 border-b">409 - Conflict</td>
//           <td className="py-2 px-4 border-b">The email address already exists in the subscriber list.</td>
//         </tr>
//         <tr>
//           <td className="py-2 px-4 border-b">429 - Too Many Requests</td>
//           <td className="py-2 px-4 border-b">The hourly limit for adding subscribers has been exceeded based on the user&lsquo;s plan.</td>
//         </tr>
//         <tr>
//           <td className="py-2 px-4 border-b">500 - Server Error</td>
//           <td className="py-2 px-4 border-b">An unexpected server error occurred. Please try again later.</td>
//         </tr>
//       </tbody>
//     </table>
//   </div>
//           </section>

          
//           <section id="rate-limits" className="mb-12">
//           <h2 className="text-2xl font-bold mb-4">Rate Limits</h2>
//           <p className="mb-4">
//             The <code>/api/subscribe</code> endpoint applies rate limits based on your subscription plan. These limits control how many subscribers you can add per hour to prevent abuse and ensure platform stability.
//           </p>

//           <div className="overflow-x-auto">
//             <table className="min-w-full bg-white border border-gray-200 rounded-md">
//               <thead className="bg-gray-100">
//                 <tr>
//                   <th className="py-2 px-4 border-b text-left">Plan</th>
//                   <th className="py-2 px-4 border-b text-left">Subscriber Limit / Hour</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 <tr>
//                   <td className="py-2 px-4 border-b">Free</td>
//                   <td className="py-2 px-4 border-b">10 subscribers</td>
//                 </tr>
//                 <tr>
//                   <td className="py-2 px-4 border-b">Lunch</td>
//                   <td className="py-2 px-4 border-b">100 subscribers</td>
//                 </tr>
//                 <tr>
//                   <td className="py-2 px-4 border-b">Scale</td>
//                   <td className="py-2 px-4 border-b">1,000 subscribers</td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>

//           <div className="mt-6 bg-amber-50 border border-amber-200 p-4 rounded-md">
//             <div className="flex items-start">
//               <div className="mr-3 mt-1 text-amber-600">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//               </div>
//               <div>
//                 <h4 className="font-semibold text-amber-800">Note</h4>
//                 <p className="text-amber-700">
//                   If you exceed your hourly rate limit, the API will respond with a <code>429 Too Many Requests</code> status code. You should implement an appropriate retry or backoff strategy in your client application.
//                 </p>
//               </div>
//             </div>
//           </div>
//           </section>


//             {/* Footer */}
//       <XFooter />
//         </main>
//       </div>
      
    
//     </div>
//   );
// }

'use client'




import { useState } from "react";
import { ChevronDown, ChevronRight, ExternalLink, Copy, Check, Code, FileText, Send, Inbox, Trash, Edit, PieChart, AlertTriangle, Info, Clock } from "lucide-react";

// Main component
export default function ApiDocumentation() {
  const [activeSection, setActiveSection] = useState("get-started");
  const [activeSidebar, setActiveSidebar] = useState(true);
  const [activeEndpoint, setActiveEndpoint] = useState("post-subscribe");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Toggle sidebar on mobile
  const toggleSidebar = () => {
    setActiveSidebar(!activeSidebar);
  };

  // Handle code copying
  interface CopyToClipboardParams {
    code: string;
    id: string;
  }

  const copyToClipboard = ({ code, id }: CopyToClipboardParams): void => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Sidebar links data
  const sidebarLinks = [
    { id: "get-started", label: "Getting Started", icon: <FileText size={18} /> },
    { id: "authentication", label: "Authentication", icon: <Code size={18} /> },
    { 
      id: "endpoints", 
      label: "Endpoints", 
      icon: <Send size={18} />,
      children: [
        { id: "post-subscribe", label: "POST /api/subscribe", available: true },
        { id: "get-subscribers", label: "GET /api/subscribers", available: false },
        { id: "delete-subscriber", label: "DELETE /api/subscribers", available: false },
        { id: "put-subscriber", label: "PUT /api/subscribers", available: false },
        { id: "get-newsletters", label: "GET /api/newsletters", available: false },
        { id: "post-newsletter", label: "POST /api/newsletters", available: false },
        { id: "get-analytics", label: "GET /api/analytics", available: false }
      ]
    },
    { id: "errors", label: "Error Codes", icon: <AlertTriangle size={18} /> },
    { id: "rate-limits", label: "Rate Limits", icon: <Clock size={18} /> }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 text-gray-900">
      {/* Mobile sidebar toggle */}
      <div className="md:hidden flex items-center justify-between p-4 bg-black text-white">
        <button 
          onClick={toggleSidebar} 
          className="flex items-center space-x-2 text-white"
        >
          {activeSidebar ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
          <span className="font-medium">Menu</span>
        </button>
        <div className="text-lg font-semibold text-amber-400">TheNews API</div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className={`${activeSidebar ? 'block' : 'hidden'} md:block w-full md:w-64 lg:w-72 bg-black text-white overflow-y-auto flex-shrink-0`}>
          <div className="p-6">
            <h1 className="text-2xl font-bold text-amber-400">TheNews API</h1>
            <p className="mt-2 text-gray-400 text-sm">by SixthGrid</p>
          </div>
          
          <nav className="mt-2 pb-16">
            {sidebarLinks.map((link) => (
              <div key={link.id}>
                <button
                  onClick={() => setActiveSection(link.id)}
                  className={`flex items-center w-full px-6 py-3 text-left ${
                    activeSection === link.id ? 'bg-gray-900 border-l-4 border-amber-400' : 'hover:bg-gray-900'
                  }`}
                >
                  <span className="mr-3 text-amber-400">{link.icon}</span>
                  <span>{link.label}</span>
                </button>
                
                {link.children && activeSection === link.id && (
                  <div className="ml-6 pl-6 border-l border-gray-700">
                    {link.children.map((child) => (
                      <button
                        key={child.id}
                        onClick={() => setActiveEndpoint(child.id)}
                        className={`flex items-center w-full px-4 py-2 text-left text-sm ${
                          activeEndpoint === child.id ? 'text-amber-400' : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        <span>{child.label}</span>
                        {!child.available && (
                          <span className="ml-2 px-2 py-0.5 text-xs bg-gray-800 text-gray-400 rounded">Coming soon</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-white">
          <div className="max-w-5xl mx-auto px-4 py-8 md:px-8">
            {activeSection === "get-started" && (
              <section>
                <h2 className="text-3xl font-bold mb-6">Getting Started with TheNews API</h2>
                <p className="mb-6 text-gray-700">
                  TheNews API allows you to programmatically manage subscribers, newsletters, and analytics for your email marketing campaigns. Use our RESTful API to seamlessly integrate email marketing into your applications.
                </p>
                
                <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="text-xl font-semibold mb-4">Base URL</h3>
                  <div className="bg-black rounded-md p-4 text-white font-mono">
                    https://api.thenews.sixthgrid.com/v1
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4">Quick Start Guide</h3>
                  <ol className="list-decimal list-inside space-y-4 ml-4 text-gray-700">
                    <li>
                      <span className="font-medium">Create an account</span> - Sign up at 
                      <a href="#" className="text-amber-600 hover:text-amber-800 mx-1">dashboard.thenews.sixthgrid.com</a>
                      to get your API keys.
                    </li>
                    <li>
                      <span className="font-medium">Generate API keys</span> - Navigate to the API section in your dashboard to create API keys.
                    </li>
                    <li>
                      <span className="font-medium">Make your first API request</span> - Use your API key to authenticate and start making requests.
                    </li>
                  </ol>
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4">Available Endpoints</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="py-3 px-4 text-left font-medium text-gray-600">Endpoint</th>
                          <th className="py-3 px-4 text-left font-medium text-gray-600">Description</th>
                          <th className="py-3 px-4 text-left font-medium text-gray-600">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr>
                          <td className="py-3 px-4 font-mono text-sm">POST /api/subscribe</td>
                          <td className="py-3 px-4">Add a new subscriber to your list</td>
                          <td className="py-3 px-4"><span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Available</span></td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 font-mono text-sm">GET /api/subscribers</td>
                          <td className="py-3 px-4">Retrieve subscriber lists and information</td>
                          <td className="py-3 px-4"><span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">Coming Soon</span></td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 font-mono text-sm">DELETE /api/subscribers</td>
                          <td className="py-3 px-4">Remove subscribers from your list</td>
                          <td className="py-3 px-4"><span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">Coming Soon</span></td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 font-mono text-sm">PUT /api/subscribers</td>
                          <td className="py-3 px-4">Update subscriber information</td>
                          <td className="py-3 px-4"><span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">Coming Soon</span></td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 font-mono text-sm">GET /api/newsletters</td>
                          <td className="py-3 px-4">Retrieve newsletter campaigns</td>
                          <td className="py-3 px-4"><span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">Coming Soon</span></td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 font-mono text-sm">GET /api/analytics</td>
                          <td className="py-3 px-4">Retrieve campaign analytics</td>
                          <td className="py-3 px-4"><span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">Coming Soon</span></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            )}

            {activeSection === "authentication" && (
              <section>
                <h2 className="text-3xl font-bold mb-6">Authentication</h2>
                <p className="mb-6 text-gray-700">
                  TheNews API uses API keys to authenticate requests. You can manage your API keys from your dashboard.
                </p>

                <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="text-xl font-semibold mb-4">API Key Authentication</h3>
                  <p className="mb-4 text-gray-700">
                    Include your API key in the request header as follows:
                  </p>
                  
                  <div className="relative">
                    <div className="bg-black rounded-md p-4 text-white font-mono overflow-x-auto">
                      <pre>
{`Authorization: Bearer YOUR_API_KEY`}
                      </pre>
                    </div>
                    <button 
                      onClick={() => copyToClipboard({ code: 'Authorization: Bearer YOUR_API_KEY', id: 'auth-header' })}
                      className="absolute top-4 right-4 p-1.5 rounded-md bg-gray-800 hover:bg-gray-700 text-white transition-colors"
                    >
                      {copiedCode === 'auth-header' ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4">Example Request with Authentication</h3>
                  
                  <div className="mb-4">
                    <div className="flex items-center space-x-4 mb-2">
                      <button 
                        className="px-3 py-1.5 rounded-md bg-black text-white text-sm font-medium"
                      >
                        JavaScript
                      </button>
                      <button
                        className="px-3 py-1.5 rounded-md bg-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-300"
                      >
                        TypeScript
                      </button>
                    </div>
                    
                    <div className="relative">
                      <div className="bg-black rounded-md p-4 font-mono text-white overflow-x-auto">
                        <pre>
{`fetch('https://api.thenews.sixthgrid.com/v1/api/subscribe', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    email: 'subscriber@example.com',
    listId: 'newsletter-main',
    firstName: 'John',
    lastName: 'Doe'
  })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));`}
                        </pre>
                      </div>
                      <button 
                        onClick={() => copyToClipboard({ 
                          code: `fetch('https://api.thenews.sixthgrid.com/v1/api/subscribe', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    email: 'subscriber@example.com',
    listId: 'newsletter-main',
    firstName: 'John',
    lastName: 'Doe'
  })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));`, 
                          id: 'auth-example' 
                        })}
                        className="absolute top-4 right-4 p-1.5 rounded-md bg-gray-800 hover:bg-gray-700 text-white transition-colors"
                      >
                        {copiedCode === 'auth-example' ? <Check size={16} /> : <Copy size={16} />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mb-8 p-6 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-start">
                    <div className="mr-3 mt-1 text-amber-600">
                      <Info size={20} />
                    </div>
                    <div>
                      <h4 className="font-medium text-amber-800">Security Best Practices</h4>
                      <ul className="mt-2 ml-4 list-disc text-gray-700 space-y-2">
                        <li>Never expose your API key in client-side code</li>
                        <li>Rotate your API keys periodically</li>
                        <li>Set appropriate permissions for each API key</li>
                        <li>Use environment variables to store API keys in your applications</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {activeSection === "endpoints" && (
              <section>
                <h2 className="text-3xl font-bold mb-6">API Endpoints</h2>
                
                {activeEndpoint === "post-subscribe" && (
                  <div>
                    <div className="mb-6 p-4 bg-black text-white rounded-md flex items-center">
                      <span className="px-2 py-1 bg-amber-600 text-white text-sm font-bold rounded mr-3">POST</span>
                      <span className="font-mono">/api/subscribe</span>
                    </div>

                    <p className="mb-6 text-gray-700">
                      Add a new subscriber to your mailing list. This endpoint handles validation, duplicate checking, and can automatically segment subscribers based on provided attributes.
                    </p>

                    <div className="mb-8">
                      <h3 className="text-xl font-semibold mb-4">Request Parameters</h3>
                      <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse">
                          <thead>
                            <tr className="bg-gray-100">
                              <th className="py-3 px-4 text-left font-medium text-gray-600">Parameter</th>
                              <th className="py-3 px-4 text-left font-medium text-gray-600">Type</th>
                              <th className="py-3 px-4 text-left font-medium text-gray-600">Required</th>
                              <th className="py-3 px-4 text-left font-medium text-gray-600">Description</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            <tr>
                              <td className="py-3 px-4 font-mono text-sm">email</td>
                              <td className="py-3 px-4">String</td>
                              <td className="py-3 px-4">Yes</td>
                              <td className="py-3 px-4">Email address of the subscriber</td>
                            </tr>
                            <tr>
                              <td className="py-3 px-4 font-mono text-sm">listId</td>
                              <td className="py-3 px-4">String</td>
                              <td className="py-3 px-4">Yes</td>
                              <td className="py-3 px-4">ID of the mailing list to subscribe to</td>
                            </tr>
                            <tr>
                              <td className="py-3 px-4 font-mono text-sm">firstName</td>
                              <td className="py-3 px-4">String</td>
                              <td className="py-3 px-4">No</td>
                              <td className="py-3 px-4">First name of the subscriber</td>
                            </tr>
                            <tr>
                              <td className="py-3 px-4 font-mono text-sm">lastName</td>
                              <td className="py-3 px-4">String</td>
                              <td className="py-3 px-4">No</td>
                              <td className="py-3 px-4">Last name of the subscriber</td>
                            </tr>
                            <tr>
                              <td className="py-3 px-4 font-mono text-sm">tags</td>
                              <td className="py-3 px-4">Array</td>
                              <td className="py-3 px-4">No</td>
                              <td className="py-3 px-4">Array of tags to associate with this subscriber</td>
                            </tr>
                            <tr>
                              <td className="py-3 px-4 font-mono text-sm">customFields</td>
                              <td className="py-3 px-4">Object</td>
                              <td className="py-3 px-4">No</td>
                              <td className="py-3 px-4">Object containing custom field values</td>
                            </tr>
                            <tr>
                              <td className="py-3 px-4 font-mono text-sm">doubleOptIn</td>
                              <td className="py-3 px-4">Boolean</td>
                              <td className="py-3 px-4">No</td>
                              <td className="py-3 px-4">Whether to enable double opt-in (defaults to your account settings)</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    
                    <div className="mb-8">
                      <h3 className="text-xl font-semibold mb-4">Example Request</h3>
                      
                      <div className="mb-4">
                        <div className="flex items-center space-x-4 mb-2">
                          <button 
                            className="px-3 py-1.5 rounded-md bg-black text-white text-sm font-medium"
                          >
                            JavaScript
                          </button>
                          <button
                            className="px-3 py-1.5 rounded-md bg-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-300"
                          >
                            TypeScript
                          </button>
                        </div>
                        
                        <div className="relative">
                          <div className="bg-black rounded-md p-4 font-mono text-white overflow-x-auto">
                            <pre>
{`fetch('https://api.thenews.sixthgrid.com/v1/api/subscribe', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    email: 'subscriber@example.com',
    listId: 'newsletter-main',
    firstName: 'John',
    lastName: 'Doe',
    tags: ['new-signup', 'website'],
    customFields: {
      source: 'landing-page',
      interests: ['technology', 'marketing']
    },
    doubleOptIn: true
  })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));`}
                            </pre>
                          </div>
                          <button 
                            onClick={() => copyToClipboard({ 
                              code: `fetch('https://api.thenews.sixthgrid.com/v1/api/subscribe', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    email: 'subscriber@example.com',
    listId: 'newsletter-main',
    firstName: 'John',
    lastName: 'Doe',
    tags: ['new-signup', 'website'],
    customFields: {
      source: 'landing-page',
      interests: ['technology', 'marketing']
    },
    doubleOptIn: true
  })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));`, 
                              id: 'request-example' 
                            })}
                            className="absolute top-4 right-4 p-1.5 rounded-md bg-gray-800 hover:bg-gray-700 text-white transition-colors"
                          >
                            {copiedCode === 'request-example' ? <Check size={16} /> : <Copy size={16} />}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="mb-8">
                      <h3 className="text-xl font-semibold mb-4">Response</h3>
                      <p className="mb-4 text-gray-700">
                        The API returns a JSON object with the following structure:
                      </p>
                      
                      <div className="relative">
                        <div className="bg-black rounded-md p-4 font-mono text-white overflow-x-auto">
                          <pre>
{`{
  "success": true,
  "message": "Subscriber added successfully",
  "data": {
    "subscriberId": "sub_012345abcdef",
    "email": "subscriber@example.com",
    "listId": "newsletter-main",
    "status": "active",
    "doubleOptIn": true,
    "doubleOptInStatus": "pending",
    "createdAt": "2025-05-05T12:34:56Z"
  }
}`}
                          </pre>
                        </div>
                        <button 
                          onClick={() => copyToClipboard({ 
                            code: `{
  "success": true,
  "message": "Subscriber added successfully",
  "data": {
    "subscriberId": "sub_012345abcdef",
    "email": "subscriber@example.com",
    "listId": "newsletter-main",
    "status": "active",
    "doubleOptIn": true,
    "doubleOptInStatus": "pending",
    "createdAt": "2025-05-05T12:34:56Z"
  }
}`, 
                            id: 'response-example' 
                          })}
                          className="absolute top-4 right-4 p-1.5 rounded-md bg-gray-800 hover:bg-gray-700 text-white transition-colors"
                        >
                          {copiedCode === 'response-example' ? <Check size={16} /> : <Copy size={16} />}
                        </button>
                      </div>
                    </div>

                    <div className="mb-8">
                      <h3 className="text-xl font-semibold mb-4">Response Codes</h3>
                      <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse">
                          <thead>
                            <tr className="bg-gray-100">
                              <th className="py-3 px-4 text-left font-medium text-gray-600">Status Code</th>
                              <th className="py-3 px-4 text-left font-medium text-gray-600">Description</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            <tr>
                              <td className="py-3 px-4 font-mono text-sm">200 OK</td>
                              <td className="py-3 px-4">Subscriber successfully added</td>
                            </tr>
                            <tr>
                              <td className="py-3 px-4 font-mono text-sm">400 Bad Request</td>
                              <td className="py-3 px-4">Invalid parameters or missing required fields</td>
                            </tr>
                            <tr>
                              <td className="py-3 px-4 font-mono text-sm">401 Unauthorized</td>
                              <td className="py-3 px-4">Missing or invalid API key</td>
                            </tr>
                            <tr>
                              <td className="py-3 px-4 font-mono text-sm">409 Conflict</td>
                              <td className="py-3 px-4">Email already exists in the specified list</td>
                            </tr>
                            <tr>
                              <td className="py-3 px-4 font-mono text-sm">422 Unprocessable Entity</td>
                              <td className="py-3 px-4">Email validation failed</td>
                            </tr>
                            <tr>
                              <td className="py-3 px-4 font-mono text-sm">429 Too Many Requests</td>
                              <td className="py-3 px-4">Rate limit exceeded</td>
                            </tr>
                            <tr>
                              <td className="py-3 px-4 font-mono text-sm">500 Internal Server Error</td>
                              <td className="py-3 px-4">Server error</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {activeEndpoint === "get-subscribers" && (
                  <div className="p-6 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-amber-500 mb-3">
                        <Clock size={48} className="mx-auto" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">Coming Soon</h3>
                      <p className="text-gray-600">
                        This endpoint is currently under development and will be available soon.
                      </p>
                    </div>
                  </div>
                )}

                {(activeEndpoint === "delete-subscriber" || 
                  activeEndpoint === "put-subscriber" || 
                  activeEndpoint === "get-newsletters" || 
                  activeEndpoint === "post-newsletter" || 
                  activeEndpoint === "get-analytics") && (
                  <div className="p-6 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-amber-500 mb-3">
                        <Clock size={48} className="mx-auto" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">Coming Soon</h3>
                      <p className="text-gray-600">
                        This endpoint is currently under development and will be available soon.
                      </p>
                    </div>
                  </div>
                )}
              </section>
            )}

            {activeSection === "errors" && (
              <section>
                <h2 className="text-3xl font-bold mb-6">Error Codes</h2>
                <p className="mb-6 text-gray-700">
                  The API uses standard HTTP status codes to indicate the success or failure of an API request.
                </p>

                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4">Common Error Responses</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="py-3 px-4 text-left font-medium text-gray-600">Status Code</th>
                          <th className="py-3 px-4 text-left font-medium text-gray-600">Error Code</th>
                          <th className="py-3 px-4 text-left font-medium text-gray-600">Description</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr>
                          <td className="py-3 px-4 font-mono text-sm">400</td>
                          <td className="py-3 px-4">invalid_request</td>
                          <td className="py-3 px-4">The request is missing required parameters or contains invalid values</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 font-mono text-sm">401</td>
                          <td className="py-3 px-4">unauthorized</td>
                          <td className="py-3 px-4">Authentication failed or API key is invalid</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 font-mono text-sm">403</td>
                          <td className="py-3 px-4">forbidden</td>
                          <td className="py-3 px-4">The API key doesn&apos;t have permission to perform this action</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 font-mono text-sm">404</td>
                          <td className="py-3 px-4">not_found</td>
                          <td className="py-3 px-4">The requested resource could not be found</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 font-mono text-sm">409</td>
                          <td className="py-3 px-4">conflict</td>
                          <td className="py-3 px-4">The request conflicts with the current state of the resource</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 font-mono text-sm">422</td>
                          <td className="py-3 px-4">unprocessable_entity</td>
                          <td className="py-3 px-4">The request was well-formed but contains semantic errors</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 font-mono text-sm">429</td>
                          <td className="py-3 px-4">rate_limit_exceeded</td>
                          <td className="py-3 px-4">Too many requests in a given amount of time</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 font-mono text-sm">500</td>
                          <td className="py-3 px-4">server_error</td>
                          <td className="py-3 px-4">An unexpected error occurred on the server</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4">Error Response Format</h3>
                  <p className="mb-4 text-gray-700">
                    All error responses follow the same JSON structure:
                  </p>
                  
                  <div className="relative">
                    <div className="bg-black rounded-md p-4 font-mono text-white overflow-x-auto">
                      <pre>
{`{
  "success": false,
  "error": {
    "code": "error_code",
    "message": "Human-readable error message",
    "details": {
      // Optional additional error details
    }
  }
}`}
                      </pre>
                    </div>
                    <button 
                      onClick={() => copyToClipboard({ 
                        code: `{
  "success": false,
  "error": {
    "code": "error_code",
    "message": "Human-readable error message",
    "details": {
      // Optional additional error details
    }
  }
}`, 
                        id: 'error-format' 
                      })}
                      className="absolute top-4 right-4 p-1.5 rounded-md bg-gray-800 hover:bg-gray-700 text-white transition-colors"
                    >
                      {copiedCode === 'error-format' ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>
              </section>
            )}

            {activeSection === "rate-limits" && (
              <section>
                <h2 className="text-3xl font-bold mb-6">Rate Limits</h2>
                <p className="mb-6 text-gray-700">
                  To ensure fair usage and maintain service stability, TheNews API implements rate limiting on all endpoints.
                </p>

                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4">Default Rate Limits</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="py-3 px-4 text-left font-medium text-gray-600">Plan</th>
                          <th className="py-3 px-4 text-left font-medium text-gray-600">Requests per minute</th>
                          <th className="py-3 px-4 text-left font-medium text-gray-600">Burst capacity</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr>
                          <td className="py-3 px-4">Free</td>
                          <td className="py-3 px-4">60</td>
                          <td className="py-3 px-4">10</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4">Starter</td>
                          <td className="py-3 px-4">120</td>
                          <td className="py-3 px-4">20</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4">Professional</td>
                          <td className="py-3 px-4">300</td>
                          <td className="py-3 px-4">50</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4">Enterprise</td>
                          <td className="py-3 px-4">1000+</td>
                          <td className="py-3 px-4">100+</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4">Checking Rate Limits</h3>
                  <p className="mb-4 text-gray-700">
                    The API provides rate limit information in response headers:
                  </p>
                  
                  <div className="relative">
                    <div className="bg-black rounded-md p-4 font-mono text-white overflow-x-auto">
                      <pre>
{`X-RateLimit-Limit: 60
X-RateLimit-Remaining: 59
X-RateLimit-Reset: 1625097600`}
                      </pre>
                    </div>
                    <button 
                      onClick={() => copyToClipboard({ 
                        code: `X-RateLimit-Limit: 60
X-RateLimit-Remaining: 59
X-RateLimit-Reset: 1625097600`, 
                        id: 'rate-limit-headers' 
                      })}
                      className="absolute top-4 right-4 p-1.5 rounded-md bg-gray-800 hover:bg-gray-700 text-white transition-colors"
                    >
                      {copiedCode === 'rate-limit-headers' ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>

                <div className="mb-8 p-6 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-start">
                    <div className="mr-3 mt-1 text-amber-600">
                      <Info size={20} />
                    </div>
                    <div>
                      <h4 className="font-medium text-amber-800">Handling Rate Limits</h4>
                      <ul className="mt-2 ml-4 list-disc text-gray-700 space-y-2">
                        <li>Implement exponential backoff when you receive 429 responses</li>
                        <li>Cache responses when possible to reduce API calls</li>
                        <li>Monitor your usage with the rate limit headers</li>
                        <li>Contact support if you need higher rate limits</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}