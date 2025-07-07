

// 'use client';

// import React, { useState, useEffect } from 'react';
// import {
//   ArrowLeft, Mail, Send, Plus, Download, Search,
//   Filter, MoreHorizontal, UserPlus
// } from 'lucide-react';

// import { getCampaignById } from '@/actions/get.campaign';
// import { useCampaignId } from '@/lib/hooks/get.campaignID';

// interface Campaign {
//   id: string;
//   name: string;
//   description: string;
//   category: string;
//   subscribers: number;
//   emailsSent: number;
//   startDate: string;
//   status: string;
// }

// interface Subscriber {
//   id: string;
//   source: string;
//   email: string;
//   status: string;
//   joinedAt: string;
// }

// interface Email {
//   id: string;
//   subject: string;
//   sentAt: string;
//   status: string;
//   openRate: number;
//   clickRate: number;
// }

// const formatDate = (dateString: string): string => {
//   const date = new Date(dateString);
//   return date.toLocaleDateString('en-US', {
//     year: 'numeric',
//     month: 'short',
//     day: 'numeric'
//   });
// };

// export default function CampaignDetails() {
//   const [campaign, setCampaign] = useState<Campaign | null>(null);
//   const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
//   const [emails, setEmails] = useState<Email[]>([]);
//   const [loading, setLoading] = useState(true);

//   const [activeTab, setActiveTab] = useState('overview');
//   const [showAddSubscriberModal, setShowAddSubscriberModal] = useState(false);
//   const [showComposeEmailModal, setShowComposeEmailModal] = useState(false);
//   const [newSubscriber, setNewSubscriber] = useState({ source: '', email: '' });
//   const [newEmail, setNewEmail] = useState({ subject: '', content: '' });

//   const campaignID = useCampaignId();

//   useEffect(() => {
//     const fetchCampaign = async () => {
//       try {
//         const data = await getCampaignById({ campaignId: campaignID });

//         if (!('error' in data)) {
//           setCampaign({
//             id: data._id,
//             name: data.name,
//             description: data.description,
//             category: data.category.toString(), 
//             subscribers: data.subscriberCount,
//             emailsSent: data.emailsSent,
//             startDate: data.startDate || new Date().toISOString(),
//             status: 'active'
//           });

//           setSubscribers(data.subscribers?.map((s: any) => ({
//             id: s._id,
//             source: s.source || 'Unknown',
//             email: s.email,
//             status: s.status || 'active',
//             joinedAt: s.createdAt
//           })) || []);

//           setEmails(data.emails?.map((e: any) => ({
//             id: e._id,
//             subject: e.subject,
//             sentAt: e.sentAt,
//             status: e.status || 'sent',
//             openRate: e.openRate || 0,
//             clickRate: e.clickRate || 0
//           })) || []);
//         }
//       } catch (error) {
//         console.error('Failed to load campaign', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCampaign();
//   }, [campaignID]);

//   // const handleAddSubscriber = () => {
//   //   if (newSubscriber.source && newSubscriber.email) {
//   //     const subscriber = {
//   //       id: (subscribers.length + 1).toString(),
//   //       source: newSubscriber.source,
//   //       email: newSubscriber.email,
//   //       status: 'active',
//   //       joinedAt: new Date().toISOString()
//   //     };

//   //     setSubscribers([...subscribers, subscriber]);
//   //     setCampaign((prev) =>
//   //       prev ? { ...prev, subscribers: prev.subscribers + 1 } : null
//   //     );
//   //     setNewSubscriber({ source: '', email: '' });
//   //     setShowAddSubscriberModal(false);
//   //   }
//   // };

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
//       setCampaign((prev) =>
//         prev ? { ...prev, emailsSent: prev.emailsSent + 1 } : null
//       );
//       setNewEmail({ subject: '', content: '' });
//       setShowComposeEmailModal(false);
//     }
//   };

//   if (loading) {
//     return <div className="p-8 text-center">Loading campaign...</div>;
//   }

//   if (!campaign) {
//     return <div className="p-8 text-center text-red-500">Campaign not found.</div>;
//   }

//   return (
//     <div className="min-h-screen bg-white text-gray-800 w-full px-4 sm:px-6 lg:px-8 mx-auto">
//       {/* Main Content */}
//       <main className="py-4 md:py-6">
//         {/* Campaign Overview Card */}
//         <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-6">
//           <div className="p-4 sm:p-6">
//             <div className="flex flex-col md:flex-row justify-between gap-4">
//               <div className="flex-1">
//                 <h2 className="text-xl sm:text-2xl font-semibold mb-2">{campaign.name}</h2>
//                 <p className="text-gray-500 text-sm sm:text-base mb-4">{campaign.description}</p>
                
