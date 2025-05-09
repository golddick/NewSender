"use server";

import { connectDb } from "@/shared/libs/db";
import Campaign from "@/models/newsLetterCampaign.model";
import Subscriber from "@/models/subscriber.model";
import Email from "@/models/email.model";
import { sendEmail } from "@/shared/utils/email.sender";

interface SendCampaignEmailProps {
  campaignId: string;
  subject: string;
  content: string;
  contentJson: string;
}

export const sendCampaignEmail = async ({
  campaignId,
  subject,
  content,
  contentJson,
}: SendCampaignEmailProps) => {
  try {
    await connectDb();

    const campaign = await Campaign.findById(campaignId).populate("emails");
    if (!campaign) {
      return { error: "Campaign not found." };
    }

    const subscribers = await Subscriber.find({
      "metadata.campaign": campaign.name,
      newsLetterOwnerId: campaign.newsLetterOwnerId,
      status: "Subscribed",
    });

    if (subscribers.length === 0) {
      return { error: "No subscribers found for this campaign." };
    }

    const recipientEmails = subscribers.map((sub) => sub.email);

    // Create an Email record
    const emailRecord = await Email.create({
      title: subject,
      content: contentJson,
      newsLetterOwnerId: campaign.newsLetterOwnerId,
      campaign: campaignId,
    });

    // Link email to campaign
    campaign.emails.push(emailRecord._id);
    campaign.emailsSent = (campaign.emailsSent || 0) + 1;
    await campaign.save();

    // Send the email
    const sendResult = await sendEmail({
      userEmail: recipientEmails,
      subject,
      content,
      contentJson,
      newsLetterOwnerId: campaign.newsLetterOwnerId,
      campaign: campaignId,
      emailId: emailRecord._id.toString(),
    });

    if ('error' in sendResult) {
      return { error: sendResult.error };
    }

    return {
      success: true,
      message: "Email sent successfully.",
      result: sendResult,
    };
  } catch (err: any) {
    console.error("Send campaign email error:", err);
    return { error: err.message || "Failed to send campaign email." };
  }
};
