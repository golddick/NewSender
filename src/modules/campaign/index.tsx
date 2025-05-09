// "use client";

// import React, { useState, useEffect } from 'react';
// import { Plus, Eye, Mail, Users } from 'lucide-react';
// import Link from 'next/link';

// export default function CampaignDashboard() {
//   // State management
//   const [showCategoryModal, setShowCategoryModal] = useState(false);
//   const [showCampaignModal, setShowCampaignModal] = useState(false);
//   const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
//   const [campaigns, setCampaigns] = useState<{ 
//     id: string; 
//     name: string; 
//     description: string; 
//     categoryId: string; 
//     subscribers: number; 
//     emailsSent: number; 
//   }[]>([]);
//   const [newCategory, setNewCategory] = useState('');
//   const [newCampaign, setNewCampaign] = useState({
//     name: '',
//     description: '',
//     categoryId: ''
//   });
  
//   // Mock data for initial load
//   useEffect(() => {
//     setCategories([
//       { id: '1', name: 'Newsletter' },
//       { id: '2', name: 'Product Updates' }
//     ]);
    
//     setCampaigns([
//       { 
//         id: '1', 
//         name: 'Monthly Newsletter', 
//         description: 'Updates for our subscribers',
//         categoryId: '1',
//         subscribers: 1250,
//         emailsSent: 1250
//       },
//       { 
//         id: '2', 
//         name: 'New Feature Announcement', 
//         description: 'Announcing our latest features',
//         categoryId: '2',
//         subscribers: 3500,
//         emailsSent: 3200
//       }
//     ]);
//   }, []);
  
//   // Handlers
//   const handleAddCategory = () => {
//     if (newCategory.trim()) {
//       const newId = (categories.length + 1).toString();
//       setCategories([...categories, { id: newId, name: newCategory }]);
//       setNewCategory('');
//       setShowCategoryModal(false);
//     }
//   };
  
//   const handleAddCampaign = () => {
//     if (newCampaign.name.trim() && newCampaign.categoryId) {
//       const newId = (campaigns.length + 1).toString();
//       setCampaigns([
//         ...campaigns, 
//         { 
//           ...newCampaign, 
//           id: newId,
//           subscribers: 0,
//           emailsSent: 0
//         }
//       ]);
//       setNewCampaign({ name: '', description: '', categoryId: '' });
//       setShowCampaignModal(false);
//     }
//   };
  
//   return (
//     <div className="min-h-screen bg-white text-gray-800 w-full">
      
//       {/* Main Content */}
//       <main className="p-6">
//         {/* Stats and Actions Row */}
//         <div className="mb-8 flex flex-wrap gap-4 items-start justify-between">
//           {/* Categories Card */}
//           <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm flex-1">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-semibold">Categories</h2>
//               <button 
//                 onClick={() => setShowCategoryModal(true)}
//                 className="bg-black text-white p-2 rounded-full hover:bg-gray-800"
//               >
//                 <Plus size={20} />
//               </button>
//             </div>
//             <div className="text-4xl font-bold text-gold-500">
//               {categories.length}
//             </div>
//             <p className="text-gray-500">Total Categories</p>
//           </div>
          
//           {/* Campaigns Card */}
//           <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm flex-1">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-semibold">Campaigns</h2>
//               <button 
//                 onClick={() => setShowCampaignModal(true)}
//                 className="bg-black text-white p-2 rounded-full hover:bg-gray-800"
//               >
//                 <Plus size={20} />
//               </button>
//             </div>
//             <div className="text-4xl font-bold text-gold-500">
//               {campaigns.length}
//             </div>
//             <p className="text-gray-500">Active Campaigns</p>
//           </div>
          
//           {/* Total Subscribers Card */}
//           <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm flex-1">
//             <div className="flex items-center mb-4">
//               <Users className="mr-2 text-gold-500" size={24} />
//               <h2 className="text-xl font-semibold">Subscribers</h2>
//             </div>
//             <div className="text-4xl font-bold text-gold-500">
//               {campaigns.reduce((total, campaign) => total + campaign.subscribers, 0)}
//             </div>
//             <p className="text-gray-500">Total Subscribers</p>
//           </div>
          
//           {/* Total Emails Sent */}
//           <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm flex-1">
//             <div className="flex items-center mb-4">
//               <Mail className="mr-2 text-gold-500" size={24} />
//               <h2 className="text-xl font-semibold">Emails Sent</h2>
//             </div>
//             <div className="text-4xl font-bold text-gold-500">
//               {campaigns.reduce((total, campaign) => total + campaign.emailsSent, 0)}
//             </div>
//             <p className="text-gray-500">Total Emails Sent</p>
//           </div>
//         </div>
        
//         {/* Campaign List */}
//         <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
//           <div className="p-6 border-b border-gray-200">
//             <h2 className="text-xl font-semibold">All Campaigns</h2>
//           </div>
          
//           <div className="p-6">
//             {campaigns.length === 0 ? (
//               <div className="text-center p-8 text-gray-500">
//                 No campaigns yet. Create your first campaign!
//               </div>
//             ) : (
//               <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//                 {campaigns.map(campaign => (
//                   <div key={campaign.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
//                     <h3 className="text-lg font-semibold mb-2">{campaign.name}</h3>
//                     <p className="text-gray-500 text-sm mb-3">{campaign.description}</p>
//                     <div className="bg-gray-100 text-xs px-2 py-1 rounded-full inline-block mb-4">
//                       {categories.find(cat => cat.id === campaign.categoryId)?.name || 'Uncategorized'}
//                     </div>
                    
//                     <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
//                       <div className="flex items-center">
//                         <Users size={16} className="mr-1" />
//                         <span>{campaign.subscribers} subscribers</span>
//                       </div>
//                       <div className="flex items-center">
//                         <Mail size={16} className="mr-1" />
//                         <span>{campaign.emailsSent} sent</span>
//                       </div>
//                     </div>
                    
