"use client";

import EmailEditor, { EditorRef, EmailEditorProps } from "react-email-editor";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { DefaultJsonData } from "@/assets/mails/default";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/react";
import { saveEmail } from "@/actions/save.email";
import toast from "react-hot-toast";
import { GetEmailDetails } from "@/actions/get.email-details";
import { sendEmail } from "@/shared/utils/email.sender";
import { getCategoryByOwnerId } from "@/actions/get.category";
import { getAllCampaignsByOwnerId } from "@/actions/get.campaign";
import { getSubscribersByCategory } from "@/actions/get.subscribers";

interface Subscriber {
  email: string;
  name?: string;
}

const Emaileditor = ({ subjectTitle }: { subjectTitle: string }) => {
  const [loading, setLoading] = useState(true);
  const [jsonData, setJsonData] = useState<any | null>(DefaultJsonData);
  const [categories, setCategories] = useState<{ name: string; _id: string }[]>([]);
  const [campaigns, setCampaigns] = useState<{ name: string; _id: string }[]>([]);
  const [emailId, setEmailId] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCampaign, setSelectedCampaign] = useState("");
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);

  const { user } = useClerk();
  const emailEditorRef = useRef<EditorRef>(null);
  const history = useRouter();
  const email = user?.emailAddresses?.[0]?.emailAddress;

  const loadSubscribers = useCallback(async (categoryId: string) => {
    if (!user?.id) return;

    try {
      const result = await getSubscribersByCategory({
        categoryId,
        ownerId: user.id,
      });

      if (result.error) throw new Error(result.error);

      setSubscribers(result.subscribers || []);
      console.log(`Loaded ${result.subscribers?.length || 0} subscribers`);
    } catch (error) {
      console.error("Error loading subscribers:", error);
      toast.error("Failed to load subscribers");
      setSubscribers([]);
    }
  }, [user?.id]);

  useEffect(() => {
    if (!user) {
      toast.error("No User Logged In");
      return;
    }

    const initializeData = async () => {
      try {
        const [emailDetails, categoriesRes, campaignsRes] = await Promise.all([
          GetEmailDetails({
            title: subjectTitle,
            newsLetterOwnerId: user.id,
          }),
          getCategoryByOwnerId({ newsLetterOwnerId: user.id }),
          getAllCampaignsByOwnerId({ newsLetterOwnerId: user.id }),
        ]);

        if (emailDetails) {
          setJsonData(JSON.parse(emailDetails.content));
          if (emailDetails.category) {
            setSelectedCategory(emailDetails.category);
            await loadSubscribers(emailDetails.category);
          }
          if (emailDetails.campaign) {
            setSelectedCampaign(emailDetails.campaign);
          }
          if (emailDetails._id) {
            setEmailId(emailDetails._id);
          }
        }

        setCategories(Array.isArray(categoriesRes)
          ? categoriesRes.map(cat => ({ name: cat.name, _id: cat._id }))
          : []);

        setCampaigns(Array.isArray(campaignsRes)
          ? campaignsRes.map(camp => ({ name: camp.name, _id: camp._id }))
          : []);

        setLoading(false);
      } catch (error) {
        console.error("Initialization error:", error);
        toast.error("Failed to load data");
        setLoading(false);
      }
    };

    initializeData();
  }, [user, subjectTitle, loadSubscribers]);

  const handleCategoryChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);
    if (categoryId) {
      await loadSubscribers(categoryId);
    } else {
      setSubscribers([]);
    }
  };

  const onReady: EmailEditorProps["onReady"] = () => {
    emailEditorRef.current?.editor?.loadDesign(jsonData);
  };

  const saveDraft = async () => {
    emailEditorRef.current?.editor?.exportHtml(async ({ design }) => {
      try {
        const res = await saveEmail({
          title: subjectTitle,
          content: JSON.stringify(design),
          newsLetterOwnerId: user?.id!,
          category: selectedCategory,
          campaign: selectedCampaign,
        });

        toast.success(res.message);
        history.push("/dashboard/write");
      } catch (error) {
        console.error("Error saving draft:", error);
        toast.error("Failed to save draft");
      }
    });
  };

  const exportHtml = async () => {
    emailEditorRef.current?.editor?.exportHtml(async ({ design, html }) => {
      setJsonData(design);

      if (!selectedCategory) {
        toast.error("Please select a category before sending.");
        return;
      }

      if (!selectedCampaign) {
        toast.error("Please select a campaign before sending.");
        return;
      }

      if (subscribers.length === 0) {
        toast.error("No subscribers found in the selected category.");
        return;
      }

      const subscriberEmails = subscribers.map(sub => sub.email);

      try {
        const result = await sendEmail({
          userEmail: subscriberEmails,
          subject: subjectTitle,
          content: html,
          contentJson: JSON.stringify(design),
          emailId: emailId,
          newsLetterOwnerId: user?.id!,
          category: selectedCategory,
          campaign: selectedCampaign,
          adminEmail: email ?? "",
        });

        if (result.error || !result.success) {
          toast.error(result.error || "Failed to send email.");
          return;
        }

        toast.success(`Email sent to ${subscriberEmails.length} subscribers!`);
        history.push("/dashboard/write");
      } catch (error) {
        console.error("Send email error:", error);
        toast.error("Failed to send email");
      }
    });
  };

  return (
    <>
      {!loading && (
        <div className="w-full h-[90vh] relative">
          <EmailEditor minHeight="80vh" ref={emailEditorRef} onReady={onReady} />

          <div className="absolute bottom-0 w-full border-t bg-white p-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <select
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  className="border rounded px-3 py-2 text-sm w-full sm:w-auto"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedCampaign}
                  onChange={(e) => setSelectedCampaign(e.target.value)}
                  className="border rounded px-3 py-2 text-sm w-full sm:w-auto"
                >
                  <option value="">Select Campaign</option>
                  {campaigns.map((camp) => (
                    <option key={camp._id} value={camp._id}>
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
                  isDisabled={!selectedCategory || subscribers.length === 0}
                >
                  {selectedCategory
                    ? `Send to ${subscribers.length} Subscribers`
                    : "Select Category to Send"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Emaileditor;






// "use client";

// import EmailEditor, { EditorRef, EmailEditorProps } from "react-email-editor";
// import React, { useEffect, useRef, useState } from "react";
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

// const Emaileditor = ({ subjectTitle }: { subjectTitle: string }) => {
//   const [loading, setLoading] = useState(true);
//   const [jsonData, setJsonData] = useState<any | null>(DefaultJsonData);
//   const [categories, setCategories] = useState<{ name: string; _id: string }[]>([]);
//   const [campaigns, setCampaigns] = useState<{ name: string; _id: string }[]>([]);
//   const [emailId, setEmailId] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [selectedCampaign, setSelectedCampaign] = useState("");

//   const { user } = useClerk();
//   if (!user) {
//     toast.error('No User Logged In')
//     return
//   }
//   const emailEditorRef = useRef<EditorRef>(null);
//   const history = useRouter();
//   const email = user.emailAddresses?.[0]?.emailAddress;
//   useEffect(() => {
//     if (!user) return;

//     const getEmailDetails = async () => {
//       const res = await GetEmailDetails({
//         title: subjectTitle,
//         newsLetterOwnerId: user.id,
//       });

//       if (!res) {
//         setLoading(false);
//         return;
//       }

//       setJsonData(JSON.parse(res.content));
//       if (res.category) setSelectedCategory(res.category);
//       if (res.campaign) setSelectedCampaign(res.campaign);
//       if (res._id) setEmailId(res._id);

//       setLoading(false);
//     };

//     const loadCategories = async () => {
//       const res = await getCategoryByOwnerId({ newsLetterOwnerId: user.id });
//       setCategories(Array.isArray(res) ? res.map(cat => ({ name: cat.name, _id: cat._id })) : []);
//     };

//     const loadCampaigns = async () => {
//       const res = await getAllCampaignsByOwnerId({ newsLetterOwnerId: user.id });
//       setCampaigns(Array.isArray(res) ? res.map(camp => ({ name: camp.name, _id: camp._id })) : []);
//     };

//     getEmailDetails();
//     loadCategories();
//     loadCampaigns();
//   }, [user, subjectTitle]);

//   const onReady: EmailEditorProps["onReady"] = () => {
//     const unlayer: any = emailEditorRef.current?.editor;
//     unlayer.loadDesign(jsonData);
//   };

//   const saveDraft = async () => {
//     const unlayer = emailEditorRef.current?.editor;

//     unlayer?.exportHtml(async (data) => {
//       const { design } = data;

//       await saveEmail({
//         title: subjectTitle,
//         content: JSON.stringify(design),
//         newsLetterOwnerId: user?.id!,
//         category: selectedCategory,
//         campaign: selectedCampaign,
//       }).then((res: any) => {
//         toast.success(res.message);
//         history.push("/dashboard/write");
//       });
//     });
//   };

//   const exportHtml = () => {
//     const unlayer = emailEditorRef.current?.editor;

//     unlayer?.exportHtml(async (data) => {
//       const { design, html } = data;
//       setJsonData(design);

//       if (!selectedCategory || !selectedCampaign) {
//         toast.error("Please select a category and campaign before sending.");
//         return;
//       }

//       await sendEmail({
//         userEmail: ["goldick60@gmail.com"],
//         subject: subjectTitle,
//         content: html,
//         contentJson: JSON.stringify(design),
//         emailId: emailId,
//         newsLetterOwnerId: user?.id!,
//         category: selectedCategory,
//         campaign: selectedCampaign,
//         adminEmail: email
//       }).then(() => {

//         toast.success("Email sent successfully!");
//         history.push("/dashboard/write");
//       });
//     });
//   };

//   return (
//     <>
//       {!loading && (
//         <div className="w-full h-[90vh] relative">
//           <EmailEditor minHeight={"80vh"} ref={emailEditorRef} onReady={onReady} />

//           <div className="absolute bottom-0 w-full border-t bg-white p-4">
//             <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//               <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
//                 <select
//                   value={selectedCategory}
//                   onChange={(e) => setSelectedCategory(e.target.value)}
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
//                   onClick={saveDraft}
//                 >
//                   Save Draft
//                 </Button>
//                 <Button
//                   className="bg-black text-white text-sm sm:text-base"
//                   onClick={exportHtml}
//                 >
//                   Send
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
