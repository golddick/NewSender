// 'use client';


// import React, { useState, useEffect } from 'react';
// import { ArrowLeft, Mail, Send, Plus, Download, Search, Filter, MoreHorizontal, UserPlus } from 'lucide-react';

// export default function CampaignDetails() {
//   // Mock campaign data
//   const [campaign, setCampaign] = useState({
//     id: '1',
//     name: 'Monthly Newsletter',
//     description: 'Updates for our subscribers about new features and promotions',
//     categoryId: '1',
//     categoryName: 'Newsletter',
//     subscribers: 1250,
//     emailsSent: 5,
//     createdAt: '2025-04-15T12:00:00Z',
//     status: 'active'
//   });
  
//   // Mock subscribers data
//   const [subscribers, setSubscribers] = useState([
//     { id: '1', name: 'John Doe', email: 'john.doe@example.com', status: 'active', joinedAt: '2025-01-10T10:30:00Z' },
//     { id: '2', name: 'Jane Smith', email: 'jane.smith@example.com', status: 'active', joinedAt: '2025-01-15T14:20:00Z' },
//     { id: '3', name: 'Robert Johnson', email: 'robert.j@example.com', status: 'inactive', joinedAt: '2025-01-20T09:15:00Z' },
//     { id: '4', name: 'Emily Davis', email: 'emily.davis@example.com', status: 'active', joinedAt: '2025-02-05T16:45:00Z' },
//     { id: '5', name: 'Michael Wilson', email: 'michael.w@example.com', status: 'active', joinedAt: '2025-02-10T11:30:00Z' },
//   ]);
  
//   // Mock emails data
//   const [emails, setEmails] = useState([
//     { 
//       id: '1', 
//       subject: 'April Newsletter', 
//       sentAt: '2025-04-01T10:00:00Z', 
//       status: 'delivered',
//       openRate: 68,
//       clickRate: 42
//     },
//     { 
//       id: '2', 
//       subject: 'March Newsletter', 
//       sentAt: '2025-03-01T10:00:00Z', 
//       status: 'delivered',
//       openRate: 72,
//       clickRate: 38
//     },
//     { 
//       id: '3', 
//       subject: 'February Newsletter', 
//       sentAt: '2025-02-01T10:00:00Z', 
//       status: 'delivered',
//       openRate: 65,
//       clickRate: 31
//     },
//     { 
//       id: '4', 
//       subject: 'January Newsletter', 
//       sentAt: '2025-01-01T10:00:00Z', 
//       status: 'delivered',
//       openRate: 70,
//       clickRate: 35
//     },
//     { 
//       id: '5', 
//       subject: 'December Newsletter', 
//       sentAt: '2024-12-01T10:00:00Z', 
//       status: 'delivered',
//       openRate: 75,
//       clickRate: 40
//     }
//   ]);
  
//   // State for active tab
//   const [activeTab, setActiveTab] = useState('overview');
//   const [showAddSubscriberModal, setShowAddSubscriberModal] = useState(false);
//   const [showComposeEmailModal, setShowComposeEmailModal] = useState(false);
//   const [newSubscriber, setNewSubscriber] = useState({ name: '', email: '' });
//   const [newEmail, setNewEmail] = useState({ subject: '', content: '' });
  
//   // Format date to readable format
// interface Campaign {
//     id: string;
//     name: string;
//     description: string;
//     categoryId: string;
//     categoryName: string;
//     subscribers: number;
//     emailsSent: number;
//     createdAt: string;
//     status: string;
// }

// interface Subscriber {
//     id: string;
//     name: string;
//     email: string;
//     status: string;
//     joinedAt: string;
// }

// interface Email {
//     id: string;
//     subject: string;
//     sentAt: string;
//     status: string;
//     openRate: number;
//     clickRate: number;
// }

// const formatDate = (dateString: string): string => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', { 
//         year: 'numeric', 
//         month: 'short', 
//         day: 'numeric' 
//     });
// };
  
//   // Handle adding a new subscriber
//   const handleAddSubscriber = () => {
//     if (newSubscriber.name && newSubscriber.email) {
//       const subscriber = {
//         id: (subscribers.length + 1).toString(),
//         name: newSubscriber.name,
//         email: newSubscriber.email,
//         status: 'active',
//         joinedAt: new Date().toISOString()
//       };
      
//       setSubscribers([...subscribers, subscriber]);
//       setCampaign({...campaign, subscribers: campaign.subscribers + 1});
//       setNewSubscriber({ name: '', email: '' });
//       setShowAddSubscriberModal(false);
//     }
//   };
  
