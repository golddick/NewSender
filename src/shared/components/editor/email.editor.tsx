// "use client";

// import EmailEditor, { EditorRef, EmailEditorProps } from "react-email-editor";
// import React, { useEffect, useRef, useState, useCallback } from "react";
// import { DefaultJsonData } from "@/assets/mails/default";
// import { useClerk } from "@clerk/nextjs";
// import { useRouter } from "next/navigation";
// import { Button } from "@nextui-org/react";
// import { saveEmail } from "@/actions/save.email";
// import toast from "react-hot-toast";
// import { GetEmailDetails } from "@/actions/get.email-details";
// import { sendEmail } from "@/shared/utils/email.sender";
// import { getCategoryByOwnerId } from "@/actions/get.category";
// import { getAllCampaignsByOwnerId } from "@/actions/get.campaign";
// import { getSubscribersByCategory } from "@/actions/get.subscribers";

// interface Subscriber {
//   email: string;
//   name?: string;
// }

// const Emaileditor = ({ subjectTitle }: { subjectTitle: string }) => {
//   const [loading, setLoading] = useState(true);
//   const [jsonData, setJsonData] = useState<any | null>(DefaultJsonData);
//   const [categories, setCategories] = useState<{ name: string; _id: string }[]>([]);
//   const [campaigns, setCampaigns] = useState<{ name: string; _id: string }[]>([]);
//   const [emailId, setEmailId] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [selectedCampaign, setSelectedCampaign] = useState("");
//   const [subscribers, setSubscribers] = useState<Subscriber[]>([]);

//   const { user } = useClerk();
//   const emailEditorRef = useRef<EditorRef>(null);
//   const history = useRouter();
//   const email = user?.emailAddresses?.[0]?.emailAddress;

//   const loadSubscribers = useCallback(async (categoryId: string) => {
//     if (!user?.id) return;

//     try {
//       const result = await getSubscribersByCategory({
//         categoryId,
//         ownerId: user.id,
//       });

//       if (result.error) throw new Error(result.error);

//       setSubscribers(result.subscribers || []);
//       console.log(`Loaded ${result.subscribers?.length || 0} subscribers`);
//     } catch (error) {
//       console.error("Error loading subscribers:", error);
//       toast.error("Failed to load subscribers");
//       setSubscribers([]);
//     }
//   }, [user?.id]);

//   useEffect(() => {
//     if (!user) {
//       toast.error("No User Logged In");
//       return;
//     }

  //   const initializeData = async () => {
  //     try {
  //       const [emailDetails, categoriesRes, campaignsRes] = await Promise.all([
  //         GetEmailDetails({
  //           title: subjectTitle,
  //           newsLetterOwnerId: user.id,
  //         }),
  //         getCategoryByOwnerId({ newsLetterOwnerId: user.id }),
  //         getAllCampaignsByOwnerId({ newsLetterOwnerId: user.id }),
  //       ]);

  //       if (emailDetails) {
  //         setJsonData(JSON.parse(emailDetails.content));
  //         if (emailDetails.category) {
  //           setSelectedCategory(emailDetails.category);
  //           await loadSubscribers(emailDetails.category);
  //         }
  //         if (emailDetails.campaign) {
  //           setSelectedCampaign(emailDetails.campaign);
  //         }
  //         if (emailDetails._id) {
  //           setEmailId(emailDetails._id);
  //         }
  //       }

  //       setCategories(Array.isArray(categoriesRes)
  //         ? categoriesRes.map(cat => ({ name: cat.name, _id: cat._id }))
  //         : []);

  //       setCampaigns(Array.isArray(campaignsRes)
  //         ? campaignsRes.map(camp => ({ name: camp.name, _id: camp._id }))
  //         : []);

  //       setLoading(false);
  //     } catch (error) {
  //       console.error("Initialization error:", error);
  //       toast.error("Failed to load data");
  //       setLoading(false);
  //     }
  //   };

  //   initializeData();
  // }, [user, subjectTitle, loadSubscribers]);

