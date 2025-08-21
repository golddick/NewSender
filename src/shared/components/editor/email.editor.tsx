



// "use client";

// import React, { useEffect, useRef, useState, useCallback } from "react";
// import EmailEditor, { EditorRef, EmailEditorProps } from "react-email-editor";
// import { DefaultJsonData } from "@/assets/mails/default";
// import { useClerk } from "@clerk/nextjs";
// import { useRouter } from "next/navigation";
// import { Button } from "@nextui-org/react";
// import toast from "react-hot-toast";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

// // import { getIntegrations } from "@/actions/application-Integration/application";
// // import { getCampaignsByIntegration } from "@/actions/campaign/get-campaign";
// import { saveEmailToDatabase } from "@/actions/email/addEmail";
// import { getEmailByTitle } from "@/actions/email/getEmail";
// // import { getSubscribers, getSubscribersByIntegration } from "@/actions/subscriber/get.subscribers";
// import { sendInstantEmail } from "@/actions/email/sendInstantEmail";
// import { EmailType } from "@prisma/client";

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   Save,
//   Send,
//   Users,
//   Mail,
//   Bot,
//   Bolt,
//   Loader2,
//   Target,
//   Globe,
//   Calendar,
//   SendHorizonalIcon,
// } from "lucide-react";
// import Loader from "@/components/Loader";

// interface Subscriber {
//   email: string;
//   name?: string;
// }

// const Emaileditor = ({ subjectTitle }: { subjectTitle: string }) => {
//   const [subject, setSubject] = useState(subjectTitle);
//   const [loading, setLoading] = useState(true);
//   const [jsonData, setJsonData] = useState<any>(DefaultJsonData);
//   const [integrations, setIntegrations] = useState<{ name: string; id: string }[]>([]);
//   const [campaigns, setCampaigns] = useState<
//     { name: string; id: string; integrationId: string; trigger: string }[]
//   >([]);
//   const [emailId, setEmailId] = useState("");
//   const [selectedIntegration, setSelectedIntegration] = useState("");
//   const [selectedCampaign, setSelectedCampaign] = useState("");
//   const [selectedIntegrationName, setSelectedIntegrationName] = useState("");
//   const [allSubscribers, setAllSubscribers] = useState<Subscriber[]>([]);
//   const [integrationSubscribers, setIntegrationSubscribers] = useState<Subscriber[]>([]);
//   const [emailType, setEmailType] = useState<EmailType>('INSTANT');
//   const [scheduleDate, setScheduleDate] = useState<Date | null>(new Date());
//   const [scheduleTime, setScheduleTime] = useState<string>("12:00");
//   const [isSending, setIsSending] = useState(false);
//   const emailEditorRef = useRef<EditorRef>(null);
//   const router = useRouter();
//   const { user } = useClerk();
//   const adminEmail = user?.emailAddresses?.[0]?.emailAddress;

//   // Load all subscribers (regardless of integration)
//   const loadAllSubscribers = useCallback(async () => {
//     if (!user?.id) return;

//     try {
//       const result = await getSubscribers();
//       if (result.error) throw new Error(result.error);

//       setAllSubscribers(
//         (result.subscribers || []).map((sub: any) => ({
//           email: sub.email,
//           name: sub.name ?? undefined,
//         }))
//       );
//     } catch (err) {
//       console.error("Load all subscribers error:", err);
//       toast.error("Failed to load all subscribers");
//       setAllSubscribers([]);
//     }
//   }, [user?.id]);

//   // Load subscribers under specific integration
//   const loadIntegrationSubscribers = useCallback(
//     async (integrationId: string, campaignId?: string) => {
//       if (!user?.id || !integrationId) return;

//       try {
//         const result = await getSubscribersByIntegration({
//           integrationId,
//           campaign: campaignId,
//           ownerId: user.id,
//         });

//         if (result.error) throw new Error(result.error);

//         setIntegrationSubscribers(
//           (result.subscribers || []).map((sub: any) => ({
//             email: sub.email,
//             name: sub.name ?? undefined,
//           }))
//         );
//       } catch (err) {
//         console.error("Load integration subscribers error:", err);
//         toast.error("Failed to load integration subscribers");
//         setIntegrationSubscribers([]);
//       }
//     },
//     [user?.id]
//   );

//   useEffect(() => {
//     if (!user) {
//       toast.error("User not authenticated.");
//       return;
//     }

//     const init = async () => {
//       try {
//         const [emailResult, integrationRes] = await Promise.all([
//           getEmailByTitle({ title: subject, newsLetterOwnerId: user.id }),
//           getIntegrations(),
//         ]);

//         if (emailResult.success && emailResult.data) {
//           const emailDetails = emailResult.data;


//             // Handle both JSON and HTML content
//           let content;
//           if (typeof emailDetails.content === "string") {
//             try {
//               // Try to parse as JSON
//               content = JSON.parse(emailDetails.content);
//             } catch {
//               // If parsing fails, create a basic JSON structure with HTML content
//               content = {
//                 body: {
//                   rows: [{
//                     columns: [{
//                       contents: `<div>${emailDetails.content}</div>`,
//                       type: "text",
//                       content: `<div>${emailDetails.content}</div>`
//                     }]
//                   }]
//                 }
//               };
//             }
//           } else {
//             content = emailDetails.content;
//           }

//           console.log("Loaded email content:", content);
//           console.log("Loaded email details:", emailDetails);

//           // const content =
//           //   typeof emailDetails.content === "string"
//           //     ? JSON.parse(emailDetails.content)
//           //     : emailDetails.content;
          
//           setJsonData(content);
//           setEmailType(emailDetails.emailType || 'INSTANT');

//           if (emailDetails.integration?.id) {
//             const integrationId = emailDetails.integration.id;
//             setSelectedIntegration(integrationId);
//             setSelectedIntegrationName(emailDetails.integration.name);

//             // Load campaigns for this integration
//             const campaignRes = await getCampaignsByIntegration(integrationId);
//             const loadedCampaigns = Array.isArray(campaignRes.data?.campaigns)
//               ? campaignRes.data.campaigns.map((c: any) => ({
//                   id: c.id,
//                   name: c.name,
//                   integrationId,
//                   trigger: c.trigger,
//                 }))
//               : [];
//             setCampaigns(loadedCampaigns);

//             if (emailDetails.campaign?.id) {
//               setSelectedCampaign(emailDetails.campaign.id);
//             }
//           }

//           setEmailId(emailDetails.id);
//         }

//         setIntegrations(
//           integrationRes?.data?.map((i: any) => ({
//             id: i.id,
//             name: i.name,
//           })) || []
//         );

//         // Always load all subscribers
//         await loadAllSubscribers();

//         // Load integration subscribers if integration exists
//         if (selectedIntegration) {
//           await loadIntegrationSubscribers(selectedIntegration, selectedCampaign);
//         }

//         setLoading(false);
//       } catch (error) {
//         console.error("Init error:", error);
//         toast.error("Failed to load initial data");
//         setLoading(false);
//       }
//     };

//     init();
//   }, [user, subject, loadAllSubscribers, loadIntegrationSubscribers, selectedIntegration, selectedCampaign]);

//   const handleIntegrationChange = async (
//     e: React.ChangeEvent<HTMLSelectElement>
//   ) => {
//     const integrationId = e.target.value;
//     setSelectedIntegration(integrationId);
//     setSelectedIntegrationName(integrations.find((i) => i.id === integrationId)?.name || "");
//     setSelectedCampaign("");

//     if (integrationId) {
//       // Load campaigns for selected integration
//       try {
//         const campaignRes = await getCampaignsByIntegration(integrationId);
//         const loadedCampaigns = Array.isArray(campaignRes.data?.campaigns)
//           ? campaignRes.data.campaigns.map((c: any) => ({
//               id: c.id,
//               name: c.name,
//               integrationId,
//               trigger: c.trigger,
//             }))
//           : [];
//         setCampaigns(loadedCampaigns);

//         // Load subscribers for this integration
//         await loadIntegrationSubscribers(integrationId);
//       } catch (err) {
//         console.error("Integration change error:", err);
//         toast.error("Failed to load integration data");
//       }
//     } else {
//       setCampaigns([]);
//       setIntegrationSubscribers([]);
//     }
//   };

//   const handleCampaignChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const campaignId = e.target.value;
//     setSelectedCampaign(campaignId);
//     if (selectedIntegration) {
//       await loadIntegrationSubscribers(selectedIntegration, campaignId);
//     }
//   };



