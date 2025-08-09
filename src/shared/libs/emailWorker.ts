// // lib/emailWorker.ts

// import { getSubscribers,getSubscribersByIntegration } from "@/actions/subscriber/get.subscribers";
// import { sendEmail } from "../utils/email.sender";
// import { db } from "./database";


// export async function processScheduledEmails() {


//   const now = new Date();
  
//   // Find emails that are scheduled and should be sent now
//   const emailsToSend = await db.email.findMany({
//     where: {
//       emailType: 'SCHEDULE',
//       status: 'PENDING',
//       scheduleDate: {
//         lte: now // Check if the date is today or earlier
//       }
//     },
//     }
//   });

//   for (const email of emailsToSend) {
//     try {
//       // Check if the scheduled time has passed
//       if (email.scheduleTime) {
//         const [hours, minutes] = email.scheduleTime.split(':').map(Number);
//         const scheduledDateTime = new Date(email.scheduleTime);
//         scheduledDateTime.setHours(hours, minutes, 0, 0);
        
//         if (scheduledDateTime > now) {
//           // Not time yet, skip this email
//           continue;
//         }
//       }

//       // Send the email
//       await sendEmail({
//       userEmail: await getSubscribersForEmail(email),
//       subject: email.emailSubject || email.title,
//       content: email.textContent || '',
//       contentJson: JSON.stringify(email.content),
//       emailId: email.id,
//       newsLetterOwnerId: email.newsLetterOwnerId,
//       integrationId : email.integrationId || null,
//       campaign: email.campaignId || null,
//       adminEmail: email.user?.email || "",
//       fromApplication: email.integration?.name || "TheNews",
//       });

//       // Update status
//       await db.email.update({
//         where: { id: email.id },
//         data: { 
//           status: 'SENT',
//           scheduleDate: null,
//           scheduleTime: null
//         }
//       });
//     } catch (error) {
//       await db.email.update({
//         where: { id: email.id },
//         data: { status: 'FAILED' }
//       });
//       console.error(`Failed to send scheduled email ${email.id}:`, error);
//     }
//   }
// }

// async function getSubscribersForEmail(email: any) {
//   if (email.integrationId && email.campaignId) {
//     // Get subscribers from integration/campaign
//     const result = await getSubscribersByIntegration({
//       integrationId: email.integrationId,
//       campaign: email.campaignId,
//       ownerId: email.newsLetterOwnerId
//     });
//     return result.subscribers?.map((s: any) => s.email) || [];
//   } else {
//     // Get all subscribers for owner
//     const result = await getSubscribers();
//     return result.subscribers?.map((s: any) => s.email) || [];
//   }
// }



// lib/emailWorker.ts
import { getSubscribers } from "@/actions/subscriber/get.subscribers";
import { sendEmail } from "../utils/email.sender";
import { db } from "./database";

export async function processScheduledEmails() {
  const now = new Date();

  // Find emails that are scheduled and should be sent now
  const emailsToSend = await db.email.findMany({
    where: {
      emailType: "SCHEDULE",
      status: "PENDING",
      scheduleDate: {
        lte: now, // Check if the date is today or earlier
      },
    },
    include: {
      user: true, // So we can get adminEmail
    },
  });

  for (const email of emailsToSend) {
    try {
      // Check if the scheduled time has passed
      if (email.scheduleTime) {
        const [hours, minutes] = email.scheduleTime.split(":").map(Number);
        const scheduledDateTime = new Date(email.scheduleDate || now);
        scheduledDateTime.setHours(hours, minutes, 0, 0);

        if (scheduledDateTime > now) {
          // Not time yet, skip this email
          continue;
        }
      }

      // Send the email
      await sendEmail({
        userEmail: await getSubscribersForEmail(email),
        subject: email.emailSubject || email.title,
        content: email.textContent || "",
        contentJson: JSON.stringify(email.content),
        emailId: email.id,
        newsLetterOwnerId: email.newsLetterOwnerId,
        campaign: email.campaignId || null,
        adminEmail: email.user?.email || "",
        fromApplication: "TheNews", // No integration name fallback
      });

      // Update status
      await db.email.update({
        where: { id: email.id },
        data: {
          status: "SENT",
          scheduleDate: null,
          scheduleTime: null,
        },
      });
    } catch (error) {
      await db.email.update({
        where: { id: email.id },
        data: { status: "FAILED" },
      });
      console.error(`Failed to send scheduled email ${email.id}:`, error);
    }
  }
}

async function getSubscribersForEmail(email: any) {
  // Always fetch subscribers directly
  // const result = await getSubscribers({
  // });
  const result = await getSubscribers();

  return result.subscribers?.map((s: any) => s.email) || [];
}