//   // Handle sending a new email
//   const handleSendEmail = () => {
//     if (newEmail.subject) {
//       const email = {
//         id: (emails.length + 1).toString(),
//         subject: newEmail.subject,
//         sentAt: new Date().toISOString(),
//         status: 'delivered',
//         openRate: 0,
//         clickRate: 0
//       };
      
//       setEmails([email, ...emails]);
//       setCampaign({...campaign, emailsSent: campaign.emailsSent + 1});
//       setNewEmail({ subject: '', content: '' });
//       setShowComposeEmailModal(false);
//     }
//   };
  
//   return (
//     <div className="min-h-screen bg-white text-gray-800 w-full container mx-auto">

      
//       {/* Main Content */}
//       <main className="p-6">
//         {/* Campaign Overview Card */}
//         <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-6">
//           <div className="p-6">
//             <div className="flex flex-wrap md:flex-nowrap justify-between gap-6">
//               <div className="flex-1">
//                 <h2 className="text-2xl font-semibold mb-2">{campaign.name}</h2>
//                 <p className="text-gray-500 mb-4">{campaign.description}</p>
                
//                 <div className="flex flex-wrap gap-4 mb-4">
//                   <div className="bg-gray-100 px-3 py-1 rounded-full text-sm">
//                     {campaign.categoryName}
//                   </div>
//                   <div className={`px-3 py-1 rounded-full text-sm ${campaign.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
//                     {campaign.status === 'active' ? 'Active' : 'Inactive'}
//                   </div>
//                   <div className="bg-gray-100 px-3 py-1 rounded-full text-sm">
//                     Created {formatDate(campaign.createdAt)}
//                   </div>
//                 </div>
//               </div>
              
//               <div className="flex gap-4">
//                 <div className="text-center p-4 border-r border-gray-200">
//                   <div className="text-3xl font-bold text-gold-500">{campaign.subscribers}</div>
//                   <div className="text-gray-500">Subscribers</div>
//                 </div>
//                 <div className="text-center p-4">
//                   <div className="text-3xl font-bold text-gold-500">{campaign.emailsSent}</div>
//                   <div className="text-gray-500">Emails Sent</div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
        
//         {/* Tabs */}
//         <div className="border-b border-gray-200 mb-6">
//           <div className="flex">
//             <button 
//               className={`px-4 py-2 font-medium ${activeTab === 'overview' ? 'text-gold-500 border-b-2 border-gold-500' : 'text-gray-500 hover:text-gold-500'}`}
//               onClick={() => setActiveTab('overview')}
//             >
//               Overview
//             </button>
//             <button 
//               className={`px-4 py-2 font-medium ${activeTab === 'subscribers' ? 'text-gold-500 border-b-2 border-gold-500' : 'text-gray-500 hover:text-gold-500'}`}
//               onClick={() => setActiveTab('subscribers')}
//             >
//               Subscribers
//             </button>
//             <button 
//               className={`px-4 py-2 font-medium ${activeTab === 'emails' ? 'text-gold-500 border-b-2 border-gold-500' : 'text-gray-500 hover:text-gold-500'}`}
//               onClick={() => setActiveTab('emails')}
//             >
//               Emails
//             </button>
//           </div>
//         </div>
        
//         {/* Tab Content */}
//         {activeTab === 'overview' && (
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//             {/* Recent Subscribers */}
//             <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
//               <div className="p-4 border-b border-gray-200 flex justify-between items-center">
//                 <h3 className="font-semibold">Recent Subscribers</h3>
//                 <button 
//                   className="text-sm text-gold-500 hover:underline"
//                   onClick={() => setActiveTab('subscribers')}
//                 >
//                   View All
//                 </button>
//               </div>
//               <div className="p-4">
//                 <div className="space-y-4">
//                   {subscribers.slice(0, 3).map(subscriber => (
//                     <div key={subscriber.id} className="flex items-center justify-between">
//                       <div>
//                         <div className="font-medium">{subscriber.name}</div>
//                         <div className="text-sm text-gray-500">{subscriber.email}</div>
//                       </div>
//                       <div className="text-xs text-gray-500">
//                         Joined {formatDate(subscriber.joinedAt)}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//                 <button 
//                   className="w-full mt-4 p-2 bg-black text-white rounded flex items-center justify-center hover:bg-gray-800"
//                   onClick={() => setShowAddSubscriberModal(true)}
//                 >
//                   <UserPlus size={16} className="mr-2" />
//                   Add Subscriber
//                 </button>
//               </div>
//             </div>
            