//   const onReady: EmailEditorProps["onReady"] = useCallback(() => {
//     if (emailEditorRef.current?.editor) {
//       // Always use loadDesign - we've converted HTML to JSON structure
//       emailEditorRef.current.editor.loadDesign(jsonData);
//     }
//   }, [jsonData]);

//   const saveDraft = async () => {
//     emailEditorRef.current?.editor?.exportHtml(async ({ design, html }) => {
//       try {
//         const scheduledDateTime = new Date(scheduleDate || new Date());
//         const [hours, minutes] = scheduleTime.split(':').map(Number);
//         scheduledDateTime.setHours(hours, minutes);

//         const res = await saveEmailToDatabase({
//           title: subject,
//           content: JSON.stringify(design),
//           emailId: emailId,
//           textContent: html,
//           emailSubject: subject,
//           template: campaigns.find(c => c.id === selectedCampaign)?.trigger || "",
//           newsLetterOwnerId: user?.id!,
//           campaignId: selectedCampaign,
//           integrationId: selectedIntegration,
//           emailType: emailType,
//           scheduleDate: scheduledDateTime,
//           scheduleTime: scheduleTime,
//           adminEmail: adminEmail || "",
//         });

//         if (!res.success) {
//           toast.error(res.error || "Failed to save draft");
//           return;
//         }

//         toast.success("Draft saved successfully");
//         router.push("/dashboard/auto-email");
//       } catch (err) {
//         console.error("Save error:", err);
//         toast.error("Failed to save draft");
//       }
//     });
//   };

//   const sendEmailToSubscribers = async (subscribersToSend: Subscriber[], isIntegrationSpecific = false) => {
//     setIsSending(true);
//     emailEditorRef.current?.editor?.exportHtml(async ({ design, html }) => {
//       setJsonData(design);

//       if (subscribersToSend.length === 0) {
//         toast.error("No subscribers found");
//         setIsSending(false);
//         return;
//       }

//       try {
//         let result;
        
//         if (emailType === 'INSTANT') {
//           result = await sendInstantEmail({
//             userEmails: subscribersToSend.map((s) => s.email),
//             subject: subject,
//             htmlContent: html,
//             content: design, 
//             emailTemplateId: emailId,
//             newsLetterOwnerId: user?.id!,
//             integrationId: isIntegrationSpecific ? selectedIntegration : undefined,
//             campaignId: isIntegrationSpecific ? selectedCampaign : undefined,
//             adminEmail: adminEmail || "",
//           });
//         } else if (emailType === 'SCHEDULE' && scheduleDate) {
//           const res = await saveEmailToDatabase({
//             title: subject,
//             content: JSON.stringify(design), 
//             emailId: emailId,
//             textContent: html,
//             emailSubject: subject,
//             template: campaigns.find(c => c.id === selectedCampaign)?.trigger || "",
//             newsLetterOwnerId: user?.id!,
//             campaignId: isIntegrationSpecific ? selectedCampaign : undefined,
//             integrationId: isIntegrationSpecific ? selectedIntegration : undefined,
//             emailType: emailType,
//             scheduleDate: scheduleDate,
//             scheduleTime: scheduleTime,
//             adminEmail: adminEmail || "",
//           });

//           if (!res.success) {
//             toast.error(res.error || "Failed to schedule email");
//             setIsSending(false);
//             return;
//           }
//         }

//         if (!result?.success && emailType === 'INSTANT') {
//           toast.error(result?.error || "Email failed to send");
//           setIsSending(false);
//           return;
//         }

//         toast.success(
//           emailType === 'SCHEDULE' 
//             ? `Email scheduled for ${scheduleDate?.toLocaleString()}`
//             : `Email sent to ${subscribersToSend.length} subscribers`
//         );
//         router.push("/dashboard/auto-email");
//       } catch (err) {
//         console.error("Send email error:", err);
//         toast.error("Failed to send email");
//       } finally {
//         setIsSending(false);
//       }
//     });
//   };

//   const filteredCampaigns = campaigns.filter(
//     (c) => c.integrationId === selectedIntegration
//   );

//   if (loading) {
//     return (
//      <Loader/>
//     );
//   }

//   return (
//     <div className="w-full h-full relative p-2 md:p-4">
//       {/* Email Type Selection */}
//       <Card className="mb-4">
//         <CardHeader className="bg-white text-black border shadow-md rounded-lg">
//           <CardTitle className="flex items-center">
//             <Target className="w-5 h-4 mr-2" />
//             Email Type
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="p-2 sm:p-4">
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
//             <div
//               className={`p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition-all ${
//                 emailType === "DRAFT" ? "border-yellow-500 bg-yellow-50" : "border-gray-200 hover:border-gray-300"
//               }`}
//               onClick={() => setEmailType("DRAFT")}
//             >
//               <div className="flex items-center mb-1">
//                 <div className="bg-orange-100 p-2 rounded-full mr-3">
//                   <Bolt className="w-4 h-4 text-orange-600" />
//                 </div>
//                 <h3 className="text-sm sm:text-[15px] font-semibold text-black">Draft Email</h3>
//               </div>
//               <p className="text-gray-600 text-xs">
//                 Save mail and send later.
//               </p>
//             </div>
//             <div
//               className={`p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition-all ${
//                 emailType === 'INSTANT' ? "border-yellow-500 bg-yellow-50" : "border-gray-200 hover:border-gray-300"
//               }`}
//               onClick={() => setEmailType("INSTANT")}
//             >
//               <div className="flex items-center mb-1">
//                 <div className="bg-orange-100 p-2 rounded-full mr-3">
//                   <SendHorizonalIcon className="w-4 h-4 text-orange-600" />
//                 </div>
//                 <h3 className="text-sm sm:text-[15px] font-semibold text-black">Instant Email</h3>
//               </div>
//               <p className="text-gray-600 text-xs">
//                 Send immediately to subscribers.
//               </p>
//             </div>
//             <div
//               className={`p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition-all ${
//                 emailType === "SCHEDULE" ? "border-yellow-500 bg-yellow-50" : "border-gray-200 hover:border-gray-300"
//               }`}
//               onClick={() => setEmailType("SCHEDULE")}
//             >
//               <div className="flex items-center mb-1">
//                 <div className="bg-red-100 p-2 rounded-full mr-3">
//                   <Calendar className="w-4 h-4 text-red-600" />
//                 </div>
//                 <h3 className="text-sm sm:text-[15px] font-semibold text-black">Schedule Email</h3>
//               </div>
//               <p className="text-gray-600 text-xs">
//                 Schedule email to be sent later.
//               </p>
//             </div>
//             <div
//               className={`p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition-all ${
//                 emailType === "AUTOMATED" ? "border-yellow-500 bg-yellow-50" : "border-gray-200 hover:border-gray-300"
//               }`}
//               onClick={() => setEmailType("AUTOMATED")}
//             >
//               <div className="flex items-center mb-1">
//                 <div className="bg-purple-100 p-2 rounded-full mr-3">
//                   <Bot className="w-4 h-4 text-purple-600" />
//                 </div>
//                 <h3 className="text-sm sm:text-[15px] font-semibold text-black">Automated Email</h3>
//               </div>
//               <p className="text-gray-600 text-xs">
//                 Automated mail based on actions.
//               </p>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Schedule Date Picker */}
//       {emailType === 'SCHEDULE' && (
//         <Card className="mb-4">
//           <CardHeader className="bg-white text-black border shadow-md rounded-lg">
//             <CardTitle className="flex items-center">
//               <Calendar className="w-5 h-4 mr-2" />
//               Schedule Email
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="p-2 sm:p-4 grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4">
//             <div>
//               <label className="block text-sm font-medium mb-1">Schedule Date</label>
//               <DatePicker
//                 selected={scheduleDate}
//                 onChange={(date) => setScheduleDate(date)}
//                 minDate={new Date()}
//                 className="border rounded px-3 py-2 w-full text-sm"
//                 dateFormat="MMMM d, yyyy"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-1">Schedule Time</label>
//               <input
//                 type="time"
//                 value={scheduleTime}
//                 onChange={(e) => setScheduleTime(e.target.value)}
//                 className="border rounded px-3 py-2 w-full text-sm"
//               />
//             </div>
//           </CardContent>
//         </Card>
//       )}

