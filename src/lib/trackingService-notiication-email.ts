

// // lib/trackingService.ts
// import { db } from "@/shared/libs/database";

// /**
//  * Record email open event.
//  * Handles optional campaignId and integrationId.
//  */
// export const recordOpen = async (
//   emailId: string,
//   recipientEmail: string
// ): Promise<boolean> => {
//   try {
//     const email = await db.notificationEmail.findUnique({
//       where: { id: emailId },
//       select: {
//         id: true,
//         openedByEmails: true,
//         openCount: true,
//       },
//     });

//     if (!email) {
//       console.error(`Email not found for ID: ${emailId}`);
//       return false;
//     }

//     const alreadyOpened = email.openedByEmails.includes(recipientEmail);

//     // Update lastOpened timestamp even for repeated opens
//     if (alreadyOpened) {
//       await db.notificationEmail.update({
//         where: { id: emailId },
//         data: { lastOpened: new Date() },
//       });
//       return false;
//     }

//     const updates: any[] = [
//       db.notificationEmail.update({
//         where: { id: emailId },
//         data: {
//           openCount: { increment: 1 },
//           lastOpened: new Date(),
//           openedByEmails: { set: [...email.openedByEmails, recipientEmail] },
//         },
//       }),
//     ];

  

//     await db.$transaction(updates);

//     return true;
//   } catch (error) {
//     console.error("Error recording open:", error);
//     return false;
//   }
// };

// /**
//  * Record email click event.
//  * Handles optional campaignId and integrationId.
//  */
// export const recordClick = async (
//   emailId: string,
//   url: string,
//   recipientEmail: string
// ): Promise<boolean> => {
//   try {
//     const email = await db.notificationEmail.findUnique({
//       where: { id: emailId },
//       select: {
//         id: true,
//         clickCount: true,
//         clickedByEmails: true,
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
//       db.notificationEmail.update({
//         where: { id: emailId },
//         data: {
//           clickCount: { increment: 1 },
//           lastClicked: new Date(),
//           clickedByEmails: {
//             set: [...email.clickedByEmails, recipientEmail],
//           },
//         },
//       }),
//       db.notificationEmailClickedLink.create({
//         data: { notificationEmailId: emailId, url, clickedBy: recipientEmail },
//       }),
//     ];

    

//     await db.$transaction(updates);

//     return true;
//   } catch (error) {
//     console.error("Error in recordClick:", error);
//     return false;
//   }
// };


















import { db } from "@/shared/libs/database";
import { Prisma } from "@prisma/client";

type TxClient = Parameters<Parameters<typeof db.$transaction>[0]>[0];

type NotificationMetadata = {
  lastOpenedBy?: string;
  lastOpenedAt?: string;
  lastClickedBy?: string;
  lastClickedAt?: string;
  clickedUrls?: Record<string, any>;
  [key: string]: any;
};

export const recordOpen = async (notificationId: string, recipientEmail: string): Promise<boolean> => {
  try {
    const [newsletter, system] = await Promise.all([
      db.newsletterOwnerNotification.findUnique({
        where: { id: notificationId },
        select: { openedByEmails: true, metadata: true },
      }),
      db.systemNotification.findUnique({
        where: { id: notificationId },
        select: { openedByEmails: true, metadata: true },
      }),
    ]);

    if (!newsletter && !system) {
      console.error(`Notification not found: ${notificationId}`);
      return false;
    }

    await db.$transaction(async (tx) => {
      if (newsletter) {
        await updateNewsletterOpen(tx, notificationId, recipientEmail, newsletter.metadata, newsletter.openedByEmails);
      }
      if (system) {
        await updateSystemOpen(tx, notificationId, recipientEmail, system.metadata, system.openedByEmails);
      }
    });

    return true;
  } catch (error) {
    console.error("Error recording open:", error);
    return false;
  }
};