//   const handleCategoryChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const categoryId = e.target.value;
//     setSelectedCategory(categoryId);
//     if (categoryId) {
//       await loadSubscribers(categoryId);
//     } else {
//       setSubscribers([]);
//     }
//   };

//   const onReady: EmailEditorProps["onReady"] = () => {
//     emailEditorRef.current?.editor?.loadDesign(jsonData);
//   };

//   const saveDraft = async () => {
//     emailEditorRef.current?.editor?.exportHtml(async ({ design }) => {
//       try {
//         const res = await saveEmail({
//           title: subjectTitle,
//           content: JSON.stringify(design),
//           newsLetterOwnerId: user?.id!,
//           category: selectedCategory,
//           campaign: selectedCampaign,
//         });

//         toast.success(res.message);
//         history.push("/dashboard/write");
//       } catch (error) {
//         console.error("Error saving draft:", error);
//         toast.error("Failed to save draft");
//       }
//     });
//   };

//   const exportHtml = async () => {
//     emailEditorRef.current?.editor?.exportHtml(async ({ design, html }) => {
//       setJsonData(design);

//       if (!selectedCategory) {
//         toast.error("Please select a category before sending.");
//         return;
//       }

//       if (!selectedCampaign) {
//         toast.error("Please select a campaign before sending.");
//         return;
//       }

//       if (subscribers.length === 0) {
//         toast.error("No subscribers found in the selected category.");
//         return;
//       }

//       const subscriberEmails = subscribers.map(sub => sub.email);

//       try {
//         const result = await sendEmail({
//           userEmail: subscriberEmails,
//           subject: subjectTitle,
//           content: html,
//           contentJson: JSON.stringify(design),
//           emailId: emailId,
//           newsLetterOwnerId: user?.id!,
//           category: selectedCategory,
//           campaign: selectedCampaign,
//           adminEmail: email ?? "",
//         });

//         if (result.error || !result.success) {
//           toast.error(result.error || "Failed to send email.");
//           return;
//         }

//         toast.success(`Email sent to ${subscriberEmails.length} subscribers!`);
//         history.push("/dashboard/write");
//       } catch (error) {
//         console.error("Send email error:", error);
//         toast.error("Failed to send email");
//       }
//     });
//   };

//   return (
//     <>
//       {!loading && (
//         <div className="w-full h-[90vh] relative">
//           <EmailEditor minHeight="80vh" ref={emailEditorRef} onReady={onReady} />

//           <div className="absolute bottom-0 w-full border-t bg-white p-4">
//             <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//               <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
//                 <select
//                   value={selectedCategory}
//                   onChange={handleCategoryChange}
//                   className="border rounded px-3 py-2 text-sm w-full sm:w-auto"
//                 >
//                   <option value="">Select Category</option>
//                   {categories.map((cat) => (
//                     <option key={cat._id} value={cat._id}>
//                       {cat.name}
//                     </option>
//                   ))}
//                 </select>

//                 <select
//                   value={selectedCampaign}
//                   onChange={(e) => setSelectedCampaign(e.target.value)}
//                   className="border rounded px-3 py-2 text-sm w-full sm:w-auto"
//                 >
//                   <option value="">Select Campaign</option>
//                   {campaigns.map((camp) => (
//                     <option key={camp._id} value={camp._id}>
//                       {camp.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
//                 <Button
//                   className="bg-transparent border border-black/30 text-black text-sm sm:text-base"
//                   onPress={saveDraft}
//                 >
//                   Save Draft
//                 </Button>
//                 <Button
//                   className="bg-black text-white text-sm sm:text-base"
//                   onPress={exportHtml}
//                   isDisabled={!selectedCategory || subscribers.length === 0}
//                 >
//                   {selectedCategory
//                     ? `Send to ${subscribers.length} Subscribers`
//                     : "Select Category to Send"}
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default Emaileditor;








"use client";

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import EmailEditor, {
  EditorRef,
  EmailEditorProps,
} from "react-email-editor";
import { DefaultJsonData } from "@/assets/mails/default";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/react";
import toast from "react-hot-toast";