//       {/* Integration and Campaign Selection */}
//       <div className="w-full border-t bg-white p-2 sm:p-4 mb-4 rounded-lg shadow-sm">
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 sm:gap-4">
//           <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full md:w-auto">
//             {integrations.length > 0 && (
//               <select
//                 value={selectedIntegration}
//                 onChange={handleIntegrationChange}
//                 className="border rounded px-3 py-2 text-sm w-full"
//               >
//                 <option value="">Select Integrated App</option>
//                 {integrations.map((int) => (
//                   <option key={int.id} value={int.id}>
//                     {int.name}
//                   </option>
//                 ))}
//               </select>
//             )}
            
//             {filteredCampaigns.length > 0 && selectedIntegration && (
//               <select
//                 value={selectedCampaign}
//                 onChange={handleCampaignChange}
//                 className="border rounded px-3 py-2 text-sm w-full"
//               >
//                 <option value="">Select Campaign</option>
//                 {filteredCampaigns.map((camp) => (
//                   <option key={camp.id} value={camp.id}>
//                     {camp.name}
//                   </option>
//                 ))}
//               </select>
//             )}
//           </div>

//           <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full md:w-auto">
//             <Button
//               className="bg-transparent border border-black/30 text-black text-sm w-full"
//               onPress={saveDraft}
//               size="sm"
//             >
//               <Save className="w-4 h-4 mr-1" /> Save Draft
//             </Button>
//           </div>
//         </div>
//       </div>

//       {/* Email Subject and Editor */}
//       <div className="w-full h-full border shadow-md rounded-md p-2 sm:p-4 mb-4 relative bg-white">
//         <div className="mb-2 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 w-full">
//           <label className="block text-sm font-medium text-black min-w-[100px]">Email Subject:</label>
//           <input
//             type="text"
//             value={subject}
//             onChange={(e) => setSubject(e.target.value)}
//             className="w-full border rounded px-3 py-2 text-sm"
//             placeholder="Enter subject here"
//           />
//         </div>

//         <div className="h-[500px] sm:h-[600px]">
//           <EmailEditor ref={emailEditorRef} onReady={onReady} />
//         </div>
//       </div>

//       {/* Send Buttons */}
//       <div className="w-full bg-white p-2 sm:p-4 rounded-lg shadow-sm sticky bottom-0 z-10 border-t">
//         <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
//           {/* Button to send to ALL subscribers */}
//           <Button
//             className="bg-black text-white text-sm w-full"
//             onPress={() => sendEmailToSubscribers(allSubscribers, false)}
//             isDisabled={isSending || allSubscribers.length === 0}
//             size="sm"
//             isLoading={isSending}
//             startContent={<Globe className="w-4 h-4" />}
//           >
//             {allSubscribers.length > 0
//               ? emailType === 'SCHEDULE'
//                 ? `Schedule for All (${allSubscribers.length}) subscribers`
//                 : `Send to All (${allSubscribers.length}) subscribers`
//               : "No Subscribers"}
//           </Button>

//           {/* Button to send to integration-specific subscribers */}
//           {selectedIntegration && (
//             <Button
//               className="bg-gold-600 text-black text-sm w-full"
//               onPress={() => sendEmailToSubscribers(integrationSubscribers, true)}
//               isDisabled={isSending || integrationSubscribers.length === 0}
//               size="sm"
//               isLoading={isSending}
//               startContent={<Target className="w-4 h-4" />}
//             >
//               {integrationSubscribers.length > 0
//                 ? emailType === 'SCHEDULE'
//                   ? `Schedule for Integration (${integrationSubscribers.length}) subscribers`
//                   : `Send to Integration (${integrationSubscribers.length}) subscribers`
//                 : "No Seleted App Subscribers"}
//             </Button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Emaileditor;






// "use client";

// import React, { useEffect, useRef, useState, useCallback } from "react";
// import EmailEditor, { EditorRef, EmailEditorProps } from "react-email-editor";
// import { DefaultJsonData } from "@/assets/mails/default";
// import { useClerk } from "@clerk/nextjs";
// import { useRouter } from "next/navigation";
// import { Button } from "@nextui-org/react";
// import toast from "react-hot-toast";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

// import { getLogUserCampaigns } from "@/actions/campaign/get-campaign";
// import { saveEmailToDatabase } from "@/actions/email/addEmail";
// import { getEmailByTitle } from "@/actions/email/getEmail";
// import { getSubscribers } from "@/actions/subscriber/get.subscribers";
// import { sendInstantEmail } from "@/actions/email/sendInstantEmail";
// import { EmailType } from "@prisma/client";

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   Save,
//   Users,
//   Mail,
//   Bot,
//   Bolt,
//   Loader2,
//   Target,
//   Globe,
//   Calendar,
//   SendHorizonal,
// } from "lucide-react";
// import { Skeleton } from "@/components/ui/skeleton";
// import Loader from "@/components/Loader";

// interface Subscriber {
//   email: string;
//   name?: string;
// }

// interface Campaign {
//   id: string;
//   name: string;
//   description?: string;
//   type?: string;
//   emails: any[];
// }

// const EmailEditorPage = ({ subjectTitle }: { subjectTitle: string }) => {
//   const [subject, setSubject] = useState(subjectTitle);
//   const [loading, setLoading] = useState(true);
//   const [jsonData, setJsonData] = useState<any>(DefaultJsonData);
//   const [campaigns, setCampaigns] = useState<Campaign[]>([]);
//   const [campaignsLoading, setCampaignsLoading] = useState(false);
//   const [emailId, setEmailId] = useState("");
//   const [selectedCampaign, setSelectedCampaign] = useState("");
//   const [allSubscribers, setAllSubscribers] = useState<Subscriber[]>([]);
//   const [subscribersLoading, setSubscribersLoading] = useState(false);
//   const [emailType, setEmailType] = useState<EmailType>("INSTANT");
//   const [scheduleDate, setScheduleDate] = useState<Date | null>(new Date());
//   const [scheduleTime, setScheduleTime] = useState<string>("12:00");
//   const [isSending, setIsSending] = useState(false);
//   const [isSaving, setIsSaving] = useState(false);
//   const emailEditorRef = useRef<EditorRef>(null);
//   const router = useRouter();
//   const { user } = useClerk();
//   const adminEmail = user?.emailAddresses?.[0]?.emailAddress;

//   // Load all subscribers
//   const loadAllSubscribers = useCallback(async () => {
//     if (!user?.id) return;
//     setSubscribersLoading(true);

//     try {
//       const result = await getSubscribers();
//       if (result.error) throw new Error(result.error);

//       setAllSubscribers(
//         (result.subscribers || []).map((sub: any) => ({
//           email: sub.email,
//           name: sub.name ?? undefined,
//         }))
//       );
//     } catch (err) {
//       console.error("Load subscribers error:", err);
//       toast.error("Failed to load subscribers");
//       setAllSubscribers([]);
//     } finally {
//       setSubscribersLoading(false);
//     }
//   }, [user?.id]);

//   // Load campaigns
//   const loadCampaigns = useCallback(async () => {
//     if (!user?.id) return;
//     setCampaignsLoading(true);

//     try {
//       const campaignsRes = await getLogUserCampaigns();
//       if (Array.isArray(campaignsRes)) {
//         setCampaigns(
//           campaignsRes.map((campaign: any) => ({
//             id: campaign.id,
//             name: campaign.name,
//             description: campaign.description,
//             type: campaign.type,
//             emails: campaign.emails,
//           }))
//         );
//       }
//     } catch (error) {
//       console.error("Load campaigns error:", error);
//       toast.error("Failed to load campaigns");
//       setCampaigns([]);
//     } finally {
//       setCampaignsLoading(false);
//     }
//   }, [user?.id]);

//   useEffect(() => {
//     if (!user) {
//       toast.error("User not authenticated.");
//       return;
//     }

//     const init = async () => {
//       setLoading(true);
//       try {
//         const [emailResult] = await Promise.all([
//           getEmailByTitle({ title: subject, newsLetterOwnerId: user.id }),
//           loadCampaigns(),
//           loadAllSubscribers(),
//         ]);

//         if (emailResult.success && emailResult.data) {
//           const emailDetails = emailResult.data;

//           let content;
//           if (typeof emailDetails.content === "string") {
//             try {
//               content = JSON.parse(emailDetails.content);
//             } catch {
//               content = {
//                 body: {
//                   rows: [
//                     {
//                       columns: [
//                         {
//                           contents: `<div>${emailDetails.content}</div>`,
//                           type: "text",
//                           content: `<div>${emailDetails.content}</div>`,
//                         },
//                       ],
//                     },
//                   ],
//                 },
//               };
//             }
//           } else {
//             content = emailDetails.content;
//           }

