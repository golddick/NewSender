"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import EmailEditor, { EditorRef, EmailEditorProps } from "react-email-editor";
import { DefaultJsonData } from "@/assets/mails/default";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/react";
import toast from "react-hot-toast";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useMediaQuery } from "@/hooks/use-media-query";

import { getLogUserCampaigns } from "@/actions/campaign/get-campaign";
import { saveEmailToDatabase } from "@/actions/email/addEmail";
import { getEmailByTitle } from "@/actions/email/getEmail";
import { getSubscribers } from "@/actions/subscriber/get.subscribers";
import { sendInstantEmail } from "@/actions/email/sendInstantEmail";
import { EmailType } from "@prisma/client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Save,
  Bolt,
  Target,
  Calendar,
  SendHorizonal,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Loader from "@/components/Loader";

interface Subscriber {
  email: string;
  name?: string;
}

interface Campaign {
  id: string;
  name: string;
  description?: string;
  type?: string;
  emails: any[];
}

const ViewMailPage = ({ subjectTitle }: { subjectTitle: string }) => {
  const [subject, setSubject] = useState(subjectTitle);
  const [loading, setLoading] = useState(true);
  const [jsonData, setJsonData] = useState<any>(DefaultJsonData);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [campaignsLoading, setCampaignsLoading] = useState(false);
  const [emailId, setEmailId] = useState("");
  const [selectedCampaign, setSelectedCampaign] = useState("");
  const [allSubscribers, setAllSubscribers] = useState<Subscriber[]>([]);
  const [subscribersLoading, setSubscribersLoading] = useState(false);
  const [emailType, setEmailType] = useState<EmailType>("DRAFT");
  const [scheduleDate, setScheduleDate] = useState<Date | null>(new Date());
  const [scheduleTime, setScheduleTime] = useState<string>("12:00");
  const [isSending, setIsSending] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const emailEditorRef = useRef<EditorRef>(null);
  const router = useRouter();
  const { user } = useClerk();
  const adminEmail = user?.emailAddresses?.[0]?.emailAddress;

  const isMobile = useMediaQuery("(max-width: 640px)");
  const isTablet = useMediaQuery("(min-width: 641px) and (max-width: 1024px)");

  const loadAllSubscribers = useCallback(async () => {
    if (!user?.id) return;
    setSubscribersLoading(true);

    try {
      const result = await getSubscribers();
      if (result.error) throw new Error(result.error);

      setAllSubscribers(
        (result.subscribers || []).map((sub: any) => ({
          email: sub.email,
          name: sub.name ?? undefined,
        }))
      );
    } catch (err) {
      console.error("Load subscribers error:", err);
      toast.error("Failed to load subscribers");
      setAllSubscribers([]);
    } finally {
      setSubscribersLoading(false);
    }
  }, [user?.id]);

  const loadCampaigns = useCallback(async () => {
    if (!user?.id) return;
    setCampaignsLoading(true);

    try {
      const campaignsRes = await getLogUserCampaigns();
      if (Array.isArray(campaignsRes)) {
        setCampaigns(
          campaignsRes.map((campaign: any) => ({
            id: campaign.id,
            name: campaign.name,
            description: campaign.description,
            type: campaign.type,
            emails: campaign.emails,
          }))
        );
      }
    } catch (error) {
      console.error("Load campaigns error:", error);
      toast.error("Failed to load campaigns");
      setCampaigns([]);
    } finally {
      setCampaignsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (!user) {
      toast.error("User not authenticated.");
      return;
    }

    const init = async () => {
      setLoading(true);
      try {
        const [emailResult] = await Promise.all([
          getEmailByTitle({ title: subject, newsLetterOwnerId: user.id }),
          loadCampaigns(),
          loadAllSubscribers(),
        ]);

        if (emailResult.success && emailResult.data) {
          const emailDetails = emailResult.data;

          let content;
          if (typeof emailDetails.content === "string") {
            try {
              content = JSON.parse(emailDetails.content);
            } catch {
              content = {
                body: {
                  rows: [
                    {
                      columns: [
                        {
                          contents: `<div>${emailDetails.content}</div>`,
                          type: "text",
                          content: `<div>${emailDetails.content}</div>`,
                        },
                      ],
                    },
                  ],
                },
              };
            }
          } else {
            content = emailDetails.content;
          }

          setJsonData(content);
          setEmailType(emailDetails.emailType || "DRAFT");
          setEmailId(emailDetails.id);

          if (emailDetails.campaign?.id) {
            setSelectedCampaign(emailDetails.campaign.id);
          }
        }
      } catch (error) {
        console.error("Init error:", error);
        toast.error("Failed to load initial data");
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [user, subject, loadCampaigns, loadAllSubscribers]);

  const onReady: EmailEditorProps["onReady"] = useCallback(() => {
    if (emailEditorRef.current?.editor) {
      emailEditorRef.current.editor.loadDesign(jsonData);
    }
  }, [jsonData]);

  const saveDraft = async () => {
    setIsSaving(true);
    setEmailType("DRAFT");
    emailEditorRef.current?.editor?.exportHtml(async ({ design, html }) => {
      try {
        const scheduledDateTime = new Date(scheduleDate || new Date());
        const [hours, minutes] = scheduleTime.split(":").map(Number);
        scheduledDateTime.setHours(hours, minutes);

        const res = await saveEmailToDatabase({
          title: subject,
          content: JSON.stringify(design),
          emailId: emailId,
          textContent: html,
          emailSubject: subject,
          template: campaigns.find((c) => c.id === selectedCampaign)?.type || "",
          newsLetterOwnerId: user?.id!,
          campaignId: selectedCampaign,
          emailType: "DRAFT",
          scheduleDate: scheduledDateTime,
          scheduleTime: scheduleTime,
          adminEmail: adminEmail || "",
        });

        if (!res.success) {
          throw new Error(res.error || "Failed to save draft");
        }

        toast.success("Draft saved successfully");
        router.push("/dashboard/auto-email");
      } catch (err: any) {
        console.error("Save error:", err);
        toast.error(err.message || "Failed to save draft");
      } finally {
        setIsSaving(false);
      }
    });
  };

  const sendEmailToSubscribers = async () => {
    setIsSending(true);
    emailEditorRef.current?.editor?.exportHtml(async ({ design, html }) => {
      setJsonData(design);

      if (allSubscribers.length === 0) {
        toast.error("No subscribers found");
        setIsSending(false);
        return;
      }

      try {
        let result;

        if (emailType === "INSTANT") {
          result = await sendInstantEmail({
            userEmails: allSubscribers.map((s) => s.email),
            subject: subject,
            htmlContent: html,
            content: design,
            emailTemplateId: emailId,
            newsLetterOwnerId: user?.id!,
            campaignId: selectedCampaign,
            adminEmail: adminEmail || "",
          });
        } else if (emailType === "SCHEDULE" && scheduleDate) {
          const res = await saveEmailToDatabase({
            title: subject,
            content: JSON.stringify(design),
            emailId: emailId,
            textContent: html,
            emailSubject: subject,
            template: campaigns.find((c) => c.id === selectedCampaign)?.type || "",
            newsLetterOwnerId: user?.id!,
            campaignId: selectedCampaign,
            emailType: emailType,
            scheduleDate: scheduleDate,
            scheduleTime: scheduleTime,
            adminEmail: adminEmail || "",
          });

          if (!res.success) {
            throw new Error(res.error || "Failed to schedule email");
          }
        }

        if (!result?.success && emailType === "INSTANT") {
          throw new Error(result?.error || "Email failed to send");
        }

        toast.success(
          emailType === "SCHEDULE"
            ? `Email scheduled for ${scheduleDate?.toLocaleString()}`
            : `Email sent to ${allSubscribers.length} subscribers`
        );
        router.push("/dashboard/auto-email");
      } catch (err: any) {
        console.error("Send email error:", err);
        toast.error(err.message || "Failed to send email");
      } finally {
        setIsSending(false);
      }
    });
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className={`w-full min-h-screen p-4 md:p-4 space-y-4 ${isMobile ? 'mobile-layout' : ''} ${isTablet ? 'tablet-layout' : 'desktop-layout'}`}>
      <Card className="border-none shadow-none">
        <CardHeader className="bg-transparent p-3 sm:p-6">
          <CardTitle className="flex items-center text-base sm:text-lg">
            <Target className={`mr-2 ${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} />
            Email Type
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-6">
          <div className={`grid gap-3 ${isMobile ? 'grid-cols-1' : ''} ${isTablet ? 'grid-cols-2' : 'grid-cols-3'}`}>
            {[
              {
                type: "DRAFT",
                icon: Bolt,
                title: "Draft Email",
                description: "Save mail and send later",
                color: "bg-orange-100 text-orange-600",
              },
              {
                type: "INSTANT",
                icon: SendHorizonal,
                title: "Instant Email",
                description: "Send immediately to subscribers",
                color: "bg-blue-100 text-blue-600",
              },
              {
                type: "SCHEDULE",
                icon: Calendar,
                title: "Schedule Email",
                description: "Schedule email to be sent later",
                color: "bg-red-100 text-red-600",
              },
            ].map((item) => (
              <div
                key={item.type}
                className={`p-3 sm:p-4 border rounded-lg cursor-pointer transition-all ${
                  emailType === item.type
                    ? "border-primary bg-primary/10"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setEmailType(item.type as EmailType)}
              >
                <div className="flex items-center mb-2">
                  <div className={`${item.color} p-2 rounded-full mr-3`}>
                    <item.icon className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} />
                  </div>
                  <h3 className={`font-semibold ${isMobile ? 'text-xs' : 'text-sm'}`}>{item.title}</h3>
                </div>
                <p className="text-xs text-gray-500">{item.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {emailType === "SCHEDULE" && (
        <Card className="border shadow-sm">
          <CardHeader className="bg-gray-50 p-3 sm:p-6">
            <CardTitle className="flex items-center text-base sm:text-lg">
              <Calendar className={`mr-2 ${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} />
              Schedule Email
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-6">
            <div className={`grid gap-3 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
              <div>
                <label className={`block font-medium mb-1 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                  Schedule Date
                </label>
                <DatePicker
                  selected={scheduleDate}
                  onChange={(date) => setScheduleDate(date)}
                  minDate={new Date()}
                  className={`w-full rounded-md border border-gray-300 p-2 ${isMobile ? 'text-xs' : 'text-sm'}`}
                  dateFormat="MMMM d, yyyy"
                />
              </div>
              <div>
                <label className={`block font-medium mb-1 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                  Schedule Time
                </label>
                <input
                  type="time"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  className={`w-full rounded-md border border-gray-300 p-2 ${isMobile ? 'text-xs' : 'text-sm'}`}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="bg-white p-3 sm:p-4 rounded-lg border shadow-sm">
        <div className={`flex gap-3 ${isMobile ? 'flex-col' : 'flex-row items-center justify-between'}`}>
          <div className="flex-1 min-w-0">
            {campaignsLoading ? (
              <Skeleton className={`w-full rounded-md ${isMobile ? 'h-8' : 'h-10'}`} />
            ) : campaigns.length > 0 ? (
              <select
                value={selectedCampaign}
                onChange={(e) => setSelectedCampaign(e.target.value)}
                className={`w-full rounded-md border border-gray-300 p-2 ${isMobile ? 'text-xs w-[80%] mx-auto' : 'text-sm'}`}
                disabled={campaignsLoading}
              >
                <option value="" className=" p-2">Select Campaign</option>
                {campaigns.map((campaign) => (
                  <option key={campaign.id} value={campaign.id} className="p-2 truncate">
                    {campaign.name}
                  </option>
                ))}
              </select>
            ) : (
              <p className={`text-gray-500 ${isMobile ? 'text-xs' : 'text-sm'}`}>No campaigns available</p>
            )}
          </div>
          {/* <div className={`flex ${isMobile ? 'flex-col gap-2 w-full' : 'flex-row items-center gap-3'}`}>
            <Button
              className={`${isMobile ? 'w-full' : 'w-auto'}`}
              size={isMobile ? "sm" : "md"}
              color="primary"
              variant="bordered"
              onPress={saveDraft}
              isLoading={isSaving}
              startContent={!isSaving && <Save className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} />}
            >
              {isSaving ? "Saving..." : "Save Draft"}
            </Button>
            
            <Button
              className={`${isMobile ? 'w-full' : 'w-auto'}`}
              size={isMobile ? "sm" : "md"}
              color="primary"
              onPress={sendEmailToSubscribers}
              isDisabled={isSending || allSubscribers.length === 0 || subscribersLoading}
              isLoading={isSending}
              startContent={!isSending && <SendHorizonal className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} />}
            >
              {subscribersLoading ? (
                "Loading..."
              ) : allSubscribers.length > 0 ? (
                emailType === "SCHEDULE" ? (
                  `Schedule (${allSubscribers.length})`
                ) : (
                  `Send (${allSubscribers.length})`
                )
              ) : (
                "No subscribers"
              )}
            </Button>
          </div> */}
        </div>
      </div>

      <div className="w-full border shadow-sm rounded-lg p-3 sm:p-4 bg-white">
        <div className={`mb-3 sm:mb-4 border-none flex ${isMobile ? 'flex-col gap-2' : 'flex-row items-center gap-4'}`}>
          <label className={`block flex-nowrap text-nowrap font-medium ${isMobile ? 'text-xs' : 'text-sm'}`}>
            Email Subject:
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className={`w-full rounded-md border-none  p-2 ${isMobile ? 'text-xs' : 'text-sm'}`}
            placeholder="Enter subject here"
          />
        </div>

        <div className={`rounded-md overflow-y-scroll scrollbar-hide border-none ${
          isMobile ? 'h-[calc(100vh-400px)]' : 
          isTablet ? 'h-[500px]' : 'h-[600px]'
        }`}>
          <EmailEditor 
            ref={emailEditorRef} 
            onReady={onReady} 
            minHeight="100%"
            style={{ minHeight: '100%' }}
          />
        </div>
      </div>
    </div>
  );
};

export default ViewMailPage;