//             {/* Recent Emails */}
//             <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
//               <div className="p-4 border-b border-gray-200 flex justify-between items-center">
//                 <h3 className="font-semibold">Recent Emails</h3>
//                 <button 
//                   className="text-sm text-gold-500 hover:underline"
//                   onClick={() => setActiveTab('emails')}
//                 >
//                   View All
//                 </button>
//               </div>
//               <div className="p-4">
//                 <div className="space-y-4">
//                   {emails.slice(0, 3).map(email => (
//                     <div key={email.id} className="flex items-center justify-between">
//                       <div>
//                         <div className="font-medium">{email.subject}</div>
//                         <div className="text-sm text-gray-500">
//                           {email.openRate}% open rate • {email.clickRate}% click rate
//                         </div>
//                       </div>
//                       <div className="text-xs text-gray-500">
//                         Sent {formatDate(email.sentAt)}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//                 <button 
//                   className="w-full mt-4 p-2 bg-black text-white rounded flex items-center justify-center hover:bg-gray-800"
//                   onClick={() => setShowComposeEmailModal(true)}
//                 >
//                   <Send size={16} className="mr-2" />
//                   Compose Email
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
        
//         {activeTab === 'subscribers' && (
//           <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
//             <div className="p-4 border-b border-gray-200 flex justify-between items-center">
//               <h3 className="font-semibold">All Subscribers</h3>
//               <div className="flex space-x-2">
//                 <div className="relative">
//                   <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                   <input 
//                     type="text" 
//                     placeholder="Search subscribers..." 
//                     className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
//                   />
//                 </div>
//                 <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
//                   <Filter size={16} />
//                 </button>
//                 <button 
//                   className="p-2 bg-black text-white rounded-lg hover:bg-gray-800 flex items-center"
//                   onClick={() => setShowAddSubscriberModal(true)}
//                 >
//                   <Plus size={16} className="mr-1" />
//                   Add
//                 </button>
//               </div>
//             </div>
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="bg-gray-50 text-left">
//                   <tr>
//                     <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
//                     <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
//                     <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                     <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
//                     <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-200">
//                   {subscribers.map(subscriber => (
//                     <tr key={subscriber.id} className="hover:bg-gray-50">
//                       <td className="px-6 py-4 whitespace-nowrap font-medium">{subscriber.name}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-gray-500">{subscriber.email}</td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className={`px-2 py-1 text-xs rounded-full ${subscriber.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
//                           {subscriber.status}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-gray-500">{formatDate(subscriber.joinedAt)}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-right">
//                         <button className="text-gray-400 hover:text-gray-600">
//                           <MoreHorizontal size={16} />
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//             {subscribers.length === 0 && (
//               <div className="p-8 text-center text-gray-500">
//                 No subscribers yet. Add your first subscriber!
//               </div>
//             )}
//           </div>
//         )}
        
//         {activeTab === 'emails' && (
//           <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
//             <div className="p-4 border-b border-gray-200 flex justify-between items-center">
//               <h3 className="font-semibold">All Emails</h3>
//               <div className="flex space-x-2">
//                 <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
//                   <Download size={16} />
//                 </button>
//                 <button 
//                   className="p-2 bg-black text-white rounded-lg hover:bg-gray-800 flex items-center"
//                   onClick={() => setShowComposeEmailModal(true)}
//                 >
//                   <Send size={16} className="mr-1" /> 
//                   Compose
//                 </button>
//               </div>
//             </div>
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="bg-gray-50 text-left">
//                   <tr>
//                     <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
//                     <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Sent Date</th>
//                     <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                     <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Open Rate</th>
//                     <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Click Rate</th>
//                     <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-200">
//                   {emails.map(email => (
//                     <tr key={email.id} className="hover:bg-gray-50">
//                       <td className="px-6 py-4 whitespace-nowrap font-medium">{email.subject}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-gray-500">{formatDate(email.sentAt)}</td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
//                           {email.status}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center">
//                           <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
//                             <div 
//                               className="bg-gold-500 h-2 rounded-full" 
//                               style={{ width: `${email.openRate}%` }}
//                             ></div>
//                           </div>
//                           <span>{email.openRate}%</span>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center">
//                           <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
//                             <div 
//                               className="bg-gold-500 h-2 rounded-full" 
//                               style={{ width: `${email.clickRate}%` }}
//                             ></div>
//                           </div>
//                           <span>{email.clickRate}%</span>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-right">
//                         <button className="text-gray-400 hover:text-gray-600">
//                           <MoreHorizontal size={16} />
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//             {emails.length === 0 && (
//               <div className="p-8 text-center text-gray-500">
//                 No emails sent yet. Compose your first email!
//               </div>
//             )}
//           </div>
//         )}
//       </main>
      
