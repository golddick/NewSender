"use client";

import { getCategoryByOwnerId } from "@/actions/get.category";
import { useUser } from "@clerk/nextjs";
import { CopyCheckIcon, CopyIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner"; 

const MyCategories = () => {
  const { user } = useUser();
  const [categories, setCategories] = useState<any[]>([]);
  const [copied, setCopied] = useState<string | null>(null);

  const baseUrl = process.env.NEXT_PUBLIC_WEBSITE_URL || "";



  useEffect(() => {
    const fetchCategories = async () => {
      if (!user?.id) return;

      const res = await getCategoryByOwnerId({ newsLetterOwnerId: user.id });

      if (Array.isArray(res)) {
        setCategories(res);
      } else {
        toast.error("Failed to load categories");
      }
    };

    fetchCategories();
  }, [user]);

  const handleCopy = async (url: string, categoryId: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(categoryId);
      toast.success("URL copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy URL");
    }
  };

  return (
    <div className="w-full p-6 ">
      <h1 className="text-3xl font-bold mb-6">Your Categories</h1>

      {categories.length === 0 ? (
        <p className="text-gray-600">You have no categories yet.</p>
      ) : (
        <div className="space-y-4 w-full container mx-auto">
          {categories.map((category) => {
            const subscribeUrl = `${baseUrl}/subscribe?username=${user?.username}&category=${category.name}`;

            return (
              <div
                key={category._id}
                className="border rounded w-full p-4 bg-white shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center"
              >
                <div>
                  <h2 className="text-lg font-semibold">{category.name}</h2>
                  <p className="text-sm text-gray-500 break-all">{subscribeUrl}</p>
                </div>
                <button
                  onClick={() => handleCopy(subscribeUrl, category.name)}
                  className="mt-3 md:mt-0 bg-gold-100 text-gold-700 px-4 py-2 rounded hover:bg-gold-500"
                >
                  {copied === category.name ? <CopyCheckIcon/> : <CopyIcon/>}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyCategories;
