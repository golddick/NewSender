// lib/trackingService.ts
import Email from "@/models/email.model";
import Campaign from "@/models/newsLetterCampaign.model";

export const recordOpen = async (emailId: string) => {
  try {
    const updatedEmail = await Email.findByIdAndUpdate(
      emailId,
      {
        $inc: { openCount: 1 },
        $set: { lastOpened: new Date() }
      },
      { new: true }
    );

    if (updatedEmail?.campaign) {
      await Campaign.findByIdAndUpdate(updatedEmail.campaign, {
        $inc: { emailsOpened: 1 }
      });
    }

    return true;
  } catch (error) {
    console.error("Error recording open:", error);
    return false;
  }
};

export const recordClick = async (emailId: string, url: string) => {
  try {
    const updatedEmail = await Email.findByIdAndUpdate(
      emailId,
      {
        $inc: { clickCount: 1 },
        $push: { clickedLinks: { url } },
        $set: { lastClicked: new Date() }
      },
      { new: true }
    );

    if (updatedEmail?.campaign) {
      await Campaign.findByIdAndUpdate(updatedEmail.campaign, {
        $inc: { emailsClicked: 1 }
      });
    }

    return true;
  } catch (error) {
    console.error("Error recording click:", error);
    return false;
  }
};