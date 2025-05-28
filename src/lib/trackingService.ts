// lib/trackingService.ts
import Email from "@/models/email.model";
import Campaign from "@/models/newsLetterCampaign.model";
import { connectDb } from "@/shared/libs/db";




// export const recordOpen = async (emailId: string) => {
//   try {
//     // Ensure the DB is connected
//     await connectDb();

//     // Find and update the email
//     const updatedEmail = await Email.findByIdAndUpdate(
//       emailId,
//       {
//         $inc: { openCount: 1 },
//         $set: { lastOpened: new Date() }
//       },
//       { new: true }
//     );

//     // Log the result for debugging
//     if (!updatedEmail) {
//       console.error(`Email not found for ID: ${emailId}`);
//       return false; // Return false if email wasn't found
//     }

//     // If the email has a campaign, update the campaign
//     if (updatedEmail.campaign) {
//       const updatedCampaign = await Campaign.findByIdAndUpdate(updatedEmail.campaign, {
//         $inc: { emailsOpened: 1 }
//       });

//       if (!updatedCampaign) {
//         console.error(`Campaign not found for ID: ${updatedEmail.campaign}`);
//         return false; // Return false if campaign wasn't found
//       }
//     }

//     return true;
//   } catch (error) {
//     console.error("Error recording open:", error);
//     return false;
//   }
// };


export const recordOpen = async (emailId: string, ip: string) => {
  try {
    await connectDb();

    const email = await Email.findById(emailId);
    if (!email) {
      console.error(`Email not found for ID: ${emailId}`);
      return false;
    }

    // Check if this IP has already opened the email
    if (email.openedByIps?.includes(ip)) {
      return false; // Don't increment again
    }

    // Update email open count and lastOpened
    email.openCount += 1;
    email.lastOpened = new Date();
    email.openedByIps = email.openedByIps || [];
    email.openedByIps.push(ip);
    await email.save();

    // Update campaign open count if available
    if (email.campaign) {
      const updatedCampaign = await Campaign.findByIdAndUpdate(email.campaign, {
        $inc: { emailsOpened: 1 },
      });

      if (!updatedCampaign) {
        console.error(`Campaign not found for ID: ${email.campaign}`);
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error("Error recording open:", error);
    return false;
  }
};


export const recordClick = async (emailId: string, url: string, ip: string) => {
  try {
    await connectDb();

    const email = await Email.findById(emailId);
    if (!email) {
      console.error(`Email not found for ID: ${emailId}`);
      return false;
    }

    // Prevent duplicate click tracking from same IP
    if (email.clickedByIps?.includes(ip)) {
      return false;
    }

    // Track click
    email.clickCount += 1;
    email.lastClicked = new Date();
    email.clickedLinks.push({ url, timestamp: new Date() });
    email.clickedByIps = email.clickedByIps || [];
    email.clickedByIps.push(ip);
    await email.save();

    // Update campaign click stats if applicable
    if (email.campaign) {
      const updatedCampaign = await Campaign.findByIdAndUpdate(email.campaign, {
        $inc: { emailsClicked: 1 },
      });

      if (!updatedCampaign) {
        console.error(`Campaign not found for ID: ${email.campaign}`);
        return false;
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
//     // Ensure the DB is connected
//     await connectDb();

//     // Find and update the email
//     const updatedEmail = await Email.findByIdAndUpdate(
//       emailId,
//       {
//         $inc: { clickCount: 1 },
//         $push: { clickedLinks: { url, timestamp: new Date() } },
//         $set: { lastClicked: new Date() }
//       },
//       { new: true }
//     );

//     // Log the result for debugging
//     if (!updatedEmail) {
//       console.error(`Email not found for ID: ${emailId}`);
//       return false; // Return false if email wasn't found
//     }

//     // If the email has a campaign, update the campaign
//     if (updatedEmail.campaign) {
//       const updatedCampaign = await Campaign.findByIdAndUpdate(updatedEmail.campaign, {
//         $inc: { emailsClicked: 1 }
//       });

//       if (!updatedCampaign) {
//         console.error(`Campaign not found for ID: ${updatedEmail.campaign}`);
//         return false; // Return false if campaign wasn't found
//       }
//     }

//     return true;
//   } catch (error) {
//     console.error("Error recording click:", error);
//     return false;
//   }
// };