//           setJsonData(content);
//           setEmailType(emailDetails.emailType || "INSTANT");
//           setEmailId(emailDetails.id);

//           if (emailDetails.campaign?.id) {
//             setSelectedCampaign(emailDetails.campaign.id);
//           }
//         }
//       } catch (error) {
//         console.error("Init error:", error);
//         toast.error("Failed to load initial data");
//       } finally {
//         setLoading(false);
//       }
//     };

//     init();
//   }, [user, subject, loadCampaigns, loadAllSubscribers]);

//   const onReady: EmailEditorProps["onReady"] = useCallback(() => {
//     if (emailEditorRef.current?.editor) {
//       emailEditorRef.current.editor.loadDesign(jsonData);
//     }
//   }, [jsonData]);

//   const saveDraft = async () => {
//     setIsSaving(true);
//     emailEditorRef.current?.editor?.exportHtml(async ({ design, html }) => {
//       try {
//         const scheduledDateTime = new Date(scheduleDate || new Date());
//         const [hours, minutes] = scheduleTime.split(":").map(Number);
//         scheduledDateTime.setHours(hours, minutes);

//         const res = await saveEmailToDatabase({
//           title: subject,
//           content: JSON.stringify(design),
//           emailId: emailId,
//           textContent: html,
//           emailSubject: subject,
//           template: campaigns.find((c) => c.id === selectedCampaign)?.type || "",
//           newsLetterOwnerId: user?.id!,
//           campaignId: selectedCampaign,
//           emailType: emailType,
//           scheduleDate: scheduledDateTime,
//           scheduleTime: scheduleTime,
//           adminEmail: adminEmail || "",
//         });

//         if (!res.success) {
//           throw new Error(res.error || "Failed to save draft");
//         }

//         toast.success("Draft saved successfully");
//         router.push("/dashboard/auto-email");
//       } catch (err: any) {
//         console.error("Save error:", err);
//         toast.error(err.message || "Failed to save draft");
//       } finally {
//         setIsSaving(false);
//       }
//     });
//   };

//   const sendEmailToSubscribers = async () => {
//     setIsSending(true);
//     emailEditorRef.current?.editor?.exportHtml(async ({ design, html }) => {
//       setJsonData(design);

//       if (allSubscribers.length === 0) {
//         toast.error("No subscribers found");
//         setIsSending(false);
//         return;
//       }

//       try {
//         let result;

//         if (emailType === "INSTANT") {
//           result = await sendInstantEmail({
//             userEmails: allSubscribers.map((s) => s.email),
//             subject: subject,
//             htmlContent: html,
//             content: design,
//             emailTemplateId: emailId,
//             newsLetterOwnerId: user?.id!,
//             campaignId: selectedCampaign,
//             adminEmail: adminEmail || "",
//           });
//         } else if (emailType === "SCHEDULE" && scheduleDate) {
//           const res = await saveEmailToDatabase({
//             title: subject,
//             content: JSON.stringify(design),
//             emailId: emailId,
//             textContent: html,
//             emailSubject: subject,
//             template: campaigns.find((c) => c.id === selectedCampaign)?.type || "",
//             newsLetterOwnerId: user?.id!,
//             campaignId: selectedCampaign,
//             emailType: emailType,
//             scheduleDate: scheduleDate,
//             scheduleTime: scheduleTime,
//             adminEmail: adminEmail || "",
//           });

//           if (!res.success) {
//             throw new Error(res.error || "Failed to schedule email");
//           }
//         }

//         if (!result?.success && emailType === "INSTANT") {
//           throw new Error(result?.error || "Email failed to send");
//         }

//         toast.success(
//           emailType === "SCHEDULE"
//             ? `Email scheduled for ${scheduleDate?.toLocaleString()}`
//             : `Email sent to ${allSubscribers.length} subscribers`
//         );
//         router.push("/dashboard/auto-email");
//       } catch (err: any) {
//         console.error("Send email error:", err);
//         toast.error(err.message || "Failed to send email");
//       } finally {
//         setIsSending(false);
//       }
//     });
//   };

//   if (loading) {
//     return <Loader />;
//   }

//   return (
//     <div className="w-full min-h-screen relative p-2 md:p-4 space-y-4">
//       {/* Email Type Selection */}
//       <Card className="border-none shadow-none">
//         <CardHeader className="bg-transparent p-3 sm:p-6">
//           <CardTitle className="flex items-center text-base sm:text-lg">
//             <Target className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
//             Email Type
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="p-3 sm:p-6">
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
//             {[
//               {
//                 type: "DRAFT",
//                 icon: Bolt,
//                 title: "Draft Email",
//                 description: "Save mail and send later",
//                 color: "bg-orange-100 text-orange-600",
//               },
//               {
//                 type: "INSTANT",
//                 icon: SendHorizonal,
//                 title: "Instant Email",
//                 description: "Send immediately to subscribers",
//                 color: "bg-blue-100 text-blue-600",
//               },
//               {
//                 type: "SCHEDULE",
//                 icon: Calendar,
//                 title: "Schedule Email",
//                 description: "Schedule email to be sent later",
//                 color: "bg-red-100 text-red-600",
//               },
//             ].map((item) => (
//               <div
//                 key={item.type}
//                 className={`p-3 sm:p-4 border rounded-lg cursor-pointer transition-all ${
//                   emailType === item.type
//                     ? "border-primary bg-primary/10"
//                     : "border-gray-200 hover:border-gray-300"
//                 }`}
//                 onClick={() => setEmailType(item.type as EmailType)}
//               >
//                 <div className="flex items-center mb-2">
//                   <div className={`${item.color} p-2 rounded-full mr-3`}>
//                     <item.icon className="w-3 h-3 sm:w-4 sm:h-4" />
//                   </div>
//                   <h3 className="text-xs sm:text-sm font-semibold">{item.title}</h3>
//                 </div>
//                 <p className="text-xs text-gray-500">{item.description}</p>
//               </div>
//             ))}
//           </div>
//         </CardContent>
//       </Card>

//       {/* Schedule Date Picker */}
//       {emailType === "SCHEDULE" && (
//         <Card className="border shadow-sm">
//           <CardHeader className="bg-gray-50 p-3 sm:p-6">
//             <CardTitle className="flex items-center text-base sm:text-lg">
//               <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
//               Schedule Email
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="p-3 sm:p-6">
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
//               <div>
//                 <label className="block text-xs sm:text-sm font-medium mb-1">
//                   Schedule Date
//                 </label>
//                 <DatePicker
//                   selected={scheduleDate}
//                   onChange={(date) => setScheduleDate(date)}
//                   minDate={new Date()}
//                   className="w-full rounded-md border border-gray-300 p-2 text-xs sm:text-sm"
//                   dateFormat="MMMM d, yyyy"
//                 />
//               </div>
//               <div>
//                 <label className="block text-xs sm:text-sm font-medium mb-1">
//                   Schedule Time
//                 </label>
//                 <input
//                   type="time"
//                   value={scheduleTime}
//                   onChange={(e) => setScheduleTime(e.target.value)}
//                   className="w-full rounded-md border border-gray-300 p-2 text-xs sm:text-sm"
//                 />
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       )}

//       {/* Campaign Selection and Save Button */}
//       <div className="bg-white p-3 sm:p-4 rounded-lg border shadow-sm">
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
//           <div className="flex-1 min-w-0">
//             {campaignsLoading ? (
//               <Skeleton className="w-full h-8 sm:h-10 rounded-md" />
//             ) : campaigns.length > 0 ? (
//               <select
//                 value={selectedCampaign}
//                 onChange={(e) => setSelectedCampaign(e.target.value)}
//                 className="w-full rounded-md border border-gray-300 p-2 text-xs sm:text-sm"
//                 disabled={campaignsLoading}
//               >
//                 <option value="">Select Campaign</option>
//                 {campaigns.map((campaign) => (
//                   <option key={campaign.id} value={campaign.id} className="p-2 truncate">
//                     {campaign.name}
//                   </option>
//                 ))}
//               </select>
//             ) : (
//               <p className="text-xs sm:text-sm text-gray-500">No campaigns available</p>
//             )}
//           </div>
//           <div className="flex-shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
//             <Button
//               className="w-full sm:w-auto"
//               size="sm"
//               color="primary"
//               variant="bordered"
//               onPress={saveDraft}
//               isLoading={isSaving}
//               startContent={!isSaving && <Save className="w-3 h-3 sm:w-4 sm:h-4" />}
//             >
//               {isSaving ? "Saving..." : "Save Draft"}
//             </Button>
            
