// lib/trackingService.ts
import Email from "@/models/email.model";
import Campaign from "@/models/newsLetterCampaign.model";
import { connectDb } from "@/shared/libs/db";




export const recordOpen = async (emailId: string) => {
  try {
    // Ensure the DB is connected
    await connectDb();

    // Find and update the email
    const updatedEmail = await Email.findByIdAndUpdate(
      emailId,
      {
        $inc: { openCount: 1 },
        $set: { lastOpened: new Date() }
      },
      { new: true }
    );

    // Log the result for debugging
    if (!updatedEmail) {
      console.error(`Email not found for ID: ${emailId}`);
      return false; // Return false if email wasn't found
    }

    // If the email has a campaign, update the campaign
    if (updatedEmail.campaign) {
      const updatedCampaign = await Campaign.findByIdAndUpdate(updatedEmail.campaign, {
        $inc: { emailsOpened: 1 }
      });

      if (!updatedCampaign) {
        console.error(`Campaign not found for ID: ${updatedEmail.campaign}`);
        return false; // Return false if campaign wasn't found
      }
    }

    return true;
  } catch (error) {
    console.error("Error recording open:", error);
    return false;
  }
};






export const recordClick = async (emailId: string, url: string) => {
  try {
    // Ensure the DB is connected
    await connectDb();

    // Find and update the email
    const updatedEmail = await Email.findByIdAndUpdate(
      emailId,
      {
        $inc: { clickCount: 1 },
        $push: { clickedLinks: { url, timestamp: new Date() } },
        $set: { lastClicked: new Date() }
      },
      { new: true }
    );

    // Log the result for debugging
    if (!updatedEmail) {
      console.error(`Email not found for ID: ${emailId}`);
      return false; // Return false if email wasn't found
    }

    // If the email has a campaign, update the campaign
    if (updatedEmail.campaign) {
      const updatedCampaign = await Campaign.findByIdAndUpdate(updatedEmail.campaign, {
        $inc: { emailsClicked: 1 }
      });

      if (!updatedCampaign) {
        console.error(`Campaign not found for ID: ${updatedEmail.campaign}`);
        return false; // Return false if campaign wasn't found
      }
    }

    return true;
  } catch (error) {
    console.error("Error recording click:", error);
    return false;
  }
};









// export const recordClick = async (emailId: string, url: string) => {
//   try {

//     await connectDb();

//     const updatedEmail = await Email.findByIdAndUpdate(
//       emailId,
//       {
//         $inc: { clickCount: 1 },
//         $push: { clickedLinks: { url, timestamp: new Date() } },
//         $set: { lastClicked: new Date() }
//       },
//       { new: true }
//     );

//     if (updatedEmail?.campaign) {
//       await Campaign.findByIdAndUpdate(updatedEmail.campaign, {
//         $inc: { emailsClicked: 1 }
//       });
//     }

//     return true;
//   } catch (error) {
//     console.error("Error recording click:", error);
//     return false;
//   }
// };