//                     <Link href={`/dashboard/campaigns/${campaign.id}`} className="hover:underline mb-2 block">
//                     <button className="flex items-center w-full justify-center bg-black text-white p-2 rounded hover:bg-gray-800 transition-colors">
//                       <Eye size={16} className="mr-2" />
//                       View Campaign
//                     </button>
//                     </Link>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </main>
      
//       {/* Category Modal */}
//       {showCategoryModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 w-full max-w-md">
//             <h2 className="text-xl font-semibold mb-4">Create New Category</h2>
//             <div className="mb-4">
//               <label className="block text-gray-700 mb-2">Category Name</label>
//               <input
//                 type="text"
//                 className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gold-500"
//                 placeholder="Enter category name"
//                 value={newCategory}
//                 onChange={(e) => setNewCategory(e.target.value)}
//               />
//             </div>
//             <div className="flex justify-end space-x-2">
//               <button
//                 className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
//                 onClick={() => setShowCategoryModal(false)}
//               >
//                 Cancel
//               </button>
//               <button
//                 className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
//                 onClick={handleAddCategory}
//               >
//                 Create
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
      
//       {/* Campaign Modal */}
//       {showCampaignModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 w-full max-w-md">
//             <h2 className="text-xl font-semibold mb-4">Create New Campaign</h2>
//             <div className="mb-4">
//               <label className="block text-gray-700 mb-2">Campaign Name</label>
//               <input
//                 type="text"
//                 className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gold-500"
//                 placeholder="Enter campaign name"
//                 value={newCampaign.name}
//                 onChange={(e) => setNewCampaign({...newCampaign, name: e.target.value})}
//               />
//             </div>
//             <div className="mb-4">
//               <label className="block text-gray-700 mb-2">Description</label>
//               <textarea
//                 className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gold-500"
//                 placeholder="Enter campaign description"
//                 // rows="3"
//                 value={newCampaign.description}
//                 onChange={(e) => setNewCampaign({...newCampaign, description: e.target.value})}
//               />
//             </div>
//             <div className="mb-4">
//               <label className="block text-gray-700 mb-2">Category</label>
//               <select
//                 className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gold-500"
//                 value={newCampaign.categoryId}
//                 onChange={(e) => setNewCampaign({...newCampaign, categoryId: e.target.value})}
//               >
//                 <option value="">Select a category</option>
//                 {categories.map(category => (
//                   <option key={category.id} value={category.id}>
//                     {category.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div className="flex justify-end space-x-2">
//               <button
//                 className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
//                 onClick={() => setShowCampaignModal(false)}
//               >
//                 Cancel
//               </button>
//               <button
//                 className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
//                 onClick={handleAddCampaign}
//               >
//                 Create
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


// "use client";

// import React, { useState, useEffect } from "react";
// import { Plus, Eye, Mail, Users, Loader, X } from "lucide-react";
// import Link from "next/link";
// import { createCategory } from "@/actions/add.category";
// import { useUser } from "@clerk/nextjs";
// import { createCampaign } from "@/actions/add.campaign";
// import { getCategoryByOwnerId } from "@/actions/get.category";
// import { getAllCampaignsByOwnerId } from "@/actions/get.campaign";
// import { deleteCategoryByName } from "@/actions/delete.category";
// import { toast } from "sonner";
// import { useRouter } from "next/navigation";

// export default function CampaignDashboard() {
//   const [showCategoryModal, setShowCategoryModal] = useState(false);
//   const [showCampaignModal, setShowCampaignModal] = useState(false);

//   const { user, isLoaded } = useUser();
//   const username = user?.username;
//   const [categories, setCategories] = useState<{ id: string; name: string ; description:string}[]>([]);
//   const [campaigns, setCampaigns] = useState<{
//     id: string;
//     name: string;
//     description: string;
//     categoryId: string;
//     subscribers: number;
//     emailsSent: number;
//   }[]>([]);

//   const [newCategory, setNewCategory] = useState({
//     name: "",
//     description: "",
//   });

//   const [newCampaign, setNewCampaign] = useState({
//     name: "",
//     description: "",
//     categoryId: "",
//   });


//   // Fetch data
//   useEffect(() => {
//     if (!user?.id) return;

//     const fetchData = async () => {
//       try {
//         const [catData, campData] = await Promise.all([
//           getCategoryByOwnerId({ newsLetterOwnerId: user.id }),
//           getAllCampaignsByOwnerId({ newsLetterOwnerId: user.id }),
//         ]);

//         if (Array.isArray(catData)) {
//           setCategories(
//             catData.map((category) => ({
//               id: category.id,
//               name: category.name,
//               description: category.description || "No description provided",
//             }))
//           );
//         } else {
//           console.error("Error fetching categories:", catData.error);
//         }

//         if (campData && Array.isArray(campData)) {
//           setCampaigns(
//             campData.map((campaign) => ({
//               id: campaign.id as string,
//               name: campaign.name,
//               description: campaign.description,
//               categoryId: campaign.categoryId,
//               subscribers: campaign.subscribers || 0,
//               emailsSent: campaign.emailsSent || 0,
//             }))
//           );
//         } else {
//           console.error("Error fetching campaigns:", campData?.error);
//         }
//       } catch (error) {
//         console.error("Error loading server action data", error);
//       }
//     };

//     fetchData();
//   }, [user?.id]);

//   // Create category
// const handleAddCategory = async () => {
//   // Validate inputs
//   if (!newCategory.name.trim()) {
//     toast.error("Category name cannot be empty");
//     return;
//   }

//   if (!username) {
//     toast.error("You must be logged in to create a category");
//     return;
//   }

//   try {
//     // Show loading state
//     const toastId = toast.loading("Creating category...");
    
