

"use client";

import { deleteEmail } from "@/actions/delete.email";
import { getEmails } from "@/actions/get.emails";
import { ICONS } from "@/shared/utils/icons";
import { useClerk } from "@clerk/nextjs";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";

const Write = () => {
  const [emailTitle, setEmailTitle] = useState("");
  const [emails, setEmails] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { user } = useClerk();

  const handleCreate = () => {
    if (emailTitle.trim().length === 0) {
      toast.error("Enter the email subject to continue!");
      return;
    }
    const formattedTitle = emailTitle.replace(/\s+/g, "-").replace(/&/g, "-");
    router.push(`/dashboard/new-email?subject=${formattedTitle}`);
  };

  // ✅ Memoized function to avoid useEffect dependency warning
  const FindEmails = useCallback(async () => {
    if (!user?.id) return;

    try {
      const res = await getEmails({ newsLetterOwnerId: user.id });
      setEmails(res || []);
    } catch (error) {
      console.error("Failed to fetch emails:", error);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      FindEmails();
    }
  }, [user?.id, FindEmails]);

  const deleteHandler = async (id: string) => {
    await deleteEmail({ emailId: id });
    FindEmails();
  };

  return (
    <div className="w-full p-4 ">
      <div className="flex items-center gap-4 flex-wrap justify-center">
        {/* Create New */}
        <div
          className="h-[200px] w-full md:w-[200px] bg-slate-50 flex flex-col items-center justify-center rounded border cursor-pointer hover:bg-slate-100 transition"
          onClick={() => setOpen(true)}
        >
          <span className="text-2xl text-gray-500 mb-2">{ICONS.plus}</span>
          <h5 className="text-lg font-semibold">Create New</h5>
        </div>

        {/* Saved Emails */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-5">
          {emails.map((email) => {
            const formattedTitle = email?.title
              ?.replace(/\s+/g, "-")
              .replace(/&/g, "-");

            return (
              <div
                key={email._id}
                className="relative h-[100px] lg:h-[200px] bg-white border rounded shadow-sm flex flex-col justify-center items-center p-4 overflow-hidden hover:shadow-md transition-shadow"
              >
                <button
                  type="button"
                  className="absolute top-2 right-2 text-xl text-gray-400 hover:text-red-500 transition cursor-pointer z-10"
                  onClick={() => deleteHandler(email._id)}
                >
                  {ICONS.delete}
                </button>

                <Link
                  href={`/dashboard/new-email?subject=${formattedTitle}`}
                  className="text-center text-base font-medium text-gray-800 hover:text-blue-600 transition line-clamp-3"
                >
                  {email.title || "Untitled"}
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[90%] max-w-md rounded-lg p-6 shadow relative">
            <button
              className="absolute top-3 right-3 text-xl text-gray-500 hover:text-red-600"
              onClick={() => setOpen(false)}
            >
              {ICONS.cross}
            </button>
            <h5 className="text-xl font-semibold mb-4">Enter your Email Subject</h5>
            <input
              type="text"
              className="border w-full h-10 px-3 rounded outline-none focus:ring"
              value={emailTitle}
              onChange={(e) => setEmailTitle(e.target.value)}
              placeholder="e.g. Welcome to our newsletter"
            />
            <Button
              color="primary"
              className="mt-4 w-full rounded text-md font-semibold"
              onPress={handleCreate}
            >
              Continue
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Write;




