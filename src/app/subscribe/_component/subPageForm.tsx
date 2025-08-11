






"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Mail, User, Shield, Bell } from "lucide-react";
import { getMembership } from "@/actions/membership/getMembership";
import toast from "react-hot-toast";
import { formatString } from "@/lib/utils";
import { addSubscriber } from "@/actions/subscriber/add.subscriber";

export function URLSubscribeFormPage() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [appName, setAppName] = useState<string>("");

  useEffect(() => {
    if (!userId) {
      toast.error("User ID is required.");
      return;
    }

    getMembership()
      .then((data) => {
        if (data?.organization || data?.userName) {
          setAppName(data.organization || data.userName);
        } else {
          setAppName("TheNews");
        }
      })
      .catch(() => {
       toast.error("Failed to retrieve your organization details. Please try again later.");
      });
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !name) {
    toast.error("Please fill in all required fields.");
      return;
    }

    if (!userId) {
      toast.error("Failed to subscribe. Please try again later.");
      return;
    }

    setIsLoading(true);

        try {
      const result = await addSubscriber({
        email,
        name,
        source: "Thenes  website url-form",
        status: "Subscribed",
        pageUrl: window.location.href,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      toast.success("Subscribed successfully!");
      setIsLoading(false)
      setIsSubmitted(true);
      setEmail("");
      setName("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : String(error));
    } finally {
      setIsLoading(false);
      setIsSubmitted(false);
    }

  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white shadow-xl">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome Aboard!
              </h1>
              <p className="text-gray-600">
                You&apos;ve successfully subscribed to <strong>{formatString(appName)}</strong>
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-green-800">
                <strong>What&apos;s next?</strong>
                <br />
                Check your email for a confirmation message and get ready for
                amazing content!
              </p>
            </div>

            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-center justify-center gap-2">
                <Mail className="h-4 w-4" />
                <span>Confirmation email sent to {email}</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Bell className="h-4 w-4" />
                <span>You can unsubscribe anytime</span>
              </div>
            </div>

            <Button
              onClick={() => window.close()}
              className="mt-6 w-full bg-black text-white hover:bg-gray-800"
            >
              Close Window
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="bg-white shadow-xl">
          <CardHeader className="text-center pb-4">
            <div className="mb-4">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Subscribe to {formatString (appName) || "..."}
              </CardTitle>
              <CardDescription className="text-gray-600 mt-2">
                Join our newsletter and stay updated with the latest from{" "}
                {formatString (appName) || "our service"}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="p-6 pt-0">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-sm font-medium text-gray-700"
                >
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 border-gray-300 focus:border-black focus:ring-black"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700"
                >
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 border-gray-300 focus:border-black focus:ring-black"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-black text-white hover:bg-gray-800 py-3"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Subscribing...
                  </div>
                ) : (
                  "Subscribe Now"
                )}
              </Button>
            </form>

            {/* Benefits */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-3">
                What you&apos;ll get:
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span>Weekly newsletter with curated content</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span>Exclusive updates and announcements</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span>No spam, unsubscribe anytime</span>
                </li>
              </ul>
            </div>

            {/* Privacy */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Shield className="h-3 w-3" />
                <span>
                  Your privacy is protected. We never share your information.
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 text-xs text-gray-500">
          <p>Powered by TheNews Platform</p>
        </div>
      </div>
    </div>
  );
}
