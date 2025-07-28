

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
    const email = await db.notificationEmail.findUnique({
      where: { id: emailId },
      select: {
        id: true,
        openedByEmails: true,
        openCount: true,
      },
    });

    if (!email) {
      console.error(`Email not found for ID: ${emailId}`);
      return false;
    }

    const alreadyOpened = email.openedByEmails.includes(recipientEmail);

    // Update lastOpened timestamp even for repeated opens
    if (alreadyOpened) {
      await db.notificationEmail.update({
        where: { id: emailId },
        data: { lastOpened: new Date() },
      });
      return false;
    }

    const updates: any[] = [
      db.notificationEmail.update({
        where: { id: emailId },
        data: {
          openCount: { increment: 1 },
          lastOpened: new Date(),
          openedByEmails: { set: [...email.openedByEmails, recipientEmail] },
        },
      }),
    ];

  

    await db.$transaction(updates);

    return true;
  } catch (error) {
    console.error("Error recording open:", error);
    return false;
  }
};

/**
 * Record email click event.
 * Handles optional campaignId and integrationId.
 */
export const recordClick = async (
  emailId: string,
  url: string,
  recipientEmail: string
): Promise<boolean> => {
  try {
    const email = await db.notificationEmail.findUnique({
      where: { id: emailId },
      select: {
        id: true,
        clickCount: true,
        clickedByEmails: true,
      },
    });

    if (!email) {
      console.error(`Email not found: ${emailId}`);
      return false;
    }

    // Prevent counting multiple clicks from the same recipient
    if (email.clickedByEmails.includes(recipientEmail)) {
      return false;
    }

    const updates: any[] = [
      db.notificationEmail.update({
        where: { id: emailId },
        data: {
          clickCount: { increment: 1 },
          lastClicked: new Date(),
          clickedByEmails: {
            set: [...email.clickedByEmails, recipientEmail],
          },
        },
      }),
      db.notificationEmailClickedLink.create({
        data: { notificationEmailId: emailId, url, clickedBy: recipientEmail },
      }),
    ];

    

    await db.$transaction(updates);

    return true;
  } catch (error) {
    console.error("Error in recordClick:", error);
    return false;
  }
};