import { sendEmail } from "@/shared/utils/email.sender";
import { getIntegrations } from "@/actions/application-Integration/application";
import { getCampaignsByIntegration } from "@/actions/campaign/get-campaign";
import { saveEmailToDatabase } from "@/actions/email/addEmail";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Save,
  Send,
  Eye,
  Users,
  Mail,
  Clock,
  Bot,
  Bolt,
  Loader2,
  Target,
  Globe,
  Calendar,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { getEmailByTitle } from "@/actions/email/getEmail";
import { getSubscribersByIntegration } from "@/actions/subscriber/get.subscribers";
import { sendInstantEmail } from "@/actions/email/sendInstantEmail";

interface Subscriber {
  email: string;
  name?: string;
}

const Emaileditor = ({ subjectTitle }: { subjectTitle: string }) => {
  const [subject, setSubject] = useState(subjectTitle);
  const [loading, setLoading] = useState(true);
  const [jsonData, setJsonData] = useState<any>(DefaultJsonData);
  const [integrations, setIntegrations] = useState<{ name: string; id: string }[]>([]);
  const [campaigns, setCampaigns] = useState<
    { name: string; id: string; integrationId: string; trigger: string }[]
  >([]);
  const [emailId, setEmailId] = useState("");
  const [selectedIntegration, setSelectedIntegration] = useState("");
  const [selectedCampaign, setSelectedCampaign] = useState("");
  const [selectedIntegrationName, setSelectedIntegrationName] = useState("");
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [emailType, setEmailType] = useState<"instant" | "automated" | "scheduled">("instant");
  const emailEditorRef = useRef<EditorRef>(null);
  const emailEditorRefText = useRef<EditorRef>(null);
  const router = useRouter();
  const { user } = useClerk();
  const adminEmail = user?.emailAddresses?.[0]?.emailAddress;

  const loadSubscribers = useCallback(
    async (integrationId: string, campaignId: string) => {
      if (!user?.id || !integrationId || !campaignId) return;

      try {
        const result = await getSubscribersByIntegration({
          integrationId,
          campaign: campaignId,
          ownerId: user.id,
        });

        console.log("Subscribers loaded:", result);

        if (result.error) throw new Error(result.error);

        setSubscribers(
          (result.subscribers || []).map((sub: any) => ({
            email: sub.email,
            name: sub.name ?? undefined,
          }))
        );
      } catch (err) {
        console.error("Load subscribers error:", err);
        toast.error("Failed to load subscribers");
        setSubscribers([]);
      }
    },
    [user?.id]
  );

  useEffect(() => {
    if (!user) {
      toast.error("User not authenticated.");
      return;
    }

    const init = async () => {
      try {
        const [emailResult, integrationRes] = await Promise.all([
          getEmailByTitle({ title:subject, newsLetterOwnerId: user.id }),
          getIntegrations(),
        ]);

        console.log(emailResult, 'emailResult')

        if (emailResult.success && emailResult.data) {
          const emailDetails = emailResult.data;

          const content =
            typeof emailDetails.content === "string"
              ? JSON.parse(emailDetails.content)
              : emailDetails.content;

          setJsonData(content);

          console.log(subject, 'subject sub')
          console.log(emailDetails, 'emailDetails')

          if (
            emailDetails.emailType === "instant" ||
            emailDetails.emailType === "automated" ||
            emailDetails.emailType === "scheduled"
          ) {
            setEmailType(emailDetails.emailType);
          }

          if (emailDetails.integration?.id) {
            const integrationId = emailDetails.integration.id;
            const integrationName = emailDetails.integration.name;

            console.log(integrationName, 'integrationName')

            setSelectedIntegration(integrationId);
            setSelectedIntegrationName(integrationName);

            const campaignRes = await getCampaignsByIntegration(integrationId);

            const loadedCampaigns = Array.isArray(campaignRes.data?.campaigns)
              ? campaignRes.data.campaigns.map((c: any) => ({
                  id: c.id,
                  name: c.name,
                  integrationId,
                  trigger: c.trigger,
                }))
              : [];

            setCampaigns(loadedCampaigns);

            if (emailDetails.campaign?.id) {
              const campaignId = emailDetails.campaign.id;
              setSelectedCampaign(campaignId);
              await loadSubscribers(integrationId, campaignId);
            }
          }

          setEmailId(emailDetails.id);
        } else {
          toast.error("Email not found");
        }

        setIntegrations(
          integrationRes?.data?.map((i: any) => ({
            id: i.id,
            name: i.name,
          })) || []
        );

        setLoading(false);
      } catch (error) {
        console.error("Init error:", error);
        toast.error("Failed to load initial data");
        setLoading(false);
      }
    };

    init();
  }, [user, subject, loadSubscribers, subjectTitle]);

  const handleIntegrationChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const integrationId = e.target.value;
    const integrationName = integrations.find((i) => i.id === integrationId)?.name || "";
    setSelectedIntegrationName(integrationName);
    setSelectedIntegration(integrationId);
    setSelectedCampaign("");

    if (!integrationId || !user?.id) {
      setSubscribers([]);
      setCampaigns([]);
      return;
    }

    try {
      const campaignRes = await getCampaignsByIntegration(integrationId);

      const loadedCampaigns = Array.isArray(campaignRes.data?.campaigns)
        ? campaignRes.data.campaigns.map((c: any) => ({
            id: c.id || c._id,
            name: c.name,
            integrationId,
            trigger: c.trigger,
          }))
        : [];

      setCampaigns(loadedCampaigns);
      if (loadedCampaigns.length > 0) {
        const firstCampaignId = loadedCampaigns[0].id;
        setSelectedCampaign(firstCampaignId);
        await loadSubscribers(integrationId, firstCampaignId);
      }
    } catch (err) {
      console.error("Integration change error:", err);
      toast.error("Failed to load integration data");
      setCampaigns([]);
    }
  };


  const onReady: EmailEditorProps["onReady"] = () => {
    emailEditorRef.current?.editor?.loadDesign(jsonData);
    emailEditorRefText.current?.editor?.exportPlainText(jsonData);
  };

  const saveDraft = async () => {
  emailEditorRef.current?.editor?.exportHtml(async ({ design, html }) => {
    if (!selectedCampaign || !selectedIntegration) {
      toast.error("Please select both a campaign and an integration");
      return;
    }

    try {
      const res = await saveEmailToDatabase({
        title: subject,
        content: JSON.stringify(design),
        emailId: emailId,
        textContent: html,
        emailSubject: subject,
        template: campaigns.find(c => c.id === selectedCampaign)?.trigger || "",
        newsLetterOwnerId: user?.id!,
        campaignId: selectedCampaign,
        integrationId: selectedIntegration,
        scheduleType: "draft", 
        emailType: emailType
      });

      if (!res.success) {
        toast.error(res.error || "Failed to save draft");
        return;
      }

      toast.success("Draft saved successfully");
      router.push("/dashboard/auto-email");
    } catch (err) {
      console.error("Save error:", err);
      toast.error("Failed to save draft");
    }
  });
};

