
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
import { getIntegrationByName } from "@/actions/application-Integration/application";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { addSubscriber } from "@/actions/subscriber/add.subscriber";
import { Integration } from "@prisma/client";
import toast from "react-hot-toast";
import Loader from "@/components/Loader";
import Image from "next/image";
import { formatString } from "@/lib/utils";

const SubscribeFormPage = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [campaign, setCampaign] = useState<any>(null);
  const [integration, setIntegration] = useState<Partial<Integration>>();
  const searchParams = useSearchParams();
  const router = useRouter();

  const campaignId = searchParams.get("campaignId");
  const appName = searchParams.get("appName");

  useEffect(() => {
    const fetchData = async () => {
      if (!campaignId || !appName) {
        console.error("Invalid subscription link - missing campaignId or appName");
        toast.error("Invalid subscription link");
        router.push("/dashboard");
        return;
      }

      setLoading(true);
      try {
        // Fetch integration data
        const integrationRes = await getIntegrationByName(appName);
        if (!integrationRes || integrationRes.error || !integrationRes.data) {
          const errorMsg = integrationRes?.error || "Integration not found";
          console.error("Failed to fetch integration:", errorMsg);
          throw new Error(errorMsg);
        }
        setIntegration(integrationRes.data as Partial<Integration>);

        // Fetch campaign data
        const campaignRes = await getCampaignById(campaignId);
        if (!campaignRes) {
          console.error("Campaign not found for ID:", campaignId);
          throw new Error("Campaign not found");
        }
        setCampaign(campaignRes.data);

        console.log("Successfully loaded integration and campaign data");
      } catch (error) {
        console.error("Error in fetchData:", error);
        toast.error(error instanceof Error ? error.message : "Failed to load data");
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [campaignId, appName, router]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !campaignId || !appName || !integration?.id) {
      console.error("Missing required fields:", {
        email,
        campaignId,
        appName,
        integrationId: integration?.id
      });
      toast.error("Please provide all required information");
      return;
    }

    setLoading(true);
    try {
      console.log("Attempting to subscribe:", { email, name, campaignId });
      
      const result = await addSubscriber({
        email,
        name: name,
        integrationId: integration?.id,
        campaignId: campaignId,
        source: "THENEWS website-form",
        status: 'Subscribed',
        pageUrl: window.location.href,
      });

      if (result?.error) {
        console.error("Subscription failed:", result.error);
        throw new Error(result.error);
      }

      console.log("Subscription successful for email:", email);
      toast.success('Subscribed successfully!')
      setEmail("");
      setName("");

    } catch (error) {
      console.error("Error in handleSubmit:", error);
      toast.error(error instanceof Error ? error.message : String(error))
    } finally {
      setLoading(false);
    }
  };

  if (loading && (!campaign || !integration)) {
    return (
      <Loader/>
    );
  }

  console.log(campaign, 'camp')
  console.log(integration, 'Int')

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4 py-12">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          {integration?.logo && (
            <div className=" relative  w-16 h-16">
            <Image
              fill 
              src={integration.logo} 
              alt={integration.name || 'logo'}
              className=" absolute mx-auto mb-4 rounded"
            />
             </div>
          )}
          <h1 className="text-3xl font-bold capitalize">
            Subscribe to {integration?.name || "our application"}
          </h1>
        <p className="text-gray-600 mt-2">
        {campaign?.trigger && `${formatString(campaign.trigger)} • `}
        Campaign
      </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg shadow-sm space-y-4">
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
            className="w-full bg-gold-400 text-black py-3 rounded-md hover:bg-gold-700 transition flex justify-center items-center gap-2"
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