//                 <div className="flex flex-wrap gap-2 sm:gap-4 mb-4">
//                   <div className="bg-gray-100 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
//                     {campaign.category}
//                   </div>
//                   <div className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm ${
//                     campaign.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
//                   }`}>
//                     {campaign.status === 'active' ? 'Active' : 'Inactive'}
//                   </div>
//                   <div className="bg-gray-100 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
//                     Start Date {formatDate(campaign.startDate)}
//                   </div>
//                 </div>
//               </div>
              
//               <div className="flex gap-2 sm:gap-4">
//                 <div className="text-center p-2 sm:p-4 border-r border-gray-200">
//                   <div className="text-xl sm:text-3xl font-bold text-gold-700">{campaign.subscribers}</div>
//                   <div className="text-xs sm:text-sm text-gray-500">Subscribers</div>
//                 </div>
//                 <div className="text-center p-2 sm:p-4">
//                   <div className="text-xl sm:text-3xl font-bold text-gold-700">{campaign.emailsSent}</div>
//                   <div className="text-xs sm:text-sm text-gray-500">Emails Sent</div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
        
//         {/* Tabs */}
//         <div className="border-b border-gray-200 mb-6 overflow-x-auto">
//           <div className="flex min-w-max">
//             <button 
//               className={`px-3 sm:px-4 py-2 text-sm sm:text-base font-medium ${
//                 activeTab === 'overview' 
//                   ? 'text-gold-700 border-b-2 border-gold-700' 
//                   : 'text-gray-500 hover:text-gold-500'
//               }`}
//               onClick={() => setActiveTab('overview')}
//             >
//               Overview
//             </button>
//             <button 
//               className={`px-3 sm:px-4 py-2 text-sm sm:text-base font-medium ${
//                 activeTab === 'subscribers' 
//                   ? 'text-gold-700 border-b-2 border-gold-700' 
//                   : 'text-gray-500 hover:text-gold-500'
//               }`}
//               onClick={() => setActiveTab('subscribers')}
//             >
//               Subscribers
//             </button>
//             <button 
//               className={`px-3 sm:px-4 py-2 text-sm sm:text-base font-medium ${
//                 activeTab === 'emails' 
//                   ? 'text-gold-700 border-b-2 border-gold-700' 
//                   : 'text-gray-500 hover:text-gold-500'
//               }`}
//               onClick={() => setActiveTab('emails')}
//             >
//               Emails
//             </button>
//           </div>
//         </div>
        
//         {/* Tab Content */}
//         {activeTab === 'overview' && (
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
//             {/* Recent Subscribers */}
//             <div className="bg-white border w-full border-gray-200 rounded-lg shadow-sm">
//               <div className="p-3 sm:p-4 border-b border-gray-200 flex justify-between items-center">
//                 <h3 className="font-semibold text-sm sm:text-base">Recent Subscribers</h3>
//                 <button 
//                   className="text-xs sm:text-sm text-gold-700 hover:underline"
//                   onClick={() => setActiveTab('subscribers')}
//                 >
//                   View All
//                 </button>
//               </div>
//               <div className="p-3 sm:p-4">
//                 <div className="space-y-3 sm:space-y-4">
//                   {subscribers.slice(0, 3).map(subscriber => (
//                     <div key={subscriber.id} className="flex items-center justify-between">
//                       <div className="truncate max-w-[100%] w-full">
//                         <div className="text-xs sm:text-sm text-gray-500 truncate">{subscriber.email}</div>
//                       </div>
//                       <div className="text-xs text-gray-500 whitespace-nowrap ml-2">
//                         Joined {formatDate(subscriber.joinedAt)}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
             
//               </div>
//             </div>
            
//             {/* Recent Emails */}
//             <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
//               <div className="p-3 sm:p-4 border-b border-gray-200 flex justify-between items-center">
//                 <h3 className="font-semibold text-sm sm:text-base">Recent Emails</h3>
//                 <button 
//                   className="text-xs sm:text-sm text-gold-700 hover:underline"
//                   onClick={() => setActiveTab('emails')}
//                 >
//                   View All
//                 </button>
//               </div>
//               <div className="p-3 sm:p-4">
//                 <div className="space-y-3 sm:space-y-4">
//                   {emails.slice(0, 3).map(email => (
//                     <div key={email.id} className="flex items-center justify-between">
//                       <div className="truncate max-w-[150px] sm:max-w-[200px]">
//                         <div className="font-medium text-sm sm:text-base truncate">{email.subject}</div>
//                         <div className="text-xs text-gray-500">
//                           {email.openRate}% open rate • {email.clickRate}% click rate
//                         </div>
//                       </div>
//                       <div className="text-xs text-gray-500 whitespace-nowrap ml-2">
//                         Sent {formatDate(email.sentAt)}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
              