//       {/* Add Subscriber Modal */}
//       {showAddSubscriberModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 w-full max-w-md">
//             <h2 className="text-xl font-semibold mb-4">Add New Subscriber</h2>
//             <div className="mb-4">
//               <label className="block text-gray-700 mb-2">Name</label>
//               <input
//                 type="text"
//                 className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gold-500"
//                 placeholder="Enter subscriber name"
//                 value={newSubscriber.name}
//                 onChange={(e) => setNewSubscriber({...newSubscriber, name: e.target.value})}
//               />
//             </div>
//             <div className="mb-4">
//               <label className="block text-gray-700 mb-2">Email</label>
//               <input
//                 type="email"
//                 className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gold-500"
//                 placeholder="Enter subscriber email"
//                 value={newSubscriber.email}
//                 onChange={(e) => setNewSubscriber({...newSubscriber, email: e.target.value})}
//               />
//             </div>
//             <div className="flex justify-end space-x-2">
//               <button
//                 className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
//                 onClick={() => setShowAddSubscriberModal(false)}
//               >
//                 Cancel
//               </button>
//               <button
//                 className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
//                 onClick={handleAddSubscriber}
//               >
//                 Add Subscriber
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
      
//       {/* Compose Email Modal */}
//       {showComposeEmailModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 w-full max-w-4xl">
//             <h2 className="text-xl font-semibold mb-4">Compose Email</h2>
//             <div className="mb-4">
//               <label className="block text-gray-700 mb-2">Subject</label>
//               <input
//                 type="text"
//                 className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gold-500"
//                 placeholder="Enter email subject"
//                 value={newEmail.subject}
//                 onChange={(e) => setNewEmail({...newEmail, subject: e.target.value})}
//               />
//             </div>
//             <div className="mb-4">
//               <label className="block text-gray-700 mb-2">Content</label>
//               <textarea
//                 className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gold-500"
//                 placeholder="Write your email content here..."
//                 // rows="10"
//                 value={newEmail.content}
//                 onChange={(e) => setNewEmail({...newEmail, content: e.target.value})}
//               />
//             </div>
//             <div className="flex justify-end space-x-2">
//               <button
//                 className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
//                 onClick={() => setShowComposeEmailModal(false)}
//               >
//                 Cancel
//               </button>
//               <button
//                 className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
//                 onClick={handleSendEmail}
//               >
//                 Send Email
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }





'use client';

import React, { useState, useEffect } from 'react';
import {
  ArrowLeft, Mail, Send, Plus, Download, Search,
  Filter, MoreHorizontal, UserPlus
} from 'lucide-react';

import { getCampaignById } from '@/actions/get.campaign'; // Make sure this path is correct
import { useCampaignId } from '@/lib/hooks/get.campaignID';

interface Campaign {
  id: string;
  name: string;
  description: string;
  category: string;
  subscribers: number;
  emailsSent: number;
  startDate: string;
  status: string;
}

interface Subscriber {
  id: string;
  name: string;
  email: string;
  status: string;
  joinedAt: string;
}

interface Email {
  id: string;
  subject: string;
  sentAt: string;
  status: string;
  openRate: number;
  clickRate: number;
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export default function CampaignDetails() {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState('overview');
  const [showAddSubscriberModal, setShowAddSubscriberModal] = useState(false);
  const [showComposeEmailModal, setShowComposeEmailModal] = useState(false);
  const [newSubscriber, setNewSubscriber] = useState({ name: '', email: '' });
  const [newEmail, setNewEmail] = useState({ subject: '', content: '' });

  const campaignID = useCampaignId();

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const data = await getCampaignById({ campaignId: campaignID });

        console.log('Campaign data:', data);
        if (!('error' in data)) {
          setCampaign({
            id: data._id,
            name: data.name,
            description: data.description,
            category: data.category.toString(), 
            subscribers: data.subscriberCount,
            emailsSent: data.emailsSent,
            startDate: data.startDate || new Date().toISOString(),
            status: 'active'
          });

          setSubscribers(data.subscribers.map((s) => ({
            id: s._id,
            name: s.source || 'Unknown', // Provide a default value for undefined names
            email: s.email,
            status: s.status,
            joinedAt: s.createdAt
          })));

          setEmails(data.emails.map((e) => ({
            id: e._id,
            subject: e.subject,
            sentAt: e.sentAt,
            status: e.status,
            openRate: Math.floor(Math.random() * 30) + 60,
            clickRate: Math.floor(Math.random() * 20) + 30
          })));
        }
      } catch (error) {
        console.error('Failed to load campaign', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();
  }, [campaignID]);

