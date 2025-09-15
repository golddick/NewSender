



// lib/trackingService.ts
import { db } from "@/shared/libs/database";

/**
 * Record email open event.
 * Handles optional campaignId and integrationId.
 */
export const recordOpen = async (
  emailId: string,
  recipientEmail: string
): Promise<boolean> => {
  try {
    const email = await db.email.findUnique({
      where: { id: emailId },
      select: {
        id: true,
        openedByEmails: true,
        openCount: true,
        campaignId: true,
        integrationId: true,
      },
    });

    if (!email) {
      console.error(`Email not found for ID: ${emailId}`);
      return false;
    }

    const alreadyOpened = email.openedByEmails.includes(recipientEmail);

    // Update lastOpened timestamp even for repeated opens
    if (alreadyOpened) {
      await db.email.update({
        where: { id: emailId },
        data: { lastOpened: new Date() },
      });
      return false;
    }

    const updates: any[] = [
      db.email.update({
        where: { id: emailId },
        data: {
          openCount: { increment: 1 },
          lastOpened: new Date(),
          openedByEmails: { set: [...email.openedByEmails, recipientEmail] },
        },
      }),
    ];

    if (email.campaignId) {
      updates.push(
        db.campaign.update({
          where: { id: email.campaignId },
          data: { openRate: { increment: 1 } },
        })
      );
    }

   

    await db.$transaction(updates);

    return true;
  } catch (error) {
    console.error("Error recording open:", error);
    return false;
  }
};

/**
 * Record a click event for an email and update related campaign stats
 */
export async function recordClick(emailId: string, url: string, recipientEmail: string) {
  return db.$transaction(async (tx) => {
    // Fetch the email first
    const email = await tx.email.findUnique({
      where: { id: emailId },
    });

    if (!email) {
      throw new Error("Email not found");
    }
    if (!url) {
      throw new Error("url not found");
    }

    // 1. Update the email with new click info
    await tx.email.update({
      where: { id: emailId },
      data: {
        clickCount: { increment: 1 },
        lastClicked: new Date(),
        clickedByEmails: {
          set: [...(email.clickedByEmails || []), recipientEmail],
        },
      },
    });

    // 2. Log the clicked link
    await tx.clickedLink.create({
      data: {
        emailId,
        url,
        clickedBy: recipientEmail,
      },
    });

    // 3. If email belongs to a campaign → update its clickRate
    if (email.campaignId) {
      await tx.campaign.update({
        where: { id: email.campaignId },
        data: {
          clickRate: { increment: 1 },
        },
      });
    }

    return { success: true };
  });
}










// export const recordClick = async (
//   emailId: string,
//   url: string,
//   recipientEmail: string
// ): Promise<boolean> => {
//   try {
//     const email = await db.email.findUnique({
//       where: { id: emailId },
//       select: {
//         id: true,
//         clickCount: true,
//         clickedByEmails: true,
//         campaignId: true,
//         integrationId: true,
//       },
//     });

//     if (!email) {
//       console.error(`Email not found: ${emailId}`);
//       return false;
//     }

//     // Prevent counting multiple clicks from the same recipient
//     if (email.clickedByEmails.includes(recipientEmail)) {
//       return false;
//     }

//     const updates: any[] = [
//       db.email.update({
//         where: { id: emailId },
//         data: {
//           clickCount: { increment: 1 },
//           lastClicked: new Date(),
//           clickedByEmails: {
//             set: [...email.clickedByEmails, recipientEmail],
//           },
//         },
//       }),
//       db.clickedLink.create({
//         data: { emailId, url , clickedBy: recipientEmail },
//       }),
//     ];

    // if (email.campaignId) {
    //   updates.push(
    //     db.campaign.update({
    //       where: { id: email.campaignId },
    //       data: { clickRate: { increment: 1 } },
    //     })
    //   );
    // }


//     await db.$transaction(updates);

//     return true;
//   } catch (error) {
//     console.error("Error in recordClick:", error);
//     return false;
//   }
// };
