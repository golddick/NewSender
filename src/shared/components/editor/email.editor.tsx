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

// const Emaileditor = ({ subjectTitle }: { subjectTitle: string }) => {
//   const [loading, setLoading] = useState(true);
//   const [jsonData, setJsonData] = useState<any | null>(DefaultJsonData);
//   const { user } = useClerk();
//   const emailEditorRef = useRef<EditorRef>(null);
//   const history = useRouter();
 
//   const exportHtml = () => {
//     const unlayer = emailEditorRef.current?.editor;

//     unlayer?.exportHtml(async (data) => {
//       const { design, html } = data;
//       setJsonData(design);
//       await sendEmail({
//         userEmail: ["goldick60@gmail.com"],
//         subject: subjectTitle,
//         content: html,
//       }).then((res) => {
//         toast.success("Email sent successfully!");
//         history.push("/dashboard/write");
//       });
//     });
//   };

//   useEffect(() => {
//     getEmailDetails();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [user]);

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
//       }).then((res: any) => {
//         toast.success(res.message);
//         history.push("/dashboard/write");
//       });
//     });
//   };

//   const getEmailDetails = async () => {
//     await GetEmailDetails({
//       title: subjectTitle,
//       newsLetterOwnerId: user?.id!,
//     }).then((res: any) => {
//       if (res) {
//         setJsonData(JSON.parse(res?.content));
//       }
//       setLoading(false);
//     });
//   };

//   return (
//     <>
//       {!loading && (
//         <div className="w-full h-[90vh] relative">
//           <EmailEditor
//             minHeight={"80vh"}
//             ref={emailEditorRef}
//             onReady={onReady}
//           />
//           <div className="absolute bottom-0 flex items-center justify-end gap-4 right-0 w-full border-t p-3">
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
      setCategories(
        Array.isArray(res)
          ? res.map((cat: { name: string; _id: string }) => ({
              name: cat.name,
              _id: cat._id,
            }))
          : []
      );
    };

    const loadCampaigns = async () => {
      const res = await getAllCampaignsByOwnerId({ newsLetterOwnerId: user.id });
      setCampaigns(
        Array.isArray(res)
          ? res.map((camp: { name: string; _id: string }) => ({
              name: camp.name,
              _id: camp._id,
            }))
          : []
      );
    };

    getEmailDetails();
    loadCategories();
    loadCampaigns();
  }, [user, subjectTitle]);

  console.log(emailId, "emailId")

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

  console.log(selectedCategory, "selectedCategory")
  console.log(selectedCampaign, "selectedCampaign")

  return (
    <>
      {!loading && (
        <div className="w-full h-[90vh] relative">
          <EmailEditor
            minHeight={"80vh"}
            ref={emailEditorRef}
            onReady={onReady}
          />
          <div className="absolute bottom-0 flex items-center justify-end gap-4 right-0 w-full border-t p-3 bg-white">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border rounded px-3 py-2 text-sm"
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
              className="border rounded px-3 py-2 text-sm"
            >
              <option value="">Select Campaign</option>
              {campaigns.map((camp) => (
                <option key={camp._id} value={camp._id}>
                  {camp.name}
                </option>
              ))}
            </select>

            <Button
              className="bg-transparent cursor-pointer flex items-center gap-1 text-black border border-[#00000048] text-lg rounded-lg"
              onClick={saveDraft}
            >
              <span className="opacity-[.7]">Save Draft</span>
            </Button>
            <Button
              className="bg-[#000] text-white cursor-pointer flex items-center gap-1 border text-lg rounded-lg"
              onClick={exportHtml}
            >
              <span>Send</span>
            </Button>
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
//   const [selectedCategoryId, setSelectedCategoryId] = useState<string[]>([]);
//   const [selectedCampaign, setSelectedCampaign] = useState("");

//   const { user } = useClerk();
//   const emailEditorRef = useRef<EditorRef>(null);
//   const history = useRouter();

//   useEffect(() => {
//     if (user) {
//       getEmailDetails();
//       loadCategories();
//       loadCampaigns();
//     }
//   }, [user]);

//   const loadCategories = async () => {
//     const res = await getCategoryByOwnerId({ newsLetterOwnerId: user?.id! });
//     setCategories(
//       Array.isArray(res) ? res.map((category: { name: string; _id: string }) => ({ name: category.name, _id: category._id })) : []
//     );
//   };

//   const loadCampaigns = async () => {
//     const res = await getAllCampaignsByOwnerId({newsLetterOwnerId: user?.id!});

//     if (Array.isArray(res)) {
//       // setCampaigns(res.map((campaign) => campaign.name));
//       setCampaigns(res.map((campaign: { name: string; _id: string }) => ({ name: campaign.name, _id: campaign._id }))); // Assuming CampaignResponse has a 'name' property
//     } else {
//       console.error(res.error); // Handle the error case
//       setCampaigns([]);
//     }
//   };

//   const getEmailDetails = async () => {
//     const res = await GetEmailDetails({
//       title: subjectTitle,
//       newsLetterOwnerId: user?.id!,
//     });

//     if (!res) {
//       setLoading(false);
//       return;
//     }

//     if (res) {
//       setJsonData(JSON.parse(res.content));
//     }

//     if (res.category) {
//       setSelectedCategory(res.category); // This should be category ID
//     }

//     if (res.campaign) {
//       setSelectedCampaign(res.campaign); // This should be campaign ID
//     }

//     if (res._id) {
//       setEmailId(res._id);
//     }



//     setLoading(false);
//   };

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

//       await sendEmail({
//         userEmail: ["goldick60@gmail.com"],
//         subject: subjectTitle,
//         content: html,
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

//   return (
//     <>
//       {!loading && (
//         <div className="w-full h-[90vh] relative">
//           <EmailEditor
//             minHeight={"80vh"}
//             ref={emailEditorRef}
//             onReady={onReady}
//           />
//           <div className="absolute bottom-0 flex items-center justify-end gap-4 right-0 w-full border-t p-3 bg-white">
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