//               </div>
//             </div>
//           </div>
//         )}
        
//         {activeTab === 'subscribers' && (
//        <div className="bg-white border border-gray-200 rounded-lg w-full shadow-sm">
//        <div className="p-3 sm:p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
//          <h3 className="font-semibold text-sm sm:text-base">All Subscribers</h3>
//          <div className="flex flex-row gap-2 w-full sm:w-auto">
//            <div className="relative flex-1">
//              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//              <input 
//                type="text" 
//                placeholder="Search..." 
//                className="pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 w-full"
//              />
//            </div>
//            {/* <div className="flex gap-2">
//              <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 hidden sm:block">
//                <Filter size={16} />
//              </button>
//              <button 
//                className="p-2 bg-black text-white rounded-lg hover:bg-gray-800 flex items-center text-xs sm:text-sm"
//                onClick={() => setShowAddSubscriberModal(true)}
//              >
//                <Plus size={16} className="mr-1" />
//                <span className="hidden sm:inline">Add</span>
//              </button>
//            </div> */}
//          </div>
//        </div>
     
//        {/* Scrollable table container */}
//        <div className="overflow-x-auto w-full">
//          <table className="min-w-full">
//            <thead className="bg-gray-50 text-left">
//              <tr>
//                <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
//                <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
//                <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
//                <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
//              </tr>
//            </thead>
//            <tbody className="divide-y divide-gray-200">
//              {subscribers.map(subscriber => (
//                <tr key={subscriber.id} className="hover:bg-gray-50">
//                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-[50px] lg:max-w-[120px]">{subscriber.source}</td>
//                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-[50px] lg:max-w-[120px]">
//                    {subscriber.email}
//                  </td>
//                  <td className="px-4 py-4 whitespace-nowrap">
//                    <span className={`px-2 py-1 text-xs rounded-full ${
//                      subscriber.status === 'active' 
//                        ? 'bg-green-100 text-green-800' 
//                        : 'bg-gray-100 text-gray-800'
//                    }`}>
//                      {subscriber.status}
//                    </span>
//                  </td>
//                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-[50px] lg:max-w-[120px]">
//                    {formatDate(subscriber.joinedAt)}
//                  </td>
//                  <td className="px-4 py-4 whitespace-nowrap text-right">
//                    <button className="text-gray-400 hover:text-gray-600">
//                      <MoreHorizontal size={16} />
//                    </button>
//                  </td>
//                </tr>
//              ))}
//            </tbody>
//          </table>
//        </div>
     
//        {subscribers.length === 0 && (
//          <div className="p-6 sm:p-8 text-center text-gray-500 text-sm sm:text-base">
//            No subscribers yet. Add your first subscriber!
//          </div>
//        )}
//      </div>
     
        
//         )}
        
