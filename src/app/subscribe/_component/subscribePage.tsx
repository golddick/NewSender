
"use client";

import { subscribe } from "@/actions/add.subscribe";
import { getCategoryById, getCategoryByName } from "@/actions/get.category";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";

const SubscribeFormPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [categoryId, setCategoryId] = useState("");
  const [campaign, setCampaign] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter()

  const username = searchParams.get("username");
  const category = searchParams.get("category");

  console.log(category, username , 'categoryName');


  useEffect(() => {
    const fetchCategory = async () => {
      if (!category) return;

      const res = await getCategoryByName({ name: category });

      console.log(res, 'categoryId');

      if (res?._id) {
        setCategoryId(res._id);
      } else {
        toast.error("Category not found.");
      }

      setCampaign(res?.Categorycampaigns?.[0]?.name ?? "General Campaign");
    };

    fetchCategory();
  }, [category]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!username || !category) {
      toast.error("Invalid subscription link.");
      return;
    }

    setLoading(true);

    const result = await subscribe({
      email,
      username,
      categoryId:categoryId,
      campaign: campaign,
    });

    setLoading(false);
    router.refresh()
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Subscribed successfully!");
      setEmail("");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
      <div className="max-w-md w-full space-y-6">
        <h1 className="text-4xl font-bold text-center">
          Subscribe to {username}&rsquo;s  Newsletter
        </h1>

        <form onSubmit={handleSubmit} className="bg-gray-100 p-6 rounded shadow-md space-y-4">
          <input
            type="email"
            placeholder="Your email address"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gold-500"
            disabled={loading}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gold-700 text-white py-3 rounded hover:bg-gold-500 transition"
          >
            {loading ? "Subscribing..." : "Subscribe"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SubscribeFormPage;
