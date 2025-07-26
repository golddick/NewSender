



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

import { getIntegrations } from "@/actions/application-Integration/application";
import { getCampaignsByIntegration } from "@/actions/campaign/get-campaign";
import { saveEmailToDatabase } from "@/actions/email/addEmail";
import { getEmailByTitle } from "@/actions/email/getEmail";
import { getSubscribers, getSubscribersByIntegration } from "@/actions/subscriber/get.subscribers";
import { sendInstantEmail } from "@/actions/email/sendInstantEmail";
import { EmailType } from "@prisma/client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Save,
  Send,
  Users,
  Mail,
  Bot,
  Bolt,
  Loader2,
  Target,
  Globe,
  Calendar,
  SendHorizonalIcon,
} from "lucide-react";
import Loader from "@/components/Loader";

interface Subscriber {
  email: string;
  name?: string;
}

const Emaileditor = ({ subjectTitle }: { subjectTitle: string }) => {
  const [subject, setSubject] = useState(subjectTitle);
  const [loading, setLoading] = useState(true);
  const [jsonData, setJsonData] = useState<any>(DefaultJsonData);
  const [integrations, setIntegrations] = useState<{ name: string; id: string }[]>([]);
  const [campaigns, setCampaigns] = useState<
    { name: string; id: string; integrationId: string; trigger: string }[]
  >([]);
  const [emailId, setEmailId] = useState("");
  const [selectedIntegration, setSelectedIntegration] = useState("");
  const [selectedCampaign, setSelectedCampaign] = useState("");
  const [selectedIntegrationName, setSelectedIntegrationName] = useState("");
  const [allSubscribers, setAllSubscribers] = useState<Subscriber[]>([]);
  const [integrationSubscribers, setIntegrationSubscribers] = useState<Subscriber[]>([]);
  const [emailType, setEmailType] = useState<EmailType>('INSTANT');
  const [scheduleDate, setScheduleDate] = useState<Date | null>(new Date());
  const [scheduleTime, setScheduleTime] = useState<string>("12:00");
  const [isSending, setIsSending] = useState(false);
  const emailEditorRef = useRef<EditorRef>(null);
  const router = useRouter();
  const { user } = useClerk();
  const adminEmail = user?.emailAddresses?.[0]?.emailAddress;

  // Load all subscribers (regardless of integration)
  const loadAllSubscribers = useCallback(async () => {
    if (!user?.id) return;

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
      console.error("Load all subscribers error:", err);
      toast.error("Failed to load all subscribers");
      setAllSubscribers([]);
    }
  }, [user?.id]);

  // Load subscribers under specific integration
  const loadIntegrationSubscribers = useCallback(
    async (integrationId: string, campaignId?: string) => {
      if (!user?.id || !integrationId) return;

      try {
        const result = await getSubscribersByIntegration({
          integrationId,
          campaign: campaignId,
          ownerId: user.id,
        });

        if (result.error) throw new Error(result.error);

        setIntegrationSubscribers(
          (result.subscribers || []).map((sub: any) => ({
            email: sub.email,
            name: sub.name ?? undefined,
          }))
        );
      } catch (err) {
        console.error("Load integration subscribers error:", err);
        toast.error("Failed to load integration subscribers");
        setIntegrationSubscribers([]);
      }
    },
    [user?.id]
  );

  useEffect(() => {
    if (!user) {
      toast.error("User not authenticated.");
      return;
    }

    const init = async () => {
      try {
        const [emailResult, integrationRes] = await Promise.all([
          getEmailByTitle({ title: subject, newsLetterOwnerId: user.id }),
          getIntegrations(),
        ]);

        if (emailResult.success && emailResult.data) {
          const emailDetails = emailResult.data;


            // Handle both JSON and HTML content
          let content;
          if (typeof emailDetails.content === "string") {
            try {
              // Try to parse as JSON
              content = JSON.parse(emailDetails.content);
            } catch {
              // If parsing fails, create a basic JSON structure with HTML content
              content = {
                body: {
                  rows: [{
                    columns: [{
                      contents: `<div>${emailDetails.content}</div>`,
                      type: "text",
                      content: `<div>${emailDetails.content}</div>`
                    }]
                  }]
                }
              };
            }
          } else {
            content = emailDetails.content;
          }

          console.log("Loaded email content:", content);
          console.log("Loaded email details:", emailDetails);

          // const content =
          //   typeof emailDetails.content === "string"
          //     ? JSON.parse(emailDetails.content)
          //     : emailDetails.content;
          
          setJsonData(content);
          setEmailType(emailDetails.emailType || 'INSTANT');

          if (emailDetails.integration?.id) {
            const integrationId = emailDetails.integration.id;
            setSelectedIntegration(integrationId);
            setSelectedIntegrationName(emailDetails.integration.name);

            // Load campaigns for this integration
            const campaignRes = await getCampaignsByIntegration(integrationId);
            const loadedCampaigns = Array.isArray(campaignRes.data?.campaigns)
              ? campaignRes.data.campaigns.map((c: any) => ({
                  id: c.id,
                  name: c.name,
                  integrationId,
                  trigger: c.trigger,
                }))
              : [];
            setCampaigns(loadedCampaigns);

            if (emailDetails.campaign?.id) {
              setSelectedCampaign(emailDetails.campaign.id);
            }
          }

          setEmailId(emailDetails.id);
        }

        setIntegrations(
          integrationRes?.data?.map((i: any) => ({
            id: i.id,
            name: i.name,
          })) || []
        );

        // Always load all subscribers
        await loadAllSubscribers();

        // Load integration subscribers if integration exists
        if (selectedIntegration) {
          await loadIntegrationSubscribers(selectedIntegration, selectedCampaign);
        }

        setLoading(false);
      } catch (error) {
        console.error("Init error:", error);
        toast.error("Failed to load initial data");
        setLoading(false);
      }
    };

    init();
  }, [user, subject, loadAllSubscribers, loadIntegrationSubscribers, selectedIntegration, selectedCampaign]);

  const handleIntegrationChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const integrationId = e.target.value;
    setSelectedIntegration(integrationId);
    setSelectedIntegrationName(integrations.find((i) => i.id === integrationId)?.name || "");
    setSelectedCampaign("");

    if (integrationId) {
      // Load campaigns for selected integration
      try {
        const campaignRes = await getCampaignsByIntegration(integrationId);
        const loadedCampaigns = Array.isArray(campaignRes.data?.campaigns)
          ? campaignRes.data.campaigns.map((c: any) => ({
              id: c.id,
              name: c.name,
              integrationId,
              trigger: c.trigger,
            }))
          : [];
        setCampaigns(loadedCampaigns);

        // Load subscribers for this integration
        await loadIntegrationSubscribers(integrationId);
      } catch (err) {
        console.error("Integration change error:", err);
        toast.error("Failed to load integration data");
      }
    } else {
      setCampaigns([]);
      setIntegrationSubscribers([]);
    }
  };

  const handleCampaignChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const campaignId = e.target.value;
    setSelectedCampaign(campaignId);
    if (selectedIntegration) {
      await loadIntegrationSubscribers(selectedIntegration, campaignId);
    }
  };



  // const onReady: EmailEditorProps["onReady"] = () => {
  //   emailEditorRef.current?.editor?.loadDesign(jsonData);
  // };

  const onReady: EmailEditorProps["onReady"] = useCallback(() => {
    if (emailEditorRef.current?.editor) {
      // Always use loadDesign - we've converted HTML to JSON structure
      emailEditorRef.current.editor.loadDesign(jsonData);
    }
  }, [jsonData]);

  const saveDraft = async () => {
    emailEditorRef.current?.editor?.exportHtml(async ({ design, html }) => {
      try {
        const scheduledDateTime = new Date(scheduleDate || new Date());
        const [hours, minutes] = scheduleTime.split(':').map(Number);
        scheduledDateTime.setHours(hours, minutes);

        const res = await saveEmailToDatabase({
          title: subject,
          content: JSON.stringify(design),
          emailId: emailId,
          textContent: html,
          emailSubject: subject,
          template: campaigns.find(c => c.id === selectedCampaign)?.trigger || "",
          newsLetterOwnerId: user?.id!,
          campaignId: selectedCampaign,
          integrationId: selectedIntegration,
          emailType: emailType,
          scheduleDate: scheduledDateTime,
          scheduleTime: scheduleTime,
          adminEmail: adminEmail || "",
        });

        if (!res.success) {
          toast.error(res.error || "Failed to save draft");
          return;
        }

        toast.success("Draft saved successfully");
        router.push("/dashboard/auto-email");
      } catch (err) {
        console.error("Save error:", err);
        toast.error("Failed to save draft");
      }
    });
  };

  const sendEmailToSubscribers = async (subscribersToSend: Subscriber[], isIntegrationSpecific = false) => {
    setIsSending(true);
    emailEditorRef.current?.editor?.exportHtml(async ({ design, html }) => {
      setJsonData(design);

      if (subscribersToSend.length === 0) {
        toast.error("No subscribers found");
        setIsSending(false);
        return;
      }

      try {
        let result;
        
        if (emailType === 'INSTANT') {
          result = await sendInstantEmail({
            userEmails: subscribersToSend.map((s) => s.email),
            subject: subject,
            htmlContent: html,
            content: design, 
            emailTemplateId: emailId,
            newsLetterOwnerId: user?.id!,
            integrationId: isIntegrationSpecific ? selectedIntegration : undefined,
            campaignId: isIntegrationSpecific ? selectedCampaign : undefined,
            adminEmail: adminEmail || "",
            fromApplication: isIntegrationSpecific ? selectedIntegrationName : 'TheNews',
          });
        } else if (emailType === 'SCHEDULE' && scheduleDate) {
          const res = await saveEmailToDatabase({
            title: subject,
            content: JSON.stringify(design),
            emailId: emailId,
            textContent: html,
            emailSubject: subject,
            template: campaigns.find(c => c.id === selectedCampaign)?.trigger || "",
            newsLetterOwnerId: user?.id!,
            campaignId: isIntegrationSpecific ? selectedCampaign : undefined,
            integrationId: isIntegrationSpecific ? selectedIntegration : undefined,
            emailType: emailType,
            scheduleDate: scheduleDate,
            scheduleTime: scheduleTime,
            adminEmail: adminEmail || "",
            fromApplication: isIntegrationSpecific ? selectedIntegrationName : undefined
          });

          if (!res.success) {
            toast.error(res.error || "Failed to schedule email");
            setIsSending(false);
            return;
          }
        }

        if (!result?.success && emailType === 'INSTANT') {
          toast.error(result?.error || "Email failed to send");
          setIsSending(false);
          return;
        }

        toast.success(
          emailType === 'SCHEDULE' 
            ? `Email scheduled for ${scheduleDate?.toLocaleString()}`
            : `Email sent to ${subscribersToSend.length} subscribers`
        );
        router.push("/dashboard/auto-email");
      } catch (err) {
        console.error("Send email error:", err);
        toast.error("Failed to send email");
      } finally {
        setIsSending(false);
      }
    });
  };

  const filteredCampaigns = campaigns.filter(
    (c) => c.integrationId === selectedIntegration
  );

  if (loading) {
    return (
     <Loader/>
    );
  }

  return (
    <div className="w-full h-full relative p-2 md:p-4">
      {/* Email Type Selection */}
      <Card className="mb-4">
        <CardHeader className="bg-white text-black border shadow-md rounded-lg">
          <CardTitle className="flex items-center">
            <Target className="w-5 h-4 mr-2" />
            Email Type
          </CardTitle>
        </CardHeader>
        <CardContent className="p-2 sm:p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
            <div
              className={`p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition-all ${
                emailType === "DRAFT" ? "border-yellow-500 bg-yellow-50" : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => setEmailType("DRAFT")}
            >
              <div className="flex items-center mb-1">
                <div className="bg-orange-100 p-2 rounded-full mr-3">
                  <Bolt className="w-4 h-4 text-orange-600" />
                </div>
                <h3 className="text-sm sm:text-[15px] font-semibold text-black">Draft Email</h3>
              </div>
              <p className="text-gray-600 text-xs">
                Save mail and send later.
              </p>
            </div>
            <div
              className={`p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition-all ${
                emailType === 'INSTANT' ? "border-yellow-500 bg-yellow-50" : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => setEmailType("INSTANT")}
            >
              <div className="flex items-center mb-1">
                <div className="bg-orange-100 p-2 rounded-full mr-3">
                  <SendHorizonalIcon className="w-4 h-4 text-orange-600" />
                </div>
                <h3 className="text-sm sm:text-[15px] font-semibold text-black">Instant Email</h3>
              </div>
              <p className="text-gray-600 text-xs">
                Send immediately to subscribers.
              </p>
            </div>
            <div
              className={`p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition-all ${
                emailType === "SCHEDULE" ? "border-yellow-500 bg-yellow-50" : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => setEmailType("SCHEDULE")}
            >
              <div className="flex items-center mb-1">
                <div className="bg-red-100 p-2 rounded-full mr-3">
                  <Calendar className="w-4 h-4 text-red-600" />
                </div>
                <h3 className="text-sm sm:text-[15px] font-semibold text-black">Schedule Email</h3>
              </div>
              <p className="text-gray-600 text-xs">
                Schedule email to be sent later.
              </p>
            </div>
            <div
              className={`p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition-all ${
                emailType === "AUTOMATED" ? "border-yellow-500 bg-yellow-50" : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => setEmailType("AUTOMATED")}
            >
              <div className="flex items-center mb-1">
                <div className="bg-purple-100 p-2 rounded-full mr-3">
                  <Bot className="w-4 h-4 text-purple-600" />
                </div>
                <h3 className="text-sm sm:text-[15px] font-semibold text-black">Automated Email</h3>
              </div>
              <p className="text-gray-600 text-xs">
                Automated mail based on actions.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Schedule Date Picker */}
      {emailType === 'SCHEDULE' && (
        <Card className="mb-4">
          <CardHeader className="bg-white text-black border shadow-md rounded-lg">
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-4 mr-2" />
              Schedule Email
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2 sm:p-4 grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Schedule Date</label>
              <DatePicker
                selected={scheduleDate}
                onChange={(date) => setScheduleDate(date)}
                minDate={new Date()}
                className="border rounded px-3 py-2 w-full text-sm"
                dateFormat="MMMM d, yyyy"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Schedule Time</label>
              <input
                type="time"
                value={scheduleTime}
                onChange={(e) => setScheduleTime(e.target.value)}
                className="border rounded px-3 py-2 w-full text-sm"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Integration and Campaign Selection */}
      <div className="w-full border-t bg-white p-2 sm:p-4 mb-4 rounded-lg shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 sm:gap-4">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full md:w-auto">
            {integrations.length > 0 && (
              <select
                value={selectedIntegration}
                onChange={handleIntegrationChange}
                className="border rounded px-3 py-2 text-sm w-full"
              >
                <option value="">Select Integrated App</option>
                {integrations.map((int) => (
                  <option key={int.id} value={int.id}>
                    {int.name}
                  </option>
                ))}
              </select>
            )}
            
            {filteredCampaigns.length > 0 && selectedIntegration && (
              <select
                value={selectedCampaign}
                onChange={handleCampaignChange}
                className="border rounded px-3 py-2 text-sm w-full"
              >
                <option value="">Select Campaign</option>
                {filteredCampaigns.map((camp) => (
                  <option key={camp.id} value={camp.id}>
                    {camp.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full md:w-auto">
            <Button
              className="bg-transparent border border-black/30 text-black text-sm w-full"
              onPress={saveDraft}
              size="sm"
            >
              <Save className="w-4 h-4 mr-1" /> Save Draft
            </Button>
          </div>
        </div>
      </div>

      {/* Email Subject and Editor */}
      <div className="w-full h-full border shadow-md rounded-md p-2 sm:p-4 mb-4 relative bg-white">
        <div className="mb-2 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 w-full">
          <label className="block text-sm font-medium text-black min-w-[100px]">Email Subject:</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
            placeholder="Enter subject here"
          />
        </div>

        <div className="h-[500px] sm:h-[600px]">
          <EmailEditor ref={emailEditorRef} onReady={onReady} />
        </div>
      </div>

      {/* Send Buttons */}
      <div className="w-full bg-white p-2 sm:p-4 rounded-lg shadow-sm sticky bottom-0 z-10 border-t">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          {/* Button to send to ALL subscribers */}
          <Button
            className="bg-black text-white text-sm w-full"
            onPress={() => sendEmailToSubscribers(allSubscribers, false)}
            isDisabled={isSending || allSubscribers.length === 0}
            size="sm"
            isLoading={isSending}
            startContent={<Globe className="w-4 h-4" />}
          >
            {allSubscribers.length > 0
              ? emailType === 'SCHEDULE'
                ? `Schedule for All (${allSubscribers.length}) subscribers`
                : `Send to All (${allSubscribers.length}) subscribers`
              : "No Subscribers"}
          </Button>

          {/* Button to send to integration-specific subscribers */}
          {selectedIntegration && (
            <Button
              className="bg-gold-600 text-black text-sm w-full"
              onPress={() => sendEmailToSubscribers(integrationSubscribers, true)}
              isDisabled={isSending || integrationSubscribers.length === 0}
              size="sm"
              isLoading={isSending}
              startContent={<Target className="w-4 h-4" />}
            >
              {integrationSubscribers.length > 0
                ? emailType === 'SCHEDULE'
                  ? `Schedule for Integration (${integrationSubscribers.length}) subscribers`
                  : `Send to Integration (${integrationSubscribers.length}) subscribers`
                : "No Seleted App Subscribers"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Emaileditor;