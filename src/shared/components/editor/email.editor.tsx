



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
//   const emailEditorRef = useRef<EditorRef>(null);
//   const history = useRouter();

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
//       setCategories(
//         Array.isArray(res)
//           ? res.map((cat: { name: string; _id: string }) => ({
//               name: cat.name,
//               _id: cat._id,
//             }))
//           : []
//       );
//     };

//     const loadCampaigns = async () => {
//       const res = await getAllCampaignsByOwnerId({ newsLetterOwnerId: user.id });
//       setCampaigns(
//         Array.isArray(res)
//           ? res.map((camp: { name: string; _id: string }) => ({
//               name: camp.name,
//               _id: camp._id,
//             }))
//           : []
//       );
//     };

//     getEmailDetails();
//     loadCategories();
//     loadCampaigns();
//   }, [user, subjectTitle]);

//   console.log(emailId, "emailId")

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
//         userEmail: ["golddick60@gmail.com"],
//         subject: subjectTitle,
//         content: html,
//         contentJson: JSON.stringify(design),
//         emailId: emailId,
//         newsLetterOwnerId: user?.id!,
//         category: selectedCategory,
//         campaign: selectedCampaign,
//       }).then(() => {
//         toast.success("Email sent successfully!");
//         history.push("/dashboard/write");
//       });
//     });
//   };

//   console.log(selectedCategory, "selectedCategory")
//   console.log(selectedCampaign, "selectedCampaign")

//   return (
//     <>
//       {!loading && (
//         <div className="w-full h-[90vh] relative">
//           <EmailEditor
//             minHeight={"80vh"}
//             ref={emailEditorRef}
//             onReady={onReady}
//           />
//           <div className="absolute bottom-0 flex items-center justify-center gap-4 right-0 w-full border-t p-3 bg-white">
//             <select
//               value={selectedCategory}
//               onChange={(e) => setSelectedCategory(e.target.value)}
//               className="border rounded px-3 py-2 text-sm"
//             >
//               <option value="">Select Category</option>
//               {categories.map((cat) => (
//                 <option key={cat._id} value={cat._id}>
//                   {cat.name}
//                 </option>
//               ))}
//             </select>

//             <select
//               value={selectedCampaign}
//               onChange={(e) => setSelectedCampaign(e.target.value)}
//               className="border rounded px-3 py-2 text-sm"
//             >
//               <option value="">Select Campaign</option>
//               {campaigns.map((camp) => (
//                 <option key={camp._id} value={camp._id}>
//                   {camp.name}
//                 </option>
//               ))}
//             </select>

//             <Button
//               className="bg-transparent cursor-pointer flex items-center gap-1 text-black border border-[#00000048] text-lg rounded-lg"
//               onClick={saveDraft}
//             >
//               <span className="opacity-[.7]">Save Draft</span>
//             </Button>
//             <Button
//               className="bg-[#000] text-white cursor-pointer flex items-center gap-1 border text-lg rounded-lg"
//               onClick={exportHtml}
//             >
//               <span>Send</span>
//             </Button>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default Emaileditor;







"use client";

import EmailEditor, { EditorRef, EmailEditorProps } from "react-email-editor";
import React, { useEffect, useRef, useState } from "react";
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

const Emaileditor = ({ subjectTitle }: { subjectTitle: string }) => {
  const [loading, setLoading] = useState(true);
  const [jsonData, setJsonData] = useState<any | null>(DefaultJsonData);
  const [categories, setCategories] = useState<{ name: string; _id: string }[]>([]);
  const [campaigns, setCampaigns] = useState<{ name: string; _id: string }[]>([]);
  const [emailId, setEmailId] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCampaign, setSelectedCampaign] = useState("");

  const { user } = useClerk();
  const emailEditorRef = useRef<EditorRef>(null);
  const history = useRouter();

  useEffect(() => {
    if (!user) return;

    const getEmailDetails = async () => {
      const res = await GetEmailDetails({
        title: subjectTitle,
        newsLetterOwnerId: user.id,
      });

      if (!res) {
        setLoading(false);
        return;
      }

      setJsonData(JSON.parse(res.content));
      if (res.category) setSelectedCategory(res.category);
      if (res.campaign) setSelectedCampaign(res.campaign);
      if (res._id) setEmailId(res._id);

      setLoading(false);
    };

    const loadCategories = async () => {
      const res = await getCategoryByOwnerId({ newsLetterOwnerId: user.id });
      setCategories(Array.isArray(res) ? res.map(cat => ({ name: cat.name, _id: cat._id })) : []);
    };

    const loadCampaigns = async () => {
      const res = await getAllCampaignsByOwnerId({ newsLetterOwnerId: user.id });
      setCampaigns(Array.isArray(res) ? res.map(camp => ({ name: camp.name, _id: camp._id })) : []);
    };

    getEmailDetails();
    loadCategories();
    loadCampaigns();
  }, [user, subjectTitle]);

  const onReady: EmailEditorProps["onReady"] = () => {
    const unlayer: any = emailEditorRef.current?.editor;
    unlayer.loadDesign(jsonData);
  };

  const saveDraft = async () => {
    const unlayer = emailEditorRef.current?.editor;

    unlayer?.exportHtml(async (data) => {
      const { design } = data;

      await saveEmail({
        title: subjectTitle,
        content: JSON.stringify(design),
        newsLetterOwnerId: user?.id!,
        category: selectedCategory,
        campaign: selectedCampaign,
      }).then((res: any) => {
        toast.success(res.message);
        history.push("/dashboard/write");
      });
    });
  };

  const exportHtml = () => {
    const unlayer = emailEditorRef.current?.editor;

    unlayer?.exportHtml(async (data) => {
      const { design, html } = data;
      setJsonData(design);

      if (!selectedCategory || !selectedCampaign) {
        toast.error("Please select a category and campaign before sending.");
        return;
      }

      await sendEmail({
        userEmail: ["golddick60@gmail.com"],
        subject: subjectTitle,
        content: html,
        contentJson: JSON.stringify(design),
        emailId: emailId,
        newsLetterOwnerId: user?.id!,
        category: selectedCategory,
        campaign: selectedCampaign,
      }).then(() => {
        toast.success("Email sent successfully!");
        history.push("/dashboard/write");
      });
    });
  };

  return (
    <>
      {!loading && (
        <div className="w-full h-[90vh] relative">
          <EmailEditor minHeight={"80vh"} ref={emailEditorRef} onReady={onReady} />

          <div className="absolute bottom-0 w-full border-t bg-white p-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
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
                  onClick={saveDraft}
                >
                  Save Draft
                </Button>
                <Button
                  className="bg-black text-white text-sm sm:text-base"
                  onClick={exportHtml}
                >
                  Send
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