//     const res = await createCategory({ 
//       name: newCategory.name.trim(), 
//       username ,
//       description: newCategory.description.trim()
//     });

//     // Check for API errors
//     if (!res.ok) {
//       const errorData = await res.json();
//       throw new Error(errorData.message || "Failed to create category");
//     }

//     const data = await res.json();
    
//     // Update state
//     setCategories((prev) => [...prev, data]);
//     setNewCategory({ name: "", description: "" });
//     setShowCategoryModal(false);
    
//     // Show success
//     toast.success(`Category "${data.name}" created successfully`, { 
//       id: toastId 
//     });

//   } catch (err) {
//     console.error("Error creating category:", err);
    
//     // Show error to user
//     toast.error(
//       err instanceof Error ? err.message : "Failed to create category"
//     );
    
//     // Keep modal open if error occurs
//     setShowCategoryModal(true);
//   }
// };

//   // Create campaign
//   const handleAddCampaign = async () => {
//     const { name, description, categoryId } = newCampaign;
//     const router = useRouter();
  
//     if (!name.trim()) {
//       toast.error("Campaign name is required");
//       return;
//     }
  
//     if (!categoryId) {
//       toast.error("Please select a category");
//       return;
//     }
  
//     if (!username) {
//       toast.error("User not authenticated");
//       return;
//     }
  
//     try {
//       const toastId = toast.loading("Creating campaign...");
      
//       const res = await createCampaign({ name, description, categoryId, username });
  
//       if (!res.ok) {
//         const errorData = await res.json();
//         throw new Error(errorData.message || "Failed to create campaign");
//       }
  
//       const data = await res.json();
      
//       setCampaigns((prev) => [...prev, data]);
//       setNewCampaign({ name: "", description: "", categoryId: "" });
//       setShowCampaignModal(false);
      
//       toast.success("Campaign created successfully", { id: toastId });
      
//       // Reevaluate path or refresh data
//       router.refresh(); // If using Next.js 13+ with server components
//       // OR: fetchCampaigns(); // If you have a data refetch function
      
//     } catch (err) {
//       console.error("Error creating campaign", err);
//       toast.error(
//         err instanceof Error ? err.message : "Failed to create campaign"
//       );
//     }
//   };

//   const handleDeleteCategory = async (categoryName: string) => {
//     // Show confirmation dialog first
//     const userConfirmed = confirm(
//       `Are you sure you want to delete the category "${categoryName}"? This will also delete all empty campaigns in this category.`
//     );
  
//     if (!userConfirmed) {
//       toast.info("Category deletion cancelled");
//       return;
//     }
  
//     try {
//       // Show loading state
//       const toastId = toast.loading(`Deleting category "${categoryName}"...`);
      
//       const result = await deleteCategoryByName(categoryName);
      
//       if (result.success) {
//         // Update local state
//         setCategories(categories.filter(cat => cat.name !== categoryName));
//         setCampaigns(campaigns.filter(camp => 
//           !categories.some(cat => cat.name === categoryName && cat.id === camp.categoryId)
//         ));
        
//         // Update toast to success
//         toast.success(result.message, { id: toastId });
//       } else {
//         // Update toast to error
//         toast.error(result.message, { id: toastId });
//       }
//     } catch (error) {
//       toast.error(
//         error instanceof Error ? error.message : "Failed to delete category"
//       );
//       console.error("Error deleting category:", error);
//     }
//   }

//   return (
//     <div className="min-h-screen bg-white text-gray-800 w-full">
//       <main className="p-6">
//         {/* Stats */}
//         <div className="mb-8 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
//           <StatCard
//             title="Categories"
//             count={categories.length}
//             icon={<Plus size={20} />}
//             onAdd={() => setShowCategoryModal(true)}
//           />
//           <StatCard
//             title="Campaigns"
//             count={campaigns.length}
//             icon={<Plus size={20} />}
//             onAdd={() => setShowCampaignModal(true)}
//           />
//           <StatCard
//             title="Subscribers"
//             count={campaigns.reduce((sum, c) => sum + c.subscribers, 0)}
//             icon={<Users size={24} />}
//           />
//           <StatCard
//             title="Emails Sent"
//             count={campaigns.reduce((sum, c) => sum + c.emailsSent, 0)}
//             icon={<Mail size={24} />}
//           />
//         </div>

//         {/* category list */}
//         <section className="bg-white border-none rounded-lg  mb-8">
//           <header className="border-none border-gray-200">
//             <h2 className="text-xs  font-semibold">All Categories</h2>
//           </header>
//           <div className="p-6">
//             {categories.length === 0 ? (
//               <p className="text-center text-gray-500">No categories yet.</p>
//             ) : (
//               <div className="flex flex-wrap gap-4 items-center">
//                 {categories.map((cat) => (
//                   <div key={cat.id} className="border-none gap-6 bg-gold-200 text-gold-700 rounded-lg hover:shadow p-2 px-4 flex items-center justify-center">
//                     <h3 className="text-[13px] font-semibold">{cat.name}</h3>
//                     {/* dellet btn */}
//                     <button
//                       className="ml-2 text-white hover:text-red-700 rounded-full bg-red-700 border-red-700 border px-2"
//                       onClick={() => handleDeleteCategory(cat.name)}
//                       disabled={!cat.name }
//                       >
//                         <X size={16} className="inline" />
//                       </button>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//           </section>

