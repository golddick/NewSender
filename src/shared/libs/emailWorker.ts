// lib/emailWorker.ts

import { getSubscribers, getSubscribersByIntegration } from "@/actions/subscriber/get.subscribers";
import { sendEmail } from "../utils/email.sender";
import { db } from "./database";


export async function processScheduledEmails() {


  const now = new Date();
  
  // Find emails that are scheduled and should be sent now
  const emailsToSend = await db.email.findMany({
    where: {
      emailType: 'SCHEDULE',
      status: 'PENDING',
      scheduleDate: {
        lte: now // Check if the date is today or earlier
      }
    },
    include: {
      integration: true,
      campaign: true,
      user:{
        select: { email: true }
      }
    }
  });

  for (const email of emailsToSend) {
    try {
      // Check if the scheduled time has passed
      if (email.scheduleTime) {
        const [hours, minutes] = email.scheduleTime.split(':').map(Number);
        const scheduledDateTime = new Date(email.scheduleTime);
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
      content: email.textContent || '',
      contentJson: JSON.stringify(email.content),
      emailId: email.id,
      newsLetterOwnerId: email.newsLetterOwnerId,
      integrationId : email.integrationId || null,
      campaign: email.campaignId || null,
      adminEmail: email.user?.email || "",
      fromApplication: email.integration?.name || "TheNews",
      });

      // Update status
      await db.email.update({
        where: { id: email.id },
        data: { 
          status: 'SENT',
          scheduleDate: null,
          scheduleTime: null
        }
      });
    } catch (error) {
      await db.email.update({
        where: { id: email.id },
        data: { status: 'FAILED' }
      });
      console.error(`Failed to send scheduled email ${email.id}:`, error);
    }
  }
}

async function getSubscribersForEmail(email: any) {
  if (email.integrationId && email.campaignId) {
    // Get subscribers from integration/campaign
    const result = await getSubscribersByIntegration({
      integrationId: email.integrationId,
      campaign: email.campaignId,
      ownerId: email.newsLetterOwnerId
    });
    return result.subscribers?.map((s: any) => s.email) || [];
  } else {
    // Get all subscribers for owner
    const result = await getSubscribers();
    return result.subscribers?.map((s: any) => s.email) || [];
  }
}





// import { getSubscribers, getSubscribersByIntegration } from "@/actions/subscriber/get.subscribers";
// import { sendEmail } from "../utils/email.sender";
// import { db } from "./database";

// // Database connection state
// let isDbConnected = false;

// /**
//  * Verifies database connection and updates connection state
//  */
// export async function verifyDbConnection(): Promise<void> {
//   try {
//     await db.$queryRaw`SELECT 1`;
//     isDbConnected = true;
//     console.log('✅ Database connection verified');
//   } catch (error) {
//     console.error('❌ Database connection error:', error);
//     isDbConnected = false;
//     throw error;
//   }
// }

// interface EmailWithRelations {
//   id: string;
//   emailType: string;
//   status: string;
//   scheduleDate: Date | null;
//   scheduleTime: string | null;
//   emailSubject?: string;
//   title: string;
//   textContent?: string;
//   content: any;
//   newsLetterOwnerId: string;
//   integrationId?: string;
//   campaignId?: string | null;
//   integration?: {
//     name: string;
//   };
//   user?: {
//     email: string;
//   };
// }

// /**
//  * Processes all scheduled emails that are due to be sent
//  */
// export async function processScheduledEmails(): Promise<void> {
//   // Verify database connection first
//   if (!isDbConnected) {
//     await verifyDbConnection();
//     if (!isDbConnected) {
//       throw new Error('Database connection not available');
//     }
//   }

//   const now = new Date();
//   console.log(`[${now.toISOString()}] Starting email processing...`);

//   try {
//     // Find pending scheduled emails
//     const emailsToSend = await db.email.findMany({
//       where: {
//         emailType: 'SCHEDULE',
//         status: 'PENDING',
//         scheduleDate: {
//           lte: now
//         }
//       },
//       include: {
//         integration: true,
//         campaign: true,
//         user: {
//           select: { email: true }
//         }
//       }
//     }) as EmailWithRelations[];

//     console.log(`📨 Found ${emailsToSend.length} emails to process`);

//     // Process each email
//     for (const email of emailsToSend) {
//       try {
//         // Check scheduled time if specified
//         if (email.scheduleTime) {
//           const [hours, minutes] = email.scheduleTime.split(':').map(Number);
//           const scheduledDateTime = new Date(email.scheduleDate || now);
//           scheduledDateTime.setHours(hours, minutes, 0, 0);
          
//           if (scheduledDateTime > now) {
//             console.log(`⏭️ Skipping email ${email.id} - scheduled for future time`);
//             continue;
//           }
//         }

//         // Get recipients
//         const recipients = await getSubscribersForEmail(email);
//         if (recipients.length === 0) {
//           console.log(`👤 No recipients found for email ${email.id}`);
//           await markEmailAsSkipped(email.id);
//           continue;
//         }

//         console.log(`✉️ Sending email ${email.id} to ${recipients.length} recipients`);

//         // Send email
//         await sendEmail({
//           userEmail: recipients,
//           subject: email.emailSubject || email.title,
//           content: email.textContent || '',
//           contentJson: JSON.stringify(email.content),
//           emailId: email.id,
//           newsLetterOwnerId: email.newsLetterOwnerId,
//           integrationId: email.integrationId || null,
//           campaign: email.campaignId || null,
//           adminEmail: email.user?.email || "",
//           fromApplication: email.integration?.name || "TheNews",
//         });

//         // Update status
//         await markEmailAsSent(email.id);
//         console.log(`✅ Successfully sent email ${email.id}`);

//       } catch (error) {
//         console.error(`❌ Failed to process email ${email.id}:`, error);
//         await markEmailAsFailed(email.id, error as Error);
//       }
//     }
//   } catch (error) {
//     console.error('💥 Error in email processing batch:', error);
//     throw error;
//   }
// }

// /**
//  * Marks an email as sent in the database
//  */
// async function markEmailAsSent(emailId: string): Promise<void> {
//   await db.email.update({
//     where: { id: emailId },
//     data: { 
//       status: 'SENT',
//       scheduleDate: null,
//       scheduleTime: null,
//       sentAt: new Date()
//     }
//   });
// }

// /**
//  * Marks an email as failed in the database
//  */
// async function markEmailAsFailed(emailId: string, error: Error): Promise<void> {
//   await db.email.update({
//     where: { id: emailId },
//     data: { 
//       status: 'FAILED',
     
//     }
//   });
// }

// /**
//  * Marks an email as skipped in the database
//  */
// async function markEmailAsSkipped(emailId: string): Promise<void> {
//   await db.email.update({
//     where: { id: emailId },
//     data: { 
//       status: 'PENDING',
//       updatedAt: new Date()
//     }
//   });
// }

// /**
//  * Gets subscribers for a specific email
//  */
// async function getSubscribersForEmail(email: EmailWithRelations): Promise<string[]> {
//   try {
//     if (email.integrationId && email.campaignId) {
//       const result = await getSubscribersByIntegration({
//         integrationId: email.integrationId,
//         campaign: email.campaignId,
//         ownerId: email.newsLetterOwnerId
//       });
//       return result.subscribers?.map(s => s.email) || [];
//     }
    
//     const result = await getSubscribers();
//     return result.subscribers?.map(s => s.email) || [];
//   } catch (error) {
//     console.error('Error fetching subscribers:', error);
//     return [];
//   }
// }

// // Initialize database connection when module loads
// verifyDbConnection().catch(console.error);