//             <Button
//               className="w-full sm:w-auto"
//               size="sm"
//               color="primary"
//               onPress={sendEmailToSubscribers}
//               isDisabled={isSending || allSubscribers.length === 0 || subscribersLoading}
//               isLoading={isSending}
//               startContent={!isSending && <SendHorizonal className="w-3 h-3 sm:w-4 sm:h-4" />}
//             >
//               {subscribersLoading ? (
//                 "Loading subscribers..."
//               ) : allSubscribers.length > 0 ? (
//                 emailType === "SCHEDULE" ? (
//                   `Schedule (${allSubscribers.length})`
//                 ) : (
//                   `Send (${allSubscribers.length})`
//                 )
//               ) : (
//                 "No subscribers"
//               )}
//             </Button>
//           </div>
//         </div>
//       </div>

//       {/* Email Subject and Editor */}
//       <div className="w-full border shadow-sm rounded-lg p-3 sm:p-4 bg-white">
//         <div className="mb-3 sm:mb-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
//           <label className="block text-xs sm:text-sm font-medium text-nowrap">
//             Email Subject:
//           </label>
//           <input
//             type="text"
//             value={subject}
//             onChange={(e) => setSubject(e.target.value)}
//             className="w-full rounded-md border border-gray-300 p-2 text-xs sm:text-sm"
//             placeholder="Enter subject here"
//           />
//         </div>

//         <div className="h-[calc(100vh-400px)] sm:h-[500px] lg:h-[600px] rounded-md overflow-y-scroll scrollbar-hide border-none">
//           <EmailEditor 
//             ref={emailEditorRef} 
//             onReady={onReady} 
//             minHeight="100%"
//             style={{ minHeight: '100%' }}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EmailEditorPage;



"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import EmailEditor, { EditorRef, EmailEditorProps } from "react-email-editor";
import { DefaultJsonData } from "@/assets/mails/default";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/react";
import toast from "react-hot-toast";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useMediaQuery } from "@/hooks/use-media-query";

import { getLogUserCampaigns } from "@/actions/campaign/get-campaign";
import { saveEmailToDatabase } from "@/actions/email/addEmail";
import { getEmailByTitle } from "@/actions/email/getEmail";
import { getSubscribers } from "@/actions/subscriber/get.subscribers";
import { sendInstantEmail } from "@/actions/email/sendInstantEmail";
import { EmailType } from "@prisma/client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Save,
  Bolt,
  Target,
  Calendar,
  SendHorizonal,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Loader from "@/components/Loader";

interface Subscriber {
  email: string;
  name?: string;
}

interface Campaign {
  id: string;
  name: string;
  description?: string;
  type?: string;
  emails: any[];
}