console.log(selectedIntegrationName, 'selectedIntegrationName')
// console.log(selectedIntegration, 'selectedIntegration')

  const exportHtml = async () => {
    emailEditorRef.current?.editor?.exportHtml(async ({ design, html }) => {
      setJsonData(design);

      if (!selectedIntegration) return toast.error("Select an integration before sending.");
      if (!selectedCampaign) return toast.error("Select a campaign before sending.");
      if (subscribers.length === 0) return toast.error("No subscribers found for this integration.");

      try {
        const result = await sendInstantEmail({
          userEmails: subscribers.map((s) => s.email),
          subject: subject,
          htmlContent: html,
          design: JSON.stringify(design),
          emailTemplateId:emailId,
          newsLetterOwnerId: user?.id!,
          integrationId: selectedIntegration,
          campaignId: selectedCampaign,
          adminEmail: adminEmail || "",
          fromApplication: selectedIntegrationName
        });

        if (!result.success) {
          toast.error(result.error || "Email failed to send");
          return;
        }

        toast.success(`Email sent to ${subscribers.length} subscribers`);
        router.push("/dashboard/auto-email");
      } catch (err) {
        console.error("Send email error:", err);
        toast.error("Failed to send email");
      }
    });
  };

  const filteredCampaigns = campaigns.filter(
    (c) => c.integrationId === selectedIntegration
  );

  return !loading ? (
    <div className="w-full h-full relative">
       {/* Email Type Selection */}
        <Card className="">
          <CardHeader className="bg-white  text-black border shadow-md rounded-lg">
            <CardTitle className="flex items-center">
              <Target className="w-5 h-4 mr-2" />
              Email Type
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div
                className={` h-20 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  emailType === "instant" ? "border-yellow-500 bg-yellow-50" : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setEmailType("instant")}
              >
                <div className="flex items-center mb-1">
                  <div className="bg-orange-100 p-2 rounded-full mr-3">
                    <Bolt className="w-4 h-4 text-orange-600" />
                  </div>
                  <h3 className="text-[15px] font-semibold text-black">Instant Email</h3>
                </div>
                  <p className="text-gray-600  text-xs">
                 Send immediately mail to subscribers.
                </p>
          
      </div>

              <div
                className={`h-20 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  emailType === "scheduled" ? "border-yellow-500 bg-yellow-50" : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setEmailType("scheduled")}
              >
                <div className="flex items-center mb-1">
                  <div className="bg-red-100 p-2 rounded-full mr-3">
                    <Calendar className="w-4 h-4 text-red-600" />
                  </div>
                  <h3 className="text-[15px] font-semibold text-black">Schedule Email</h3>
                </div>
                <p className="text-gray-600  text-xs">
                  Schedule email to be sent at a later time.
                </p>
              </div>


              <div
                className={` h-20 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  emailType === "automated" ? "border-yellow-500 bg-yellow-50" : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setEmailType("automated")}
              >
                <div className="flex items-center mb-1">
                  <div className="bg-purple-100 p-2 rounded-full mr-3">
                    <Bot className="w-4 h-4 text-purple-600" />
                  </div>
                  <h3 className="text-[15px] font-semibold text-black">Automated Email</h3>
                </div>
                <p className="text-gray-600  text-xs text-nowrap">
                Autometed mail to be sent based on user actions.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      
       <div className=" w-full border-t bg-white p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <select
              value={selectedIntegration}
              onChange={handleIntegrationChange}
              className="border rounded px-3 py-2 text-sm w-full sm:w-auto"
            >
              <option value="">Select Integration</option>
              {integrations.map((int) => (
                <option key={int.id} value={int.id}>
                  {int.name}
                </option>
              ))}
            </select>

            <select
              value={selectedCampaign}
              onChange={(e) => setSelectedCampaign(e.target.value)}
              className="border rounded px-3 py-2 text-sm w-full sm:w-auto"
              disabled={!selectedIntegration}
            >
              <option value="">Select Campaign</option>
              {filteredCampaigns.map((camp) => (
                <option key={camp.id} value={camp.id}>
                  {camp.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <Button
              className="bg-transparent border border-black/30 text-black text-sm sm:text-base"
              onPress={saveDraft}
            >
              Save Draft
            </Button>
            <Button
              className="bg-black text-white text-sm sm:text-base"
              onPress={exportHtml}
              isDisabled={!selectedIntegration || subscribers.length === 0}
            >
              {selectedIntegration
                ? `Send to ${subscribers.length} Subscribers`
                : "Select Integration to Send"}
            </Button>
          </div>
        </div>
      </div>


      <div className="w-full h-full  border shadow-md rounded-md p-6 relative">
       <div className="mb-2 flex items-center gap-4 w-full">
        <label className="block text-sm font-medium text-black text-nowrap ">Email Subject :</label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full border rounded px-4 py-2 text-sm"
          placeholder="Enter subject here"
        />
      </div>

      <EmailEditor ref={emailEditorRef} onReady={onReady}  />

       </div>
     
    </div>
  ) : null;
};

export default Emaileditor;
