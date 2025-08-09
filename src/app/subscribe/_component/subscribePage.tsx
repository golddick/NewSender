
// "use client";

// import { subscribe } from "@/actions/add.subscribe";
// import { getCategoryById, getCategoryByName } from "@/actions/get.category";
// import { useRouter, useSearchParams } from "next/navigation";
// import { FormEvent, useEffect, useState } from "react";
// import toast from "react-hot-toast";


// const SubscribeFormPage = () => {
//   const [email, setEmail] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [categoryId, setCategoryId] = useState("");
//   const [campaign, setCampaign] = useState("");
//   const searchParams = useSearchParams();
//   const router = useRouter()

//   const username = searchParams.get("username");
//   const category = searchParams.get("category");

//   console.log(category, username , 'categoryName');


//   useEffect(() => {
//     const fetchCategory = async () => {
//       if (!category) return;

//       const res = await getCategoryByName({ name: category });

//       console.log(res, 'categoryId');

//       if (res?._id) {
//         setCategoryId(res._id);
//       } else {
//         toast.error("Category not found.");
//       }

//       setCampaign(res?.Categorycampaigns?.[0]?.name ?? "General Campaign");
//     };

//     fetchCategory();
//   }, [category]);

//   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     if (!username || !category) {
//       toast.error("Invalid subscription link.");
//       return;
//     }

//     setLoading(true);

//     const result = await subscribe({
//       email,
//       username,
//       categoryId:categoryId,
//       campaign: campaign,
//     });

//     setLoading(false);
//     router.refresh()
//     if (result?.error) {
//       toast.error(result.error);
//     } else {
//       toast.success("Subscribed successfully!");
//       setEmail("");
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
//       <div className="max-w-md w-full space-y-6">
//         <h1 className="text-4xl font-bold text-center">
//           Subscribe to {username}&rsquo;s  Newsletter
//         </h1>

//         <form onSubmit={handleSubmit} className="bg-gray-100 p-6 rounded shadow-md space-y-4">
//           <input
//             type="email"
//             placeholder="Your email address"
//             required
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gold-500"
//             disabled={loading}
//           />

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-gold-700 text-white py-3 rounded hover:bg-gold-500 transition"
//           >
//             {loading ? "Subscribing..." : "Subscribe"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default SubscribeFormPage;













"use client";

import { getCampaignById } from "@/actions/campaign/get-campaign";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { addSubscriber } from "@/actions/subscriber/add.subscriber";
import toast from "react-hot-toast";
import Loader from "@/components/Loader";
import { formatString } from "@/lib/utils";
import type { Campaign } from "@prisma/client"; // ✅ using Prisma type

// Narrowed campaign type for only needed fields
type CampaignInfo = Pick<Campaign, "id" | "name" | "description" | "type" | "status">;

const SubscribeFormPage = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [campaign, setCampaign] = useState<CampaignInfo | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();
  const campaignId = searchParams.get("campaignId");

  useEffect(() => {
    const fetchCampaign = async () => {
      if (!campaignId) {
        console.log("No campaign ID provided - standalone subscription");
        return;
      }

      setLoading(true);
      try {
        const campaignRes = await getCampaignById(campaignId);
        if (!campaignRes) {
          toast.error("Campaign not found");
          return;
        }
        setCampaign(campaignRes); // ✅ no `.data` here
      } catch (error) {
        console.error("Error loading campaign:", error);
        toast.error("Failed to load campaign data");
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();
  }, [campaignId, router]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please provide your email address");
      return;
    }

    setLoading(true);
    try {
      const result = await addSubscriber({
        email,
        name: name || undefined,
        campaignId: campaignId || undefined,
        source: "website-form",
        status: "Subscribed",
        pageUrl: window.location.href,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      toast.success("Subscribed successfully!");
      setEmail("");
      setName("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Subscription failed");
    } finally {
      setLoading(false);
    }
  };

  if (loading && campaignId && !campaign) {
    return <Loader />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4 py-12">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">
            {campaign ? `Subscribe to ${campaign.name}` : "Subscribe to our newsletter"}
          </h1>
          {campaign?.type && (
            <p className="text-gray-600 mt-2">
              {`${formatString(campaign.type)} • Campaign`}
            </p>
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-gray-50 p-6 rounded-lg shadow-sm space-y-4"
        >
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address *
            </label>
            <input
              id="email"
              type="email"
              placeholder="your@email.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name (Optional)
            </label>
            <input
              id="name"
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition flex justify-center items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin h-5 w-5" />
                Processing...
              </>
            ) : (
              "Subscribe Now"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SubscribeFormPage;