export const recordClick = async (notificationId: string, url: string, recipientEmail: string): Promise<boolean> => {
  try {
    const [newsletter, system] = await Promise.all([
      db.newsletterOwnerNotification.findUnique({
        where: { id: notificationId },
        select: { clickedByEmails: true, metadata: true },
      }),
      db.systemNotification.findUnique({
        where: { id: notificationId },
        select: { clickedByEmails: true, metadata: true },
      }),
    ]);

    if (!newsletter && !system) {
      console.error(`Notification not found: ${notificationId}`);
      return false;
    }

    await db.$transaction(async (tx) => {
      if (newsletter) {
        await updateNewsletterClick(tx, notificationId, url, recipientEmail, newsletter.metadata, newsletter.clickedByEmails);
      }
      if (system) {
        await updateSystemClick(tx, notificationId, url, recipientEmail, system.metadata, system.clickedByEmails);
      }
    });

    return true;
  } catch (error) {
    console.error("Error recording click:", error);
    return false;
  }
};

/* ---------------------- PRIVATE HELPERS ---------------------- */

const updateNewsletterOpen = async (
  tx: TxClient,
  notificationId: string,
  recipientEmail: string,
  metadata: any,
  openedByEmails: string[]
) => {
  const currentMetadata = (metadata || {}) as NotificationMetadata;
  const alreadyOpened = openedByEmails?.includes(recipientEmail);

  await tx.newsletterOwnerNotification.update({
    where: { id: notificationId },
    data: alreadyOpened
      ? {
          lastOpened: new Date(),
          metadata: { ...currentMetadata, lastOpenedBy: recipientEmail, lastOpenedAt: new Date().toISOString() },
        }
      : {
          openCount: { increment: 1 },
          lastOpened: new Date(),
          openedByEmails: { push: recipientEmail },
          metadata: { ...currentMetadata, lastOpenedBy: recipientEmail, lastOpenedAt: new Date().toISOString() },
        },
  });
};

const updateSystemOpen = async (
  tx: TxClient,
  notificationId: string,
  recipientEmail: string,
  metadata: any,
  openedByEmails: string[]
) => {
  const currentMetadata = (metadata || {}) as NotificationMetadata;
  const alreadyOpened = openedByEmails?.includes(recipientEmail);

  await tx.systemNotification.update({
    where: { id: notificationId },
    data: alreadyOpened
      ? {
          lastOpened: new Date(),
          metadata: { ...currentMetadata, lastOpenedBy: recipientEmail, lastOpenedAt: new Date().toISOString() },
        }
      : {
          openCount: { increment: 1 },
          lastOpened: new Date(),
          openedByEmails: { push: recipientEmail },
          metadata: { ...currentMetadata, lastOpenedBy: recipientEmail, lastOpenedAt: new Date().toISOString() },
        },
  });
};

const updateNewsletterClick = async (
  tx: TxClient,
  notificationId: string,
  url: string,
  recipientEmail: string,
  metadata: any,
  clickedByEmails: string[]
) => {
  const currentMetadata = (metadata || {}) as NotificationMetadata;
  const alreadyClicked = clickedByEmails?.includes(recipientEmail);

  if (alreadyClicked) {
    await tx.newsletterOwnerNotification.update({
      where: { id: notificationId },
      data: {
        lastClicked: new Date(),
        metadata: { ...currentMetadata, lastClickedBy: recipientEmail, lastClickedAt: new Date().toISOString() },
      },
    });
  } else {
    await Promise.all([
      tx.newsletterOwnerNotification.update({
        where: { id: notificationId },
        data: {
          clickCount: { increment: 1 },
          lastClicked: new Date(),
          clickedByEmails: { push: recipientEmail },
          metadata: { ...currentMetadata, lastClickedBy: recipientEmail, lastClickedAt: new Date().toISOString() },
        },
      }),
      tx.notificationEmailClickedLink.create({
        data: { notificationEmailId: notificationId, url, clickedBy: recipientEmail, clickedAt: new Date() },
      }),
    ]);
  }
};