//         {/* Campaigns List */}
//         <section className="bg-white border border-gray-200 rounded-lg shadow-sm">
//           <header className="p-6 border-b border-gray-200">
//             <h2 className="text-xl font-semibold">All Campaigns</h2>
//           </header>
//           <div className="p-6">
//             {campaigns.length === 0 ? (
//               <p className="text-center text-gray-500">No campaigns yet.</p>
//             ) : (
//               <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//                 {campaigns.map((c) => (
//                   <div key={c.id} className="border p-4 rounded-lg hover:shadow">
//                     <h3 className="text-lg font-semibold">{c.name}</h3>
//                     <p className="text-sm text-gray-500 mb-2">{c.description}</p>
//                     <span className="inline-block text-xs bg-gray-100 px-2 py-1 rounded mb-4">
//                       {categories.find((cat) => cat.id === c.categoryId)?.name || "Uncategorized"}
//                     </span>
//                     <div className="flex justify-between text-sm text-gray-600">
//                       <span><Users size={16} className="inline mr-1" /> {c.subscribers} subs</span>
//                       <span><Mail size={16} className="inline mr-1" /> {c.emailsSent} sent</span>
//                     </div>
//                     <Link href={`/dashboard/campaigns/${c.id}`} className="mt-4 block">
//                       <button className="w-full mt-4 bg-black text-white py-2 rounded hover:bg-gray-800 flex items-center justify-center">
//                         <Eye size={16} className="mr-2" />
//                         View Campaign
//                       </button>
//                     </Link>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </section>
//       </main>

//       {/* Modals */}
//       {showCategoryModal && (
//         <Modal
//           title="Create New Category"
//           onClose={() => setShowCategoryModal(false)}
//           onSubmit={handleAddCategory}
//         >
//           <input
//             className="w-full p-2 border rounded"
//             placeholder="Category name"
//             value={newCategory.name}
//             onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
//           />
//           <textarea
//             className="w-full p-2 border rounded mt-4"
//             placeholder="Category description"
//             value={newCategory.description}
//             onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
//           />
//         </Modal>
//       )}

//       {showCampaignModal && (
//         <Modal
//           title="Create New Campaign"
//           onClose={() => setShowCampaignModal(false)}
//           onSubmit={handleAddCampaign}
//         >
//           <input
//             className="w-full p-2 mb-3 border rounded"
//             placeholder="Campaign name"
//             value={newCampaign.name}
//             onChange={(e) =>
//               setNewCampaign({ ...newCampaign, name: e.target.value })
//             }
//           />
//           <textarea
//             className="w-full p-2 mb-3 border rounded"
//             placeholder="Description"
//             value={newCampaign.description}
//             onChange={(e) =>
//               setNewCampaign({ ...newCampaign, description: e.target.value })
//             }
//           />
//           <select
//             className="w-full p-2 border rounded"
//             value={newCampaign.categoryId}
//             onChange={(e) =>
//               setNewCampaign({ ...newCampaign, categoryId: e.target.value })
//             }
//           >
//             <option value="">Select a category</option>
//             {categories.map((cat) => (
//               <option key={cat.id} value={cat.id}>
//                 {cat.name}
//               </option>
//             ))}
//           </select>
//         </Modal>
//       )}
//     </div>
//   );
// }

// // Reusable Components

// function StatCard({ title, count, icon, onAdd }: any) {
//   return (
//     <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm flex flex-col gap-2">
//       <div className="flex justify-between items-center">
//         <h3 className="text-xl font-semibold">{title}</h3>
//         {onAdd && (
//           <button className="bg-black text-white p-2 rounded-full" onClick={onAdd}>
//             {icon}
//           </button>
//         )}
//       </div>
//       <div className="text-4xl font-bold">{count}</div>
//     </div>
//   );
// }

// function Modal({ title, children, onClose, onSubmit }: any) {
//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg p-6 w-full max-w-md">
//         <h2 className="text-xl font-semibold mb-4">{title}</h2>
//         {children}
//         <div className="flex justify-end space-x-2 mt-4">
//           <button className="px-4 py-2 border rounded" onClick={onClose}>
//             Cancel
//           </button>
//           <button className="px-4 py-2 bg-black text-white rounded" onClick={onSubmit}>
//             Create
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }



// "use client";

// import React, { useState, useEffect } from "react";
// import { Plus, Eye, Mail, Users, Loader, X, Calendar } from "lucide-react";
// import Link from "next/link";
// import { useUser } from "@clerk/nextjs";
// import { useRouter } from "next/navigation";
// import { toast } from "sonner";
// import { createCategory } from "@/actions/add.category";
// import { createCampaign } from "@/actions/add.campaign";
// import { getCategoryByOwnerId } from "@/actions/get.category";
// import { getAllCampaignsByOwnerId } from "@/actions/get.campaign";
// import { deleteCategoryByName } from "@/actions/delete.category";

// export default function CampaignDashboard() {
//   const [showCategoryModal, setShowCategoryModal] = useState(false);
//   const [showCampaignModal, setShowCampaignModal] = useState(false);
//   const [isCreating, setIsCreating] = useState(false);
//   const [addDates, setAddDates] = useState(false);

//   const { user, isLoaded } = useUser();
//   const username = user?.username;
//   const router = useRouter();

//   const [categories, setCategories] = useState<{ _id: any; name: any; description: any }[]>([]);
//   const [campaigns, setCampaigns] = useState<{ 
//     id: any; 
//     name: any; 
//     description: any; 
//     categoryId: any; 
//     subscribers: any; 
//     emailsSent: any; 
//     startDate: any; 
//     endDate: any; 
//   }[]>([]);

//   const [newCategory, setNewCategory] = useState({
//     name: "",
//     description: "",
//   });

//   const [newCampaign, setNewCampaign] = useState({
//     name: "",
//     description: "",
//     categoryId: "",
//     startDate: "",
//     endDate: "",
//   });

//   useEffect(() => {
//     if (!user?.id) return;

//     const fetchData = async () => {
//       try {
//         const [catData, campData] = await Promise.all([
//           getCategoryByOwnerId({ newsLetterOwnerId: user.id }),
//           getAllCampaignsByOwnerId({ newsLetterOwnerId: user.id }),
//         ]);

