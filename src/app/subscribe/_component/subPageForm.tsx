
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Mail, User, Shield, Bell } from "lucide-react";
import { addSubscriber } from "@/actions/subscriber/add.subscriber";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import Loader from "@/components/Loader";

export function SubscribeFormPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    try {
      console.log("Attempting to subscribe:", { email, name });
      
      const result = await addSubscriber({
        email,
        name: name,
        source: "THENEWS website-form",
        status: 'Subscribed',
        pageUrl: window.location.href,
      });

      if (result?.error) {
        console.error("Subscription failed:", result.error);
        throw new Error(result.error);
      }

      console.log("Subscription successful for email:", email);
      toast.success('Subscribed successfully!');
      setIsSubmitted(true);
      setEmail("");
      setName("");

    } catch (error) {
      console.error("Error in handleSubmit:", error);
      toast.error(error instanceof Error ? error.message : String(error));
    } finally {
      setLoading(false);
    }
  };

  if (loading ) {
    return (
     <Loader/>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white shadow-xl">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome Aboard!</h1>
              <p className="text-gray-600">
                You&apos;ve successfully subscribed 
                {/* You&apos;ve successfully subscribed to <strong>{integration?.name}</strong> */}
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-green-800">
                <strong>What&apos;s next?</strong>
                <br />
                Check your email for a confirmation message and get ready for amazing content!
              </p>
            </div>

            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-center justify-center gap-2">
                <Mail className="h-4 w-4" />
                <span>Confirmation email sent to {email || 'subscriber'}</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Bell className="h-4 w-4" />
                <span>You can unsubscribe anytime</span>
              </div>
            </div>

            <Button onClick={() => window.close()} className="mt-6 w-full bg-black text-white hover:bg-gray-800">
              Close Window
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }


}