  console.log('Campaign:', campaign);

  const handleAddSubscriber = () => {
    if (newSubscriber.name && newSubscriber.email) {
      const subscriber = {
        id: (subscribers.length + 1).toString(),
        name: newSubscriber.name,
        email: newSubscriber.email,
        status: 'active',
        joinedAt: new Date().toISOString()
      };

      setSubscribers([...subscribers, subscriber]);
      setCampaign((prev) =>
        prev ? { ...prev, subscribers: prev.subscribers + 1 } : null
      );
      setNewSubscriber({ name: '', email: '' });
      setShowAddSubscriberModal(false);
    }
  };

  const handleSendEmail = () => {
    if (newEmail.subject) {
      const email = {
        id: (emails.length + 1).toString(),
        subject: newEmail.subject,
        sentAt: new Date().toISOString(),
        status: 'delivered',
        openRate: 0,
        clickRate: 0
      };

      setEmails([email, ...emails]);
      setCampaign((prev) =>
        prev ? { ...prev, emailsSent: prev.emailsSent + 1 } : null
      );
      setNewEmail({ subject: '', content: '' });
      setShowComposeEmailModal(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading campaign...</div>;
  }

  if (!campaign) {
    return <div className="p-8 text-center text-red-500">Campaign not found.</div>;
  }

  // From here, re-use your full JSX layout below
  // Replace any mock state access with the current `campaign`, `subscribers`, and `emails` values.

  
  return (
    <div className="min-h-screen bg-white text-gray-800 w-full container mx-auto">

      
      {/* Main Content */}
      <main className="p-6">
        {/* Campaign Overview Card */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-6">
          <div className="p-6">
            <div className="flex flex-wrap md:flex-nowrap justify-between gap-6">
              <div className="flex-1">
                <h2 className="text-2xl font-semibold mb-2">{campaign.name}</h2>
                <p className="text-gray-500 mb-4">{campaign.description}</p>
                
                <div className="flex flex-wrap gap-4 mb-4">
                  <div className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                    {campaign.category}
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm ${campaign.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {campaign.status === 'active' ? 'Active' : 'Inactive'}
                  </div>
                  <div className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                    Start Date {formatDate(campaign.startDate)}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="text-center p-4 border-r border-gray-200">
                  <div className="text-3xl font-bold text-gold-500">{campaign.subscribers}</div>
                  <div className="text-gray-500">Subscribers</div>
                </div>
                <div className="text-center p-4">
                  <div className="text-3xl font-bold text-gold-500">{campaign.emailsSent}</div>
                  <div className="text-gray-500">Emails Sent</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <div className="flex">
            <button 
              className={`px-4 py-2 font-medium ${activeTab === 'overview' ? 'text-gold-500 border-b-2 border-gold-500' : 'text-gray-500 hover:text-gold-500'}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button 
              className={`px-4 py-2 font-medium ${activeTab === 'subscribers' ? 'text-gold-500 border-b-2 border-gold-500' : 'text-gray-500 hover:text-gold-500'}`}
              onClick={() => setActiveTab('subscribers')}
            >
              Subscribers
            </button>
            <button 
              className={`px-4 py-2 font-medium ${activeTab === 'emails' ? 'text-gold-500 border-b-2 border-gold-500' : 'text-gray-500 hover:text-gold-500'}`}
              onClick={() => setActiveTab('emails')}
            >
              Emails
            </button>
          </div>
        </div>
        
        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Subscribers */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-semibold">Recent Subscribers</h3>
                <button 
                  className="text-sm text-gold-500 hover:underline"
                  onClick={() => setActiveTab('subscribers')}
                >
                  View All
                </button>
              </div>
              <div className="p-4">
                <div className="space-y-4">
                  {subscribers.slice(0, 3).map(subscriber => (
                    <div key={subscriber.id} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{subscriber.name}</div>
                        <div className="text-sm text-gray-500">{subscriber.email}</div>
                      </div>
                      <div className="text-xs text-gray-500">
                        Joined {formatDate(subscriber.joinedAt)}
                      </div>
                    </div>
                  ))}
                </div>
                <button 
                  className="w-full mt-4 p-2 bg-black text-white rounded flex items-center justify-center hover:bg-gray-800"
                  onClick={() => setShowAddSubscriberModal(true)}
                >
                  <UserPlus size={16} className="mr-2" />
                  Add Subscriber
                </button>
              </div>
            </div>
            
            {/* Recent Emails */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-semibold">Recent Emails</h3>
                <button 
                  className="text-sm text-gold-500 hover:underline"
                  onClick={() => setActiveTab('emails')}
                >
                  View All
                </button>
              </div>
              <div className="p-4">
                <div className="space-y-4">
                  {emails.slice(0, 3).map(email => (
                    <div key={email.id} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{email.subject}</div>
                        <div className="text-sm text-gray-500">
                          {email.openRate}% open rate • {email.clickRate}% click rate
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        Sent {formatDate(email.sentAt)}
                      </div>
                    </div>
                  ))}
                </div>
                <button 
                  className="w-full mt-4 p-2 bg-black text-white rounded flex items-center justify-center hover:bg-gray-800"
                  onClick={() => setShowComposeEmailModal(true)}
                >
                  <Send size={16} className="mr-2" />
                  Compose Email
                </button>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'subscribers' && (
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-semibold">All Subscribers</h3>
              <div className="flex space-x-2">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Search subscribers..." 
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                </div>
                <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Filter size={16} />
                </button>
                <button 
                  className="p-2 bg-black text-white rounded-lg hover:bg-gray-800 flex items-center"
                  onClick={() => setShowAddSubscriberModal(true)}
                >
                  <Plus size={16} className="mr-1" />
                  Add
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 text-left">
                  <tr>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {subscribers.map(subscriber => (
                    <tr key={subscriber.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap font-medium">{subscriber.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">{subscriber.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${subscriber.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {subscriber.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">{formatDate(subscriber.joinedAt)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button className="text-gray-400 hover:text-gray-600">
                          <MoreHorizontal size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {subscribers.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                No subscribers yet. Add your first subscriber!
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'emails' && (
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-semibold">All Emails</h3>
              <div className="flex space-x-2">
                <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Download size={16} />
                </button>
                <button 
                  className="p-2 bg-black text-white rounded-lg hover:bg-gray-800 flex items-center"
                  onClick={() => setShowComposeEmailModal(true)}
                >
                  <Send size={16} className="mr-1" /> 
                  Compose
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 text-left">
                  <tr>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Sent Date</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Open Rate</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Click Rate</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {emails.map(email => (
                    <tr key={email.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap font-medium">{email.subject}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">{formatDate(email.sentAt)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                          {email.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className="bg-gold-500 h-2 rounded-full" 
                              style={{ width: `${email.openRate}%` }}
                            ></div>
                          </div>
                          <span>{email.openRate}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className="bg-gold-500 h-2 rounded-full" 
                              style={{ width: `${email.clickRate}%` }}
                            ></div>
                          </div>
                          <span>{email.clickRate}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button className="text-gray-400 hover:text-gray-600">
                          <MoreHorizontal size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {emails.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                No emails sent yet. Compose your first email!
              </div>
            )}
          </div>
        )}
      </main>
      
      {/* Add Subscriber Modal */}
      {showAddSubscriberModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Add New Subscriber</h2>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Name</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gold-500"
                placeholder="Enter subscriber name"
                value={newSubscriber.name}
                onChange={(e) => setNewSubscriber({...newSubscriber, name: e.target.value})}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Email</label>
              <input
                type="email"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gold-500"
                placeholder="Enter subscriber email"
                value={newSubscriber.email}
                onChange={(e) => setNewSubscriber({...newSubscriber, email: e.target.value})}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                onClick={() => setShowAddSubscriberModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                onClick={handleAddSubscriber}
              >
                Add Subscriber
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Compose Email Modal */}
      {showComposeEmailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl">
            <h2 className="text-xl font-semibold mb-4">Compose Email</h2>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Subject</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gold-500"
                placeholder="Enter email subject"
                value={newEmail.subject}
                onChange={(e) => setNewEmail({...newEmail, subject: e.target.value})}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Content</label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gold-500"
                placeholder="Write your email content here..."
                // rows="10"
                value={newEmail.content}
                onChange={(e) => setNewEmail({...newEmail, content: e.target.value})}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                onClick={() => setShowComposeEmailModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                onClick={handleSendEmail}
              >
                Send Email
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