//         if (Array.isArray(catData)) {
//           setCategories(catData);
//         } else {
//           toast.error("Failed to fetch categories");
//         }

//         if (Array.isArray(campData)) {
//           setCampaigns(campData);
//         } else {
//           toast.error("Failed to fetch campaigns");
//         }
//       } catch (err) {
//         console.error("Error fetching data:", err);
//         toast.error("Error loading dashboard data");
//       }
//     };

//     fetchData();
//   }, [user?.id]);

//   const handleAddCategory = async () => {
//     if (!newCategory.name.trim()) {
//       toast.error("Category name cannot be empty");
//       return;
//     }

//     if (!username) {
//       toast.error("You must be logged in to create a category");
//       return;
//     }

//     setIsCreating(true);
//     try {
//       const toastId = toast.loading("Creating category...");

//       const res = await createCategory({
//         name: newCategory.name.trim(),
//         description: newCategory.description.trim(),
//         username,
//       });

//       if (!res.ok) {
//         const errorData = await res.json();
//         throw new Error(errorData.message);
//       }

//       const data = await res.json();
//       setCategories((prev) => [...prev, data]);
//       setNewCategory({ name: "", description: "" });
//       setShowCategoryModal(false);

//       toast.success("Category created successfully", { id: toastId });
//       console.log("Category created:", data);
//     } catch (err) {
//       console.error("Error creating category:", err);
//       toast.error("Failed to create category");
//     } finally {
//       setIsCreating(false);
//     }
//   };

//   const handleAddCampaign = async () => {
//     const { name, description, categoryId, startDate, endDate } = newCampaign;

//     if (!name.trim()) {
//       toast.error("Campaign name is required");
//       return;
//     }

//     if (!categoryId) {
//       toast.error("Please select a category");
//       return;
//     }

//     if (!username) {
//       toast.error("User not authenticated");
//       return;
//     }

//     if (addDates && (!startDate || !endDate)) {
//       toast.error("Start and end dates are required");
//       return;
//     }

//     setIsCreating(true);
//     try {
//       const toastId = toast.loading("Creating campaign...");
//       console.log("Creating campaign with categoryId:", categoryId);

//       const campaignData = {
//         name,
//         description,
//         categoryId,
//         username,
//         ...(addDates && {
//           startDate: new Date(startDate).toISOString(),
//           endDate: new Date(endDate).toISOString(),
//         }),
//       };

//       const res = await createCampaign(campaignData);

//       if (!res.ok) {
//         const errorData = await res.json();
//         throw new Error(errorData.message);
//       }

//       const data = await res.json();

//       setCampaigns((prev) => [...prev, data]);
//       setNewCampaign({
//         name: "",
//         description: "",
//         categoryId: "",
//         startDate: "",
//         endDate: "",
//       });
//       setShowCampaignModal(false);
//       setAddDates(false);

//         toast.success("Campaign created successfully", { id: toastId });

//         console.log("Campaign created:", data);

//       router.refresh();
//     } catch (err) {
//       console.error("Error creating campaign:", err);
//       toast.error("Failed to create campaign");
//     } finally {
//       setIsCreating(false);
//     }
//   };

// interface DeleteCategoryResult {
//     success: boolean;
//     message: string;
//     categoryId?: string;
// }

// const handleDeleteCategory = async (categoryName: string): Promise<void> => {
//     const confirmed = confirm(`Delete category "${categoryName}"?`);
//     if (!confirmed) return;

//     try {
//         const toastId = toast.loading("Deleting category...");
//         const result: DeleteCategoryResult = await deleteCategoryByName(categoryName);

//         if (result.success) {
//             setCategories(categories.filter((cat) => cat.name !== categoryName));
//             setCampaigns(campaigns.filter((c) => c.categoryId !== result.categoryId));
//             toast.success(result.message, { id: toastId });
//             console.log("Category deleted:", result.categoryId);

//         } else {
//             toast.error(result.message);
//         }
//     } catch (err) {
//         toast.error("Failed to delete category");
//         console.error(err);
//     }
// };

//   if (!isLoaded) {
//     return <div className="flex justify-center items-center h-screen"><Loader className="animate-spin size-8" /></div>;
//   }

//   return (
//     <div className="min-h-screen bg-white text-gray-800 w-full">
//       {/* <ToastContainer /> */}
//       <main className="p-6">
//         <div className="mb-8 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
//           <StatCard title="Categories" count={categories.length} icon={<Plus size={20} />} onAdd={() => setShowCategoryModal(true)} />
//           <StatCard title="Campaigns" count={campaigns.length} icon={<Plus size={20} />} onAdd={() => setShowCampaignModal(true)} />
//           <StatCard title="Subscribers" count={campaigns.reduce((sum, c) => sum + c.subscribers, 0)} icon={<Users size={24} />} onAdd={undefined} />
//           <StatCard title="Emails Sent" count={campaigns.reduce((sum, c) => sum + c.emailsSent, 0)} icon={<Mail size={24} />} />
//         </div>

//         <section className="mb-8">
//           <h2 className="text-xs font-semibold mb-2">All Categories</h2>
//           <div className="flex flex-wrap gap-4">
//             {categories.map((cat) => (
//               <div key={cat._id} className="border px-4 py-2 rounded-lg flex items-center">
//                 <span>{cat.name}</span>
//                 <button className="ml-2 text-red-600" onClick={() => handleDeleteCategory(cat.name)}>
//                   <X size={16} />
//                 </button>
//               </div>
//             ))}
//           </div>
//         </section>