const EmailEditorPage = ({ subjectTitle }: { subjectTitle: string }) => {
  const [subject, setSubject] = useState(subjectTitle);
  const [loading, setLoading] = useState(true);
  const [jsonData, setJsonData] = useState<any>(DefaultJsonData);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [campaignsLoading, setCampaignsLoading] = useState(false);
  const [emailId, setEmailId] = useState("");
  const [selectedCampaign, setSelectedCampaign] = useState("");
  const [allSubscribers, setAllSubscribers] = useState<Subscriber[]>([]);
  const [subscribersLoading, setSubscribersLoading] = useState(false);
  const [emailType, setEmailType] = useState<EmailType>("DRAFT");
  const [scheduleDate, setScheduleDate] = useState<Date | null>(new Date());
  const [scheduleTime, setScheduleTime] = useState<string>("12:00");
  const [isSending, setIsSending] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const emailEditorRef = useRef<EditorRef>(null);
  const router = useRouter();
  const { user } = useClerk();
  const adminEmail = user?.emailAddresses?.[0]?.emailAddress;

  const isMobile = useMediaQuery("(max-width: 640px)");
  const isTablet = useMediaQuery("(min-width: 641px) and (max-width: 1024px)");

  const loadAllSubscribers = useCallback(async () => {
    if (!user?.id) return;
    setSubscribersLoading(true);

    try {
      const result = await getSubscribers();
      if (result.error) throw new Error(result.error);

      setAllSubscribers(
        (result.subscribers || []).map((sub: any) => ({
          email: sub.email,
          name: sub.name ?? undefined,
        }))
      );
    } catch (err) {
      console.error("Load subscribers error:", err);
      toast.error("Failed to load subscribers");
      setAllSubscribers([]);
    } finally {
      setSubscribersLoading(false);
    }
  }, [user?.id]);

  const loadCampaigns = useCallback(async () => {
    if (!user?.id) return;
    setCampaignsLoading(true);

    try {
      const campaignsRes = await getLogUserCampaigns();
      if (Array.isArray(campaignsRes)) {
        setCampaigns(
          campaignsRes.map((campaign: any) => ({
            id: campaign.id,
            name: campaign.name,
            description: campaign.description,
            type: campaign.type,
            emails: campaign.emails,
          }))
        );
      }
    } catch (error) {
      console.error("Load campaigns error:", error);
      toast.error("Failed to load campaigns");
      setCampaigns([]);
    } finally {
      setCampaignsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (!user) {
      toast.error("User not authenticated.");
      return;
    }

    const init = async () => {
      setLoading(true);
      try {
        const [emailResult] = await Promise.all([
          getEmailByTitle({ title: subject, newsLetterOwnerId: user.id }),
          loadCampaigns(),
          loadAllSubscribers(),
        ]);

        if (emailResult.success && emailResult.data) {
          const emailDetails = emailResult.data;

          let content;
          if (typeof emailDetails.content === "string") {
            try {
              content = JSON.parse(emailDetails.content);
            } catch {
              content = {
                body: {
                  rows: [
                    {
                      columns: [
                        {
                          contents: `<div>${emailDetails.content}</div>`,
                          type: "text",
                          content: `<div>${emailDetails.content}</div>`,
                        },
                      ],
                    },
                  ],
                },
              };
            }
          } else {
            content = emailDetails.content;
          }

          setJsonData(content);
          setEmailType(emailDetails.emailType || "DRAFT");
          setEmailId(emailDetails.id);

          if (emailDetails.campaign?.id) {
            setSelectedCampaign(emailDetails.campaign.id);
          }
        }
      } catch (error) {
        console.error("Init error:", error);
        toast.error("Failed to load initial data");
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [user, subject, loadCampaigns, loadAllSubscribers]);

  const onReady: EmailEditorProps["onReady"] = useCallback(() => {
    if (emailEditorRef.current?.editor) {
      emailEditorRef.current.editor.loadDesign(jsonData);
    }
  }, [jsonData]);

  const saveDraft = async () => {
    setIsSaving(true);
    setEmailType("DRAFT");
    emailEditorRef.current?.editor?.exportHtml(async ({ design, html }) => {
      try {
        const scheduledDateTime = new Date(scheduleDate || new Date());
        const [hours, minutes] = scheduleTime.split(":").map(Number);
        scheduledDateTime.setHours(hours, minutes);

        const res = await saveEmailToDatabase({
          title: subject,
          content: JSON.stringify(design),
          emailId: emailId,
          textContent: html,
          emailSubject: subject,
          template: campaigns.find((c) => c.id === selectedCampaign)?.type || "",
          newsLetterOwnerId: user?.id!,
          campaignId: selectedCampaign,
          emailType: "DRAFT",
          scheduleDate: scheduledDateTime,
          scheduleTime: scheduleTime,
          adminEmail: adminEmail || "",
        });

        if (!res.success) {
          throw new Error(res.error || "Failed to save draft");
        }

        toast.success("Draft saved successfully");
        router.push("/dashboard/auto-email");
      } catch (err: any) {
        console.error("Save error:", err);
        toast.error(err.message || "Failed to save draft");
      } finally {
        setIsSaving(false);
      }
    });
  };

  const sendEmailToSubscribers = async () => {
  setIsSending(true);

  emailEditorRef.current?.editor?.exportHtml(async ({ design, html }) => {
    setJsonData(design);

    if (allSubscribers.length === 0) {
      toast.error("No subscribers found");
      setIsSending(false);
      return;
    }

          if(emailType === 'DRAFT'){
        toast.error("Cannot send email as it's a draft");
        setIsSending(false);
        return;
      }

    try {
      let result;

      // 🚀 Case 1: Sending instantly
      if (emailType === "INSTANT") {
        // Always save/update the email in DB first (in case it was draft before)
        const saveRes = await saveEmailToDatabase({
          title: subject,
          content: JSON.stringify(design),
          emailId: emailId,
          textContent: html,
          emailSubject: subject,
          template: campaigns.find((c) => c.id === selectedCampaign)?.type || "",
          newsLetterOwnerId: user?.id!,
          campaignId: selectedCampaign,
          emailType: "INSTANT", // 👈 force update to INSTANT
          adminEmail: adminEmail || "",
        });

        if (!saveRes.success) {
          throw new Error(saveRes.error || "Failed to save instant email");
        }

        // Now actually send the email
        result = await sendInstantEmail({
          userEmails: allSubscribers.map((s) => s.email),
          subject,
          htmlContent: html,
          content: design,
          emailTemplateId: emailId,
          newsLetterOwnerId: user?.id!,
          campaignId: selectedCampaign,
          adminEmail: adminEmail || "",
        });

        if (!result?.success) {
          throw new Error(result?.error || "Email failed to send");
        }
      }

      // 📅 Case 2: Scheduling email
      else if (emailType === "SCHEDULE" && scheduleDate) {
        const res = await saveEmailToDatabase({
          title: subject,
          content: JSON.stringify(design),
          emailId: emailId,
          textContent: html,
          emailSubject: subject,
          template: campaigns.find((c) => c.id === selectedCampaign)?.type || "",
          newsLetterOwnerId: user?.id!,
          campaignId: selectedCampaign,
          emailType: "SCHEDULE",
          scheduleDate,
          scheduleTime,
          adminEmail: adminEmail || "",
        });

        if (!res.success) {
          throw new Error(res.error || "Failed to schedule email");
        }
      }

      // 🎉 Success toast
      toast.success(
        emailType === "SCHEDULE"
          ? `Email scheduled for ${scheduleDate?.toLocaleString()}`
          : `Email sent to ${allSubscribers.length} subscribers`
      );

      router.push("/dashboard/auto-email");
    } catch (err: any) {
      console.error("Send email error:", err);
      toast.error(err.message || "Failed to send email");
    } finally {
      setIsSending(false);
    }
  });
};


  // const sendEmailToSubscribers = async () => {
  //   setIsSending(true);
  //   emailEditorRef.current?.editor?.exportHtml(async ({ design, html }) => {
  //     setJsonData(design);

  //     if (allSubscribers.length === 0) {
  //       toast.error("No subscribers found");
  //       setIsSending(false);
  //       return;
  //     }

      // if(emailType === 'DRAFT'){
      //   toast.error("Cannot send email as it's a draft");
      //   setIsSending(false);
      //   return;
      // }

  //     try {
  //       let result;

  //       if (emailType === "INSTANT") {
  //         result = await sendInstantEmail({
  //           userEmails: allSubscribers.map((s) => s.email),
  //           subject: subject,
  //           htmlContent: html,
  //           content: design,
  //           emailTemplateId: emailId,
  //           newsLetterOwnerId: user?.id!,
  //           campaignId: selectedCampaign,
  //           adminEmail: adminEmail || "",
  //         });
  //       } else if (emailType === "SCHEDULE" && scheduleDate) {
  //         const res = await saveEmailToDatabase({
  //           title: subject,
  //           content: JSON.stringify(design),
  //           emailId: emailId,
  //           textContent: html,
  //           emailSubject: subject,
  //           template: campaigns.find((c) => c.id === selectedCampaign)?.type || "",
  //           newsLetterOwnerId: user?.id!,
  //           campaignId: selectedCampaign,
  //           emailType: emailType,
  //           scheduleDate: scheduleDate,
  //           scheduleTime: scheduleTime,
  //           adminEmail: adminEmail || "",
  //         });

  //         if (!res.success) {
  //           throw new Error(res.error || "Failed to schedule email");
  //         }
  //       }

  //       if (!result?.success && emailType === "INSTANT") {
  //         throw new Error(result?.error || "Email failed to send");
  //       }

  //       toast.success(
  //         emailType === "SCHEDULE"
  //           ? `Email scheduled for ${scheduleDate?.toLocaleString()}`
  //           : `Email sent to ${allSubscribers.length} subscribers`
  //       );
  //       router.push("/dashboard/auto-email");
  //     } catch (err: any) {
  //       console.error("Send email error:", err);
  //       toast.error(err.message || "Failed to send email");
  //     } finally {
  //       setIsSending(false);
  //     }
  //   });
  // };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className={`w-full min-h-screen p-4 md:p-4 space-y-4 ${isMobile ? 'mobile-layout' : ''} ${isTablet ? 'tablet-layout' : 'desktop-layout'}`}>
      <Card className="border-none shadow-none">
        <CardHeader className="bg-transparent p-3 sm:p-6">
          <CardTitle className="flex items-center text-base sm:text-lg">
            <Target className={`mr-2 ${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} />
            Email Type
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-6">
          <div className={`grid gap-3 ${isMobile ? 'grid-cols-1' : ''} ${isTablet ? 'grid-cols-2' : 'grid-cols-3'}`}>
            {[
              {
                type: "DRAFT",
                icon: Bolt,
                title: "Draft Email",
                description: "Save mail and send later",
                color: "bg-orange-100 text-orange-600",
              },
              {
                type: "INSTANT",
                icon: SendHorizonal,
                title: "Instant Email",
                description: "Send immediately to subscribers",
                color: "bg-blue-100 text-blue-600",
              },
              {
                type: "SCHEDULE",
                icon: Calendar,
                title: "Schedule Email",
                description: "Schedule email to be sent later",
                color: "bg-red-100 text-red-600",
              },
            ].map((item) => (
              <div
                key={item.type}
                className={`p-3 sm:p-4 border rounded-lg cursor-pointer transition-all ${
                  emailType === item.type
                    ? "border-primary bg-primary/10"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setEmailType(item.type as EmailType)}
              >
                <div className="flex items-center mb-2">
                  <div className={`${item.color} p-2 rounded-full mr-3`}>
                    <item.icon className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} />
                  </div>
                  <h3 className={`font-semibold ${isMobile ? 'text-xs' : 'text-sm'}`}>{item.title}</h3>
                </div>
                <p className="text-xs text-gray-500">{item.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {emailType === "SCHEDULE" && (
        <Card className="border shadow-sm">
          <CardHeader className="bg-gray-50 p-3 sm:p-6">
            <CardTitle className="flex items-center text-base sm:text-lg">
              <Calendar className={`mr-2 ${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} />
              Schedule Email
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-6">
            <div className={`grid gap-3 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
              <div>
                <label className={`block font-medium mb-1 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                  Schedule Date
                </label>
                <DatePicker
                  selected={scheduleDate}
                  onChange={(date) => setScheduleDate(date)}
                  minDate={new Date()}
                  className={`w-full rounded-md border border-gray-300 p-2 ${isMobile ? 'text-xs' : 'text-sm'}`}
                  dateFormat="MMMM d, yyyy"
                />
              </div>
              <div>
                <label className={`block font-medium mb-1 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                  Schedule Time
                </label>
                <input
                  type="time"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  className={`w-full rounded-md border border-gray-300 p-2 ${isMobile ? 'text-xs' : 'text-sm'}`}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="bg-white p-3 sm:p-4 rounded-lg border shadow-sm">
        <div className={`flex gap-3 ${isMobile ? 'flex-col' : 'flex-row items-center justify-between'}`}>
          <div className="flex-1 min-w-0">
            {campaignsLoading ? (
              <Skeleton className={`w-full rounded-md ${isMobile ? 'h-8' : 'h-10'}`} />
            ) : campaigns.length > 0 ? (
              <select
                value={selectedCampaign}
                onChange={(e) => setSelectedCampaign(e.target.value)}
                className={`w-full rounded-md border border-gray-300 p-2 ${isMobile ? 'text-xs w-[80%] mx-auto'   : 'text-sm'}`}
                disabled={campaignsLoading}
              >
                <option value="" className=" p-2">Select Campaign</option>
                {campaigns.map((campaign) => (
                  <option key={campaign.id} value={campaign.id} className="p-2 truncate">
                    {campaign.name}
                  </option>
                ))}
              </select>
            ) : (
              <p className={`text-gray-500 ${isMobile ? 'text-xs' : 'text-sm'}`}>No campaigns available</p>
            )}
          </div>
          <div className={`flex ${isMobile ? 'flex-col gap-2 w-full' : 'flex-row items-center gap-3'}`}>
            <Button
              className={`${isMobile ? 'w-full' : 'w-auto'}`}
              size={isMobile ? "sm" : "md"}
              color="primary"
              variant="bordered"
              onPress={saveDraft}
              isLoading={isSaving}
              startContent={!isSaving && <Save className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} />}
            >
              {isSaving ? "Saving..." : "Save Draft"}
            </Button>
            
            <Button
              className={`${isMobile ? 'w-full' : 'w-auto'}`}
              size={isMobile ? "sm" : "md"}
              color="primary"
              onPress={sendEmailToSubscribers}
              isDisabled={isSending || allSubscribers.length === 0 || subscribersLoading}
              isLoading={isSending}
              startContent={!isSending && <SendHorizonal className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} />}
            >
              {subscribersLoading ? (
                "Loading..."
              ) : allSubscribers.length > 0 ? (
                emailType === "SCHEDULE" ? (
                  `Schedule (${allSubscribers.length})`
                ) : (
                  `Send (${allSubscribers.length})`
                )
              ) : (
                "No subscribers"
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="w-full border shadow-sm rounded-lg p-3 sm:p-4 bg-white">
        <div className={`mb-3 sm:mb-4 border-none flex ${isMobile ? 'flex-col gap-2' : 'flex-row items-center gap-4'}`}>
          <label className={`block flex-nowrap text-nowrap font-medium ${isMobile ? 'text-xs' : 'text-sm'}`}>
            Email Subject:
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className={`w-full rounded-md border border-gray-300 p-2 ${isMobile ? 'text-xs' : 'text-sm'}`}
            placeholder="Enter subject here"
          />
        </div>

        <div className={`rounded-md overflow-y-scroll scrollbar-hide border-none ${
          isMobile ? 'h-[calc(100vh-400px)]' : 
          isTablet ? 'h-[500px]' : 'h-[600px]'
        }`}>
          <EmailEditor 
            ref={emailEditorRef} 
            onReady={onReady} 
            minHeight="100%"
            style={{ minHeight: '100%' }}
          />
        </div>
      </div>
    </div>
  );
};

export default EmailEditorPage;









// "use client";

// import React, { useEffect, useRef, useState, useCallback } from "react";
// import EmailEditor, { EditorRef, EmailEditorProps } from "react-email-editor";
// import { DefaultJsonData } from "@/assets/mails/default";
// import { useClerk } from "@clerk/nextjs";
// import { useRouter } from "next/navigation";
// import { Button } from "@nextui-org/react";
// import toast from "react-hot-toast";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

// import { getLogUserCampaigns } from "@/actions/campaign/get-campaign";
// import { saveEmailToDatabase } from "@/actions/email/addEmail";
// import { getEmailByTitle } from "@/actions/email/getEmail";
// import { getSubscribers } from "@/actions/subscriber/get.subscribers";
// import { sendInstantEmail } from "@/actions/email/sendInstantEmail";
// import { EmailType } from "@prisma/client";

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   Save,
//   Users,
//   Mail,
//   Bot,
//   Bolt,
//   Loader2,
//   Target,
//   Globe,
//   Calendar,
//   SendHorizonal,
// } from "lucide-react";
// import { Skeleton } from "@/components/ui/skeleton";
// import Loader from "@/components/Loader";

// interface Subscriber {
//   email: string;
//   name?: string;
// }

// interface Campaign {
//   id: string;
//   name: string;
//   description?: string;
//   type?: string;
//   emails: any[];
// }

// const EmailEditorPage = ({ subjectTitle }: { subjectTitle: string }) => {
//   const [subject, setSubject] = useState(subjectTitle);
//   const [loading, setLoading] = useState(true);
//   const [jsonData, setJsonData] = useState<any>(DefaultJsonData);
//   const [campaigns, setCampaigns] = useState<Campaign[]>([]);
//   const [campaignsLoading, setCampaignsLoading] = useState(false);
//   const [emailId, setEmailId] = useState("");
//   const [selectedCampaign, setSelectedCampaign] = useState("");
//   const [allSubscribers, setAllSubscribers] = useState<Subscriber[]>([]);
//   const [subscribersLoading, setSubscribersLoading] = useState(false);
//   const [emailType, setEmailType] = useState<EmailType>("INSTANT");
//   const [scheduleDate, setScheduleDate] = useState<Date | null>(new Date());
//   const [scheduleTime, setScheduleTime] = useState<string>("12:00");
//   const [isSending, setIsSending] = useState(false);
//   const [isSaving, setIsSaving] = useState(false);
//   const emailEditorRef = useRef<EditorRef>(null);
//   const router = useRouter();
//   const { user } = useClerk();
//   const adminEmail = user?.emailAddresses?.[0]?.emailAddress;

//   // Load all subscribers
//   const loadAllSubscribers = useCallback(async () => {
//     if (!user?.id) return;
//     setSubscribersLoading(true);

//     try {
//       const result = await getSubscribers();
//       if (result.error) throw new Error(result.error);

//       setAllSubscribers(
//         (result.subscribers || []).map((sub: any) => ({
//           email: sub.email,
//           name: sub.name ?? undefined,
//         }))
//       );
//     } catch (err) {
//       console.error("Load subscribers error:", err);
//       toast.error("Failed to load subscribers");
//       setAllSubscribers([]);
//     } finally {
//       setSubscribersLoading(false);
//     }
//   }, [user?.id]);

//   // Load campaigns
//   const loadCampaigns = useCallback(async () => {
//     if (!user?.id) return;
//     setCampaignsLoading(true);

//     try {
//       const campaignsRes = await getLogUserCampaigns();
//       if (Array.isArray(campaignsRes)) {
//         setCampaigns(
//           campaignsRes.map((campaign: any) => ({
//             id: campaign.id,
//             name: campaign.name,
//             description: campaign.description,
//             type: campaign.type,
//             emails: campaign.emails,
//           }))
//         );
//       }
//     } catch (error) {
//       console.error("Load campaigns error:", error);
//       toast.error("Failed to load campaigns");
//       setCampaigns([]);
//     } finally {
//       setCampaignsLoading(false);
//     }
//   }, [user?.id]);

//   useEffect(() => {
//     if (!user) {
//       toast.error("User not authenticated.");
//       return;
//     }

//     const init = async () => {
//       setLoading(true);
//       try {
//         const [emailResult] = await Promise.all([
//           getEmailByTitle({ title: subject, newsLetterOwnerId: user.id }),
//           loadCampaigns(),
//           loadAllSubscribers(),
//         ]);

//         if (emailResult.success && emailResult.data) {
//           const emailDetails = emailResult.data;

//           let content;
//           if (typeof emailDetails.content === "string") {
//             try {
//               content = JSON.parse(emailDetails.content);
//             } catch {
//               content = {
//                 body: {
//                   rows: [
//                     {
//                       columns: [
//                         {
//                           contents: `<div>${emailDetails.content}</div>`,
//                           type: "text",
//                           content: `<div>${emailDetails.content}</div>`,
//                         },
//                       ],
//                     },
//                   ],
//                 },
//               };
//             }
//           } else {
//             content = emailDetails.content;
//           }

//           setJsonData(content);
//           setEmailType(emailDetails.emailType || "INSTANT");
//           setEmailId(emailDetails.id);

//           if (emailDetails.campaign?.id) {
//             setSelectedCampaign(emailDetails.campaign.id);
//           }
//         }
//       } catch (error) {
//         console.error("Init error:", error);
//         toast.error("Failed to load initial data");
//       } finally {
//         setLoading(false);
//       }
//     };

//     init();
//   }, [user, subject, loadCampaigns, loadAllSubscribers]);

//   const onReady: EmailEditorProps["onReady"] = useCallback(() => {
//     if (emailEditorRef.current?.editor) {
//       emailEditorRef.current.editor.loadDesign(jsonData);
//     }
//   }, [jsonData]);

//   const saveDraft = async () => {
//     setIsSaving(true);
//     emailEditorRef.current?.editor?.exportHtml(async ({ design, html }) => {
//       try {
//         const scheduledDateTime = new Date(scheduleDate || new Date());
//         const [hours, minutes] = scheduleTime.split(":").map(Number);
//         scheduledDateTime.setHours(hours, minutes);

//         const res = await saveEmailToDatabase({
//           title: subject,
//           content: JSON.stringify(design),
//           emailId: emailId,
//           textContent: html,
//           emailSubject: subject,
//           template: campaigns.find((c) => c.id === selectedCampaign)?.type || "",
//           newsLetterOwnerId: user?.id!,
//           campaignId: selectedCampaign,
//           emailType: emailType,
//           scheduleDate: scheduledDateTime,
//           scheduleTime: scheduleTime,
//           adminEmail: adminEmail || "",
//         });

//         if (!res.success) {
//           throw new Error(res.error || "Failed to save draft");
//         }

//         toast.success("Draft saved successfully");
//         router.push("/dashboard/auto-email");
//       } catch (err: any) {
//         console.error("Save error:", err);
//         toast.error(err.message || "Failed to save draft");
//       } finally {
//         setIsSaving(false);
//       }
//     });
//   };

//   const sendEmailToSubscribers = async () => {
//     setIsSending(true);
//     emailEditorRef.current?.editor?.exportHtml(async ({ design, html }) => {
//       setJsonData(design);

//       if (allSubscribers.length === 0) {
//         toast.error("No subscribers found");
//         setIsSending(false);
//         return;
//       }

//       try {
//         let result;

//         if (emailType === "INSTANT") {
//           result = await sendInstantEmail({
//             userEmails: allSubscribers.map((s) => s.email),
//             subject: subject,
//             htmlContent: html,
//             content: design,
//             emailTemplateId: emailId,
//             newsLetterOwnerId: user?.id!,
//             campaignId: selectedCampaign,
//             adminEmail: adminEmail || "",
//           });
//         } else if (emailType === "SCHEDULE" && scheduleDate) {
//           const res = await saveEmailToDatabase({
//             title: subject,
//             content: JSON.stringify(design),
//             emailId: emailId,
//             textContent: html,
//             emailSubject: subject,
//             template: campaigns.find((c) => c.id === selectedCampaign)?.type || "",
//             newsLetterOwnerId: user?.id!,
//             campaignId: selectedCampaign,
//             emailType: emailType,
//             scheduleDate: scheduleDate,
//             scheduleTime: scheduleTime,
//             adminEmail: adminEmail || "",
//           });

//           if (!res.success) {
//             throw new Error(res.error || "Failed to schedule email");
//           }
//         }

//         if (!result?.success && emailType === "INSTANT") {
//           throw new Error(result?.error || "Email failed to send");
//         }

//         toast.success(
//           emailType === "SCHEDULE"
//             ? `Email scheduled for ${scheduleDate?.toLocaleString()}`
//             : `Email sent to ${allSubscribers.length} subscribers`
//         );
//         router.push("/dashboard/auto-email");
//       } catch (err: any) {
//         console.error("Send email error:", err);
//         toast.error(err.message || "Failed to send email");
//       } finally {
//         setIsSending(false);
//       }
//     });
//   };

//   if (loading) {
//     return (
//       <Loader/>
//     );
//   }

//   return (
//     <div className="w-full h-[calc(100vh-100px)] relative p-2 md:p-4 space-y-4">
//       {/* Email Type Selection */}
//       <Card className="border-none shadow-none gap-4">
//         <CardHeader className="bg-transparent">
//           <CardTitle className="flex items-center text-lg">
//             <Target className="w-5 h-5 mr-2" />
//             Email Type
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-12  ">
//             {[
//               {
//                 type: "DRAFT",
//                 icon: Bolt,
//                 title: "Draft Email",
//                 description: "Save mail and send later",
//                 color: "bg-orange-100 text-orange-600",
//               },
//               {
//                 type: "INSTANT",
//                 icon: SendHorizonal,
//                 title: "Instant Email",
//                 description: "Send immediately to subscribers",
//                 color: "bg-blue-100 text-blue-600",
//               },
//               {
//                 type: "SCHEDULE",
//                 icon: Calendar,
//                 title: "Schedule Email",
//                 description: "Schedule email to be sent later",
//                 color: "bg-red-100 text-red-600",
//               },
//               // {
//               //   type: "AUTOMATED",
//               //   icon: Bot,
//               //   title: "Automated Email",
//               //   description: "Automated mail based on actions",
//               //   color: "bg-purple-100 text-purple-600",
//               // },
//             ].map((item) => (
//               <div
//                 key={item.type}
//                 className={`p-4 border rounded-lg cursor-pointer transition-all ${
//                   emailType === item.type
//                     ? "border-primary bg-primary/10"
//                     : "border-gray-200 hover:border-gray-300"
//                 }`}
//                 onClick={() => setEmailType(item.type as EmailType)}
//               >
//                 <div className="flex items-center mb-2">
//                   <div className={`${item.color} p-2 rounded-full mr-3`}>
//                     <item.icon className="w-4 h-4" />
//                   </div>
//                   <h3 className="text-sm font-semibold">{item.title}</h3>
//                 </div>
//                 <p className="text-xs text-gray-500">{item.description}</p>
//               </div>
//             ))}
//           </div>
//         </CardContent>
//       </Card>

//       {/* Schedule Date Picker */}
//       {emailType === "SCHEDULE" && (
//         <Card className="border shadow-sm">
//           <CardHeader className="bg-gray-50">
//             <CardTitle className="flex items-center text-lg">
//               <Calendar className="w-5 h-5 mr-2" />
//               Schedule Email
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   Schedule Date
//                 </label>
//                 <DatePicker
//                   selected={scheduleDate}
//                   onChange={(date) => setScheduleDate(date)}
//                   minDate={new Date()}
//                   className="w-full rounded-md border border-gray-300 p-2 text-sm"
//                   dateFormat="MMMM d, yyyy"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   Schedule Time
//                 </label>
//                 <input
//                   type="time"
//                   value={scheduleTime}
//                   onChange={(e) => setScheduleTime(e.target.value)}
//                   className="w-full rounded-md border border-gray-300 p-2 text-sm"
//                 />
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       )}

//       {/* Campaign Selection and Save Button */}
//       <div className="bg-white p-4 rounded-lg border-none shadow-none">
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//           <div className="flex-1">
//             {campaignsLoading ? (
//               <Skeleton className="w-full h-10 rounded-md" />
//             ) : campaigns.length > 0 ? (
//               <select
//                 value={selectedCampaign}
//                 onChange={(e) => setSelectedCampaign(e.target.value)}
//                 className="w-full rounded-md border border-gray-300 p-2 text-sm"
//                 disabled={campaignsLoading}
//               >
//                 <option value="">Select Campaign</option>
//                 {campaigns.map((campaign) => (
//                   <option key={campaign.id} value={campaign.id} className=" p-2">
//                     {campaign.name}
//                   </option>
//                 ))}
//               </select>
//             ) : (
//               <p className="text-sm text-gray-500">No campaigns available</p>
//             )}
//           </div>
//           <div className="flex-shrink-0 flex items-center gap-4">
//             <Button
//               className="w-full md:w-auto"
//               color="primary"
//               variant="bordered"
//               onPress={saveDraft}
//               isLoading={isSaving}
//               startContent={!isSaving && <Save className="w-4 h-4" />}
//             >
//               {isSaving ? "Saving..." : "Save Draft"}
//             </Button>
            
//              <Button
//           className="w-full"
//           color="primary"
//           onPress={sendEmailToSubscribers}
//           isDisabled={isSending || allSubscribers.length === 0 || subscribersLoading}
//           isLoading={isSending}
//           startContent={!isSending && <SendHorizonal className="w-4 h-4" />}
//         >
//           {subscribersLoading ? (
//             "Loading subscribers..."
//           ) : allSubscribers.length > 0 ? (
//             emailType === "SCHEDULE" ? (
//               `Schedule for ${allSubscribers.length} subscribers`
//             ) : (
//               `Send to ${allSubscribers.length} subscribers`
//             )
//           ) : (
//             "No subscribers available"
//           )}
//             </Button>
//           </div>
//         </div>
//       </div>

//       {/* Email Subject and Editor */}
//       <div className="w-full h-full border shadow-sm rounded-lg p-4 bg-white">
//         <div className="mb-4 flex items-center gap-4">
//           <label className="block text-sm font-medium mb-1 text-nowrap">Email Subject:</label>
//           <input
//             type="text"
//             value={subject}
//             onChange={(e) => setSubject(e.target.value)}
//             className="w-full rounded-md border border-gray-300 p-2 text-sm"
//             placeholder="Enter subject here"
//           />
//         </div>

//         <div className="h-[600px] rounded-md overflow-y-scroll scrollbar-hide border-none">
//           <EmailEditor ref={emailEditorRef} onReady={onReady} />
//         </div>
//       </div>

//     </div>
//   );
// };

// export default EmailEditorPage;