//         {activeTab === 'emails' && (
//           <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
//             <div className="p-3 sm:p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
//               <h3 className="font-semibold text-sm sm:text-base">All Emails</h3>
//               <div className="flex space-x-2 w-full sm:w-auto">
//                 <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 hidden sm:block">
//                   <Download size={16} />
//                 </button>
//                 {/* <button 
//                   className="p-2 bg-black text-white rounded-lg hover:bg-gray-800 flex items-center text-xs sm:text-sm"
//                   onClick={() => setShowComposeEmailModal(true)}
//                 >
//                   <Send size={16} className="mr-1" /> 
//                   <span className="hidden sm:inline">Compose</span>
//                 </button> */}
//               </div>
//             </div>
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="bg-gray-50 text-left">
//                   <tr>
//                     <th className="px-4 sm:px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
//                     <th className="px-4 sm:px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Sent Date</th>
//                     {/* <th className="px-4 sm:px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th> */}
//                     <th className="px-4 sm:px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Open Rate</th>
//                     <th className="px-4 sm:px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Click Rate</th>
//                     {/* <th className="px-4 sm:px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"></th> */}
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-200">
//                   {emails.map(email => (
//                     <tr key={email.id} className="hover:bg-gray-50">
//                       <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-[50px] lg:max-w-[120px]">
//                         {email.subject}
//                       </td>
//                       <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-[50px] lg:max-w-[120px]">
//                         {formatDate(email.sentAt)}
//                       </td>
//                       {/* <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
//                         <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
//                           {email.status}
//                         </span>
//                       </td> */}
//                       <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center">
//                           <div className="w-12 sm:w-16 bg-gray-200 rounded-full h-2 mr-2">
//                             <div 
//                               className="bg-gold-500 h-2 rounded-full" 
//                               style={{ width: `${email.openRate}%` }}
//                             ></div>
//                           </div>
//                           <span className="text-xs sm:text-sm">{email.openRate}%</span>
//                         </div>
//                       </td>
//                       <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center">
//                           <div className="w-12 sm:w-16 bg-gray-200 rounded-full h-2 mr-2">
//                             <div 
//                               className="bg-gold-500 h-2 rounded-full" 
//                               style={{ width: `${email.clickRate}%` }}
//                             ></div>
//                           </div>
//                           <span className="text-xs sm:text-sm">{email.clickRate}%</span>
//                         </div>
//                       </td>
//                       {/* <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right">
//                         <button className="text-gray-400 hover:text-gray-600">
//                           <MoreHorizontal size={16} />
//                         </button>
//                       </td> */}
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//             {emails.length === 0 && (
//               <div className="p-6 sm:p-8 text-center text-gray-500 text-sm sm:text-base">
//                 No emails sent yet. Compose your first email!
//               </div>
//             )}
//           </div>
//         )}
//       </main>
      
//       {/* Add Subscriber Modal */}
//       {/* {showAddSubscriberModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md">
//             <h2 className="text-lg sm:text-xl font-semibold mb-4">Add New Subscriber</h2>
//             <div className="mb-4">
//               <label className="block text-gray-700 text-sm sm:text-base mb-2">Name</label>
//               <input
//                 type="text"
//                 className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gold-500 text-sm sm:text-base"
//                 placeholder="Enter subscriber name"
//                 value={newSubscriber.source}
//                 onChange={(e) => setNewSubscriber({...newSubscriber, source: e.target.value})}
//               />
//             </div>
//             <div className="mb-4">
//               <label className="block text-gray-700 text-sm sm:text-base mb-2">Email</label>
//               <input
//                 type="email"
//                 className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gold-500 text-sm sm:text-base"
//                 placeholder="Enter subscriber email"
//                 value={newSubscriber.email}
//                 onChange={(e) => setNewSubscriber({...newSubscriber, email: e.target.value})}
//               />
//             </div>
//             <div className="flex justify-end space-x-2">
//               <button
//                 className="px-3 sm:px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 text-sm sm:text-base"
//                 onClick={() => setShowAddSubscriberModal(false)}
//               >
//                 Cancel
//               </button>
//               <button
//                 className="px-3 sm:px-4 py-2 bg-black text-white rounded hover:bg-gray-800 text-sm sm:text-base"
//                 onClick={handleAddSubscriber}
//               >
//                 Add Subscriber
//               </button>
//             </div>
//           </div>
//         </div>
//       )} */}
      
//       {/* Compose Email Modal */}
//       {showComposeEmailModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
//             <h2 className="text-lg sm:text-xl font-semibold mb-4">Compose Email</h2>
//             <div className="mb-4">
//               <label className="block text-gray-700 text-sm sm:text-base mb-2">Subject</label>
//               <input
//                 type="text"
//                 className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gold-500 text-sm sm:text-base"
//                 placeholder="Enter email subject"
//                 value={newEmail.subject}
//                 onChange={(e) => setNewEmail({...newEmail, subject: e.target.value})}
//               />
//             </div>
//             <div className="mb-4">
//               <label className="block text-gray-700 text-sm sm:text-base mb-2">Content</label>
//               <textarea
//                 className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gold-500 text-sm sm:text-base"
//                 placeholder="Write your email content here..."
//                 rows={8}
//                 value={newEmail.content}
//                 onChange={(e) => setNewEmail({...newEmail, content: e.target.value})}
//               />
//             </div>
//             <div className="flex justify-end space-x-2">
//               <button
//                 className="px-3 sm:px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 text-sm sm:text-base"
//                 onClick={() => setShowComposeEmailModal(false)}
//               >
//                 Cancel
//               </button>
//               <button
//                 className="px-3 sm:px-4 py-2 bg-black text-white rounded hover:bg-gray-800 text-sm sm:text-base"
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