//         <section>
//           <h2 className="text-xl font-semibold mb-4">All Campaigns</h2>
//           {campaigns.length === 0 ? (
//             <p className="text-gray-500">No campaigns yet.</p>
//           ) : (
//             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
//               {campaigns.map((c) => (
//                 <div key={c.id} className="border p-4 rounded-lg">
//                   <h3 className="text-lg font-bold">{c.name}</h3>
//                   <p className="text-sm text-gray-600">{c.description}</p>
//                   {c.startDate && c.endDate && (
//                     <div className="text-xs text-gray-500">
//                       <Calendar className="inline mr-1" size={14} />
//                       {new Date(c.startDate).toLocaleDateString()} - {new Date(c.endDate).toLocaleDateString()}
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           )}
//         </section>
//       </main>

//       {/* Category Modal */}
//       {showCategoryModal && (
//         <Modal onClose={() => setShowCategoryModal(false)} title="Add Category">
//           <input
//             type="text"
//             className="input mb-2"
//             placeholder="Name"
//             value={newCategory.name}
//             onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
//           />
//           <textarea
//             className="input mb-2"
//             placeholder="Description"
//             value={newCategory.description}
//             onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
//           />
//           <button className="btn" disabled={isCreating} onClick={handleAddCategory}>
//             {isCreating ? "Creating..." : "Create Category"}
//           </button>
//         </Modal>
//       )}

//       {/* Campaign Modal */}
//       {showCampaignModal && (
//         <Modal onClose={() => setShowCampaignModal(false)} title="Add Campaign">
//           <input
//             type="text"
//             className="input mb-2"
//             placeholder="Campaign Name"
//             value={newCampaign.name}
//             onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
//           />
//           <textarea
//             className="input mb-2"
//             placeholder="Description"
//             value={newCampaign.description}
//             onChange={(e) => setNewCampaign({ ...newCampaign, description: e.target.value })}
//           />
//           <select
//             className="input mb-2"
//             value={newCampaign.categoryId}
//             onChange={(e) => setNewCampaign({ ...newCampaign, categoryId: e.target.value })}
//           >
//             <option value="">Select Category</option>
//             {categories.map((cat) => (
//               <option key={cat._id} value={cat._id}>
//                 {cat.name}
//               </option>
//             ))}
//           </select>

//           <label className="flex items-center mb-2">
//             <input
//               type="checkbox"
//               className="mr-2"
//               checked={addDates}
//               onChange={() => setAddDates(!addDates)}
//             />
//             Add start and end date
//           </label>

//           {addDates && (
//             <>
//               <input
//                 type="date"
//                 className="input mb-2"
//                 value={newCampaign.startDate}
//                 onChange={(e) => setNewCampaign({ ...newCampaign, startDate: e.target.value })}
//               />
//               <input
//                 type="date"
//                 className="input mb-2"
//                 value={newCampaign.endDate}
//                 onChange={(e) => setNewCampaign({ ...newCampaign, endDate: e.target.value })}
//               />
//             </>
//           )}

//           <button className="btn" disabled={isCreating} onClick={handleAddCampaign}>
//             {isCreating ? "Creating..." : "Create Campaign"}
//           </button>
//         </Modal>
//       )}
//     </div>
//   );
// }

// // Reusable Components

// const Modal: React.FC<{ onClose: () => void; title: string; children: React.ReactNode }> = ({ onClose, title, children }) => (
//   <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex justify-center items-center">
//     <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
//       <h2 className="text-lg font-semibold mb-4">{title}</h2>
//       {children}
//       <button className="absolute top-2 right-2 text-gray-500" onClick={onClose}>
//         <X />
//       </button>
//     </div>
//   </div>
// );

// interface StatCardProps {
//   title: string;
//   count: number;
//   icon: React.ReactNode;
//   onAdd?: () => void | null;
// }

// const StatCard: React.FC<StatCardProps> = ({ title, count, icon, onAdd = null }) => (
//   <div className="border p-4 rounded-md flex items-center justify-between">
//     <div>
//       <p className="text-sm text-gray-600">{title}</p>
//       <p className="text-xl font-bold">{count}</p>
//     </div>
//     {onAdd ? (
//       <button onClick={onAdd} className="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600">
//         {icon}
//       </button>
//     ) : (
//       icon
//     )}
//   </div>
// );





"use client";