const updateSystemClick = async (
  tx: TxClient,
  notificationId: string,
  url: string,
  recipientEmail: string,
  metadata: any,
  clickedByEmails: string[]
) => {
  const currentMetadata = (metadata || {}) as NotificationMetadata;
  const alreadyClicked = clickedByEmails?.includes(recipientEmail);

  if (alreadyClicked) {
    await tx.systemNotification.update({
      where: { id: notificationId },
      data: {
        lastClicked: new Date(),
        metadata: { ...currentMetadata, lastClickedBy: recipientEmail, lastClickedAt: new Date().toISOString() },
      },
    });
  } else {
    await Promise.all([
      tx.systemNotification.update({
        where: { id: notificationId },
        data: {
          clickCount: { increment: 1 },
          lastClicked: new Date(),
          clickedByEmails: { push: recipientEmail },
          metadata: { ...currentMetadata, lastClickedBy: recipientEmail, lastClickedAt: new Date().toISOString() },
        },
      }),
      tx.notificationEmailClickedLink.create({
        data: { notificationEmailId: notificationId, url, clickedBy: recipientEmail, clickedAt: new Date() },
      }),
    ]);
  }
};













// // lib/trackingService.ts
// import { db } from "@/shared/libs/database";

// type NotificationMetadata = {
//   lastOpenedBy?: string;
//   lastOpenedAt?: string;
//   lastClickedBy?: string;
//   lastClickedAt?: string;
//   [key: string]: any;
// };

// /**
//  * Record email open event for a notification
//  */
// export const recordOpen = async (
//   notificationId: string,
//   recipientEmail: string
// ): Promise<boolean> => {
//   try {
//     const notification = await db.newsletterOwnerNotification.findUnique({
//       where: { id: notificationId },
//       select: {
//         id: true,
//         openedByEmails: true,
//         openCount: true,
//         metadata: true,
//       },
//     });

//     if (!notification) {
//       console.error(`Notification not found for ID: ${notificationId}`);
//       return false;
//     }

//     const alreadyOpened = notification.openedByEmails.includes(recipientEmail);
//     const currentMetadata = (notification.metadata || {}) as NotificationMetadata;

//     // Update lastOpened timestamp even for repeated opens
//     if (alreadyOpened) {
//       await db.newsletterOwnerNotification.update({
//         where: { id: notificationId },
//         data: { 
//           lastOpened: new Date(),
//           metadata: {
//             ...currentMetadata,
//             lastOpenedBy: recipientEmail,
//             lastOpenedAt: new Date().toISOString()
//           }
//         },
//       });
//       return false;
//     }

//     // Update notification with open data
//     await db.newsletterOwnerNotification.update({
//       where: { id: notificationId },
//       data: {
//         openCount: { increment: 1 },
//         lastOpened: new Date(),
//         openedByEmails: { push: recipientEmail },
//         metadata: {
//           ...currentMetadata,
//           lastOpenedBy: recipientEmail,
//           lastOpenedAt: new Date().toISOString()
//         },
//       },
//     });

//     return true;
//   } catch (error) {
//     console.error("Error recording open:", error);
//     return false;
//   }
// };

// /**
//  * Record email click event for a notification
//  */
// export const recordClick = async (
//   notificationId: string,
//   url: string,
//   recipientEmail: string
// ): Promise<boolean> => {
//   try {
//     const notification = await db.newsletterOwnerNotification.findUnique({
//       where: { id: notificationId },
//       select: {
//         id: true,
//         clickCount: true,
//         clickedByEmails: true,
//         metadata: true,
//       },
//     });

//     if (!notification) {
//       console.error(`Notification not found: ${notificationId}`);
//       return false;
//     }

//     // Prevent counting multiple clicks from the same recipient
//     if (notification.clickedByEmails.includes(recipientEmail)) {
//       return false;
//     }

//     const currentMetadata = (notification.metadata || {}) as NotificationMetadata;
//     const clickedUrls = currentMetadata.clickedUrls || {};

//     // Update notification with click data
//     await db.$transaction([
//       db.newsletterOwnerNotification.update({
//         where: { id: notificationId },
//         data: {
//           clickCount: { increment: 1 },
//           lastClicked: new Date(),
//           clickedByEmails: { push: recipientEmail },
//           metadata: {
//             ...currentMetadata,
//             lastClickedBy: recipientEmail,
//             lastClickedAt: new Date().toISOString(),
           
//           },
//         },
//       }),
//       db.notificationEmailClickedLink.create({
//         data: {
//           notificationEmailId: notificationId,
//           url,
//           clickedBy: recipientEmail,
//           clickedAt: new Date(),
//         },
//       }),
//     ]);

//     return true;
//   } catch (error) {
//     console.error("Error in recordClick:", error);
//     return false;
//   }
// };