import React, { useState, useEffect } from "react";
import { Plus, Eye, Mail, Users, Loader, X, Calendar } from "lucide-react";
import Link from "next/link";
import { createCategory } from "@/actions/add.category";
import { useUser } from "@clerk/nextjs";
import { createCampaign } from "@/actions/add.campaign";
import { getCategoryByOwnerId } from "@/actions/get.category";
import { getAllCampaignsByOwnerId } from "@/actions/get.campaign";
import { deleteCategoryByName } from "@/actions/delete.category";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function CampaignDashboard() {
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [addDates, setAddDates] = useState(false);
  const [err, setError] = useState<string | null>(null);
  const [campaignErr, setCampaignErr] = useState<string | null>(null);


  const { user, isLoaded } = useUser();
  const username = user?.username;
  const router = useRouter();

  const [categories, setCategories] = useState<{ _id: string; name: string; description: string }[]>([]);
  const [campaigns, setCampaigns] = useState<{
    _id: string;
    name: string;
    description: string;
    category: string;
    subscribers: number;
    emailsSent: number;
    startDate?: Date; 
    endDate?: Date; 
  }[]>([]);

  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
  });

  const [newCampaign, setNewCampaign] = useState({
    name: "",
    description: "",
    category: "",
    startDate: "",
    endDate: "",
  });

  // Fetch data
  useEffect(() => {
    if (!user?.id) return;

    const fetchData = async () => {
      try {
        const [catData, campData] = await Promise.all([
          getCategoryByOwnerId({ newsLetterOwnerId: user.id }),
          getAllCampaignsByOwnerId({ newsLetterOwnerId: user.id }),
        ]);

        if (Array.isArray(catData)) {
          setCategories(
            catData.map((category) => ({
              _id: category._id,
              name: category.name,
              description: category.description || "No description provided",
            }))
          );
        } else {
          console.error("Error fetching categories:", catData.error);
        }

        if (campData && Array.isArray(campData)) {
          setCampaigns(
            campData.map((campaign) => ({
              _id: campaign._id,
              name: campaign.name,
              description: campaign.description,
              category: campaign.category.toString(), // Convert ObjectId to string
              subscribers: campaign.subscribers.length, // Convert array to count
              emailsSent: campaign.emailsSent || 0,
              startDate: campaign.startDate ? new Date(campaign.startDate) : undefined,
              endDate: campaign.endDate ? new Date(campaign.endDate) : undefined,
            }))
          );
        } else {
          console.error("Error fetching campaigns:", campData?.error);
        }
      } catch (error) {
        console.error("Error loading server action data", error);
      }
    };

    fetchData();
  }, [user?.id]);

  // Create category
  const handleAddCategory = async () => {
    if (!newCategory.name.trim()) {
      toast.error("Category name cannot be empty");
      return;
    }
  
    if (!username) {
      toast.error("You must be logged in to create a category");
      return;
    }
  
    setIsCreating(true);
    const toastId = toast.loading("Creating category...");
  
    try {
      const res = await createCategory({ 
        name: newCategory.name.trim(), 
        username,
        description: newCategory.description.trim()
      });
  
      if (res.error) {
        setError(res.error);
        throw new Error(res.error);
      }
  
      if (res.data) {
        console.log("Category created:", res.data);
        toast.success(`Category "${res.data.name}" created successfully`, { id: toastId });
      } else {
        toast.error("Failed to create category: No data returned");
        setError(`Category creation failed: ${JSON.stringify(res)}`);
        console.log("Category creation failed:", res);
      }
  
      // Clear input & close modal
      setNewCategory({ name: "", description: "" });
      setShowCategoryModal(false);
  
      // Refresh page to get latest data
      router.refresh();
    } catch (err) {
      console.error("Error creating category:", err);
      setError(err instanceof Error ? err.message : "Failed to create category");
    } finally {
      setIsCreating(false);
    }
  };
  
  

  // Create campaign
  const handleAddCampaign = async () => {
    const { name, description, category, startDate, endDate } = newCampaign;
  
    if (!name.trim()) {
      toast.error("Campaign name is required");
      return;
    }
  
    if (!category) {
      toast.error("Please select a category");
      return;
    }
  
    if (!username) {
      toast.error("User not authenticated");
      return;
    }
  
    if (addDates && (!startDate || !endDate)) {
      toast.error("Please provide both start and end dates");
      return;
    }
  
    setIsCreating(true);
    try {
      const toastId = toast.loading("Creating campaign...");
  
      const campaignData = {
        name,
        description,
        category,
        username,
        ...(addDates && {
          startDate: new Date(startDate).toISOString(),
          endDate: new Date(endDate).toISOString(),
        }),
      };
  
      const res = await createCampaign(campaignData);
  
      if (res.error) {
        throw new Error(res.error);
      }
  
      const data = res.data;
      if (!data) {
        throw new Error("No data returned from campaign creation");
        
      }
  
      // Ensure data contains required properties, default missing ones
      setCampaigns((prev) => [
        ...prev,
        {
          _id: data._id || "",  // Ensure _id is present
          name: data.name || name, // Ensure name is present
          description: data.description || description, // Ensure description is present
          category: data.category || category, // Ensure category is present
          subscribers: data.subscribers?.length || 0, // Default to 0 if no subscribers
          emailsSent: data.emailsSent || 0, // Default to 0 if not provided
          startDate: data.startDate ? new Date(data.startDate) : undefined,
          endDate: data.endDate ? new Date(data.endDate) : undefined,
        },
      ]);
  
      // Reset form state after successful campaign creation
      setNewCampaign({
        name: "",
        description: "",
        category: "",
        startDate: "",
        endDate: "",
      });
      setShowCampaignModal(false);
      setAddDates(false);
  
      toast.success("Campaign created successfully", { id: toastId });
      router.refresh();
    } catch (err) {
      console.error("Error creating campaign", err);
      toast.error(err instanceof Error ? err.message : "Failed to create campaign");
      setCampaignErr(err instanceof Error ? err.message : "Failed to create campaign");

    } finally {
      setIsCreating(false);
    }
  };
  

  const handleDeleteCategory = async (categoryName: string) => {
    const userConfirmed = confirm(
      `Are you sure you want to delete the category "${categoryName}"? This will also delete all empty campaigns in this category.`
    );

    if (!userConfirmed) {
      toast.info("Category deletion cancelled");
      return;
    }

    try {
      const toastId = toast.loading(`Deleting category "${categoryName}"...`);
      
      const result = await deleteCategoryByName(categoryName);
      
      if (result.success) {
        setCategories(categories.filter(cat => cat.name !== categoryName));
        setCampaigns(campaigns.filter(camp => 
          !categories.some(cat => cat.name === categoryName && cat._id === camp.category)
        ));
        toast.success(result.message, { id: toastId });
      } else {
        toast.error(result.message, { id: toastId });
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete category"
      );
      console.error("Error deleting category:", error);
    }
  };

  if (!isLoaded) {
    return <div className="flex justify-center items-center h-screen"><Loader className="animate-spin size-8" /></div>;
  }

  console.log("Categories:", categories);
    console.log("Campaigns:", campaigns);

  return (
    <div className="min-h-screen bg-white text-gray-800 w-full">
      <main className="p-6">
        {/* Stats */}
        <div className="mb-8 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Categories"
            count={categories.length}
            icon={<Plus size={20} />}
            onAdd={() => setShowCategoryModal(true)}
          />
          <StatCard
            title="Campaigns"
            count={campaigns.length}
            icon={<Plus size={20} />}
            onAdd={() => setShowCampaignModal(true)}
          />
          <StatCard
            title="Subscribers"
            count={campaigns.reduce((sum, c) => sum + c.subscribers, 0)}
            icon={<Users size={24} />}
          />
          <StatCard
            title="Emails Sent"
            count={campaigns.reduce((sum, c) => sum + c.emailsSent, 0)}
            icon={<Mail size={24} />}
          />
        </div>

        {/* Category list */}
        <section className="bg-white border-none rounded-lg mb-8">
          <header className="border-none border-gray-200">
            <h2 className="text-xs font-semibold">All Categories</h2>
          </header>
          <div className="p-6">
            {categories.length === 0 ? (
              <p className="text-center text-gray-500">No categories yet.</p>
            ) : (
              <div className="flex flex-wrap gap-4 items-center">
                {categories.map((cat) => (
                  <div key={cat._id} className="border-none gap-6 bg-gold-200 text-gold-700 rounded-lg hover:shadow p-2 px-4 flex items-center justify-center">
                    <h3 className="text-[13px] font-semibold">{cat.name}</h3>
                    <button
                      className="ml-2 text-white hover:text-red-700 rounded-full bg-red-700 border-red-700 border px-2"
                      onClick={() => handleDeleteCategory(cat.name)}
                      disabled={!cat.name}
                    >
                      <X size={16} className="inline" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Campaigns List */}
        <section className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <header className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold">All Campaigns</h2>
          </header>
          <div className="p-6">
            {campaigns.length === 0 ? (
              <p className="text-center text-gray-500">No campaigns yet.</p>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {campaigns.map((c) => (
                  <div key={c._id} className="border p-4 rounded-lg hover:shadow">
                    <h3 className="text-lg font-semibold">{c.name}</h3>
                    <p className="text-sm text-gray-500 mb-2">{c.description}</p>
                    {c.startDate && c.endDate && (
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <Calendar size={14} className="mr-1" />
                        {new Date(c.startDate).toLocaleDateString()} - {new Date(c.endDate).toLocaleDateString()}
                      </div>
                    )}
                    <span className="inline-block text-xs bg-gray-100 px-2 py-1 rounded mb-4">
                      {categories.find((cat) => cat._id === c.category)?.name || "Uncategorized"}
                    </span>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span><Users size={16} className="inline mr-1" /> {c.subscribers} subs</span>
                      <span><Mail size={16} className="inline mr-1" /> {c.emailsSent} sent</span>
                    </div>
                    <Link href={`/dashboard/campaigns/${c._id}`} className="mt-4 block">
                      <button className="w-full mt-4 bg-black text-white py-2 rounded hover:bg-gray-800 flex items-center justify-center">
                        <Eye size={16} className="mr-2" />
                        View Campaign
                      </button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Modals */}
      {showCategoryModal && (
        <Modal
          title="Create New Category"
          onClose={() => setShowCategoryModal(false)}
          onSubmit={handleAddCategory}
          isSubmitting={isCreating}
        >
          <input
            className="w-full p-2 border rounded"
            placeholder="Category name"
            value={newCategory.name}
            onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
          />
          <textarea
            className="w-full p-2 border rounded mt-4"
            placeholder="Category description"
            value={newCategory.description}
            onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
          />
           {err && <p className="text-red-500">{err}</p>}
        </Modal>
      )}

      {showCampaignModal && (
        <Modal
          title="Create New Campaign"
          onClose={() => {
            setShowCampaignModal(false);
            setAddDates(false);
          }}
          onSubmit={handleAddCampaign}
          isSubmitting={isCreating}
        >
          <input
            className="w-full p-2 mb-3 border rounded"
            placeholder="Campaign name"
            value={newCampaign.name}
            onChange={(e) =>
              setNewCampaign({ ...newCampaign, name: e.target.value })
            }
          />
          <textarea
            className="w-full p-2 mb-3 border rounded"
            placeholder="Description"
            value={newCampaign.description}
            onChange={(e) =>
              setNewCampaign({ ...newCampaign, description: e.target.value })
            }
          />
          <select
            className="w-full p-2 mb-3 border rounded"
            value={newCampaign.category}
            onChange={(e) =>
              setNewCampaign({ ...newCampaign, category: e.target.value })
            }
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>

          <div className="flex items-center mb-3">
            <input
              type="checkbox"
              id="addDates"
              checked={addDates}
              onChange={() => setAddDates(!addDates)}
              className="mr-2"
            />
            <label htmlFor="addDates">Add start and end dates</label>
          </div>

          {addDates && (
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <label className="block text-sm mb-1">Start Date</label>
                <input
                  type="date"
                  className="w-full p-2 border rounded"
                  value={newCampaign.startDate}
                  onChange={(e) =>
                    setNewCampaign({ ...newCampaign, startDate: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm mb-1">End Date</label>
                <input
                  type="date"
                  className="w-full p-2 border rounded"
                  value={newCampaign.endDate}
                  onChange={(e) =>
                    setNewCampaign({ ...newCampaign, endDate: e.target.value })
                  }
                />
              </div>
            </div>
          )}

          {campaignErr && <p className="text-red-500">{campaignErr}</p>}
        </Modal>
      )}
    </div>
  );
}

// Reusable Components
function StatCard({ title, count, icon, onAdd }: any) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">{title}</h3>
        {onAdd && (
          <button className="bg-black text-white p-2 rounded-full" onClick={onAdd}>
            {icon}
          </button>
        )}
      </div>
      <div className="text-4xl font-bold">{count}</div>
    </div>
  );
}

function Modal({ title, children, onClose, onSubmit, isSubmitting }: any) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        {children}
       
        <div className="flex justify-end space-x-2 mt-4">
          <button 
            className="px-4 py-2 border rounded"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button 
            className="px-4 py-2 bg-black text-white rounded flex items-center"
            onClick={onSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader className="animate-spin mr-2 size-4" />}
            {isSubmitting ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}