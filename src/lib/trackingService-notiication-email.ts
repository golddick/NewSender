// // lib/trackingService.ts
// import { db } from "@/shared/libs/database";

// type NotificationMetadata = {
//   lastOpenedBy?: string;
//   lastOpenedAt?: string;
//   lastClickedBy?: string;
//   lastClickedAt?: string;
//   clickedUrls?: Record<string, number>;
//   [key: string]: any;
// };

// /**
//  * Record email open event for a notification
//  */
// export const recordOpen = async (notificationId: string, recipientEmail: string): Promise<boolean> => {
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

//     await db.newsletterOwnerNotification.update({
//       where: { id: notificationId },
//       data: {
//         ...(alreadyOpened ? {} : { openCount: { increment: 1 }, openedByEmails: { push: recipientEmail } }),
//         lastOpened: new Date(),
//         read: true,
//         metadata: {
//           ...currentMetadata,
//           lastOpenedBy: recipientEmail,
//           lastOpenedAt: new Date().toISOString(),
//         },
//       },
//     });

//     return !alreadyOpened;
//   } catch (error) {
//     console.error("Error recording open:", error);
//     return false;
//   }
// };

// /**
//  * Record email click event for a notification
//  */
// export const recordClick = async (notificationId: string, url: string, recipientEmail: string): Promise<boolean> => {
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

//     const alreadyClicked = notification.clickedByEmails.includes(recipientEmail);
//     const currentMetadata = (notification.metadata || {}) as NotificationMetadata;
//     const clickedUrls = currentMetadata.clickedUrls || {};

//     // Track number of clicks per URL
//     clickedUrls[url] = (clickedUrls[url] || 0) + 1;

//     await db.$transaction([
//       db.newsletterOwnerNotification.update({
//         where: { id: notificationId },
//         data: {
//           ...(alreadyClicked ? {} : { clickCount: { increment: 1 }, clickedByEmails: { push: recipientEmail } }),
//           lastClicked: new Date(),
//           read: true,
//           metadata: {
//             ...currentMetadata,
//             lastClickedBy: recipientEmail,
//             lastClickedAt: new Date().toISOString(),
//             clickedUrls,
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

//     return !alreadyClicked;
//   } catch (error) {
//     console.error("Error in recordClick:", error);
//     return false;
//   }
// };




// lib/trackingService.ts
import { db } from "@/shared/libs/database";

/**
 * Record open event for a newsletter notification email
 */
export const NotificationEmailrecordOpen = async (
  notificationId: string,
  recipientEmail: string,
  trackingId: string
): Promise<boolean> => {
  try {
    const notification = await db.newsletterOwnerNotification.findUnique({
      where: { id: notificationId },
      select: {
        id: true,
        openedByEmails: true,
        openCount: true,
        integrationId: true,
        metadata: true,
      },
    });

    if (!notification) {
      console.error(`Notification not found for ID: ${notificationId}`);
      return false;
    }

    const alreadyOpened = notification.openedByEmails.includes(recipientEmail);
    const currentMetadata = (notification.metadata || {}) as Record<string, any>;

    const updatedMetadata = {
      ...currentMetadata,
      lastOpenedBy: recipientEmail,
      lastOpenedAt: new Date().toISOString(),
      ...(trackingId && { trackingId }),
    };

    if (alreadyOpened) {
      // Update timestamp, read flag, and metadata even for repeated opens
      await db.newsletterOwnerNotification.update({
        where: { id: notificationId },
        data: {
          lastOpened: new Date(),
          read: true,
          metadata: updatedMetadata,
        },
      });
      return false;
    }

    const updates: any[] = [
      db.newsletterOwnerNotification.update({
        where: { id: notificationId },
        data: {
          openCount: { increment: 1 },
          lastOpened: new Date(),
          read: true,
          openedByEmails: { set: [...notification.openedByEmails, recipientEmail] },
          metadata: updatedMetadata,
        },
      }),
    ];

    if (notification.integrationId) {
      updates.push(
        db.integration.update({
          where: { id: notification.integrationId },
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
 * Record click event for a newsletter notification email
 */
export const NotificationEmailrecordClick = async (
  notificationId: string,
  url: string,
  recipientEmail: string,
  trackingId: string
): Promise<boolean> => {
  try {
    const notification = await db.newsletterOwnerNotification.findUnique({
      where: { id: notificationId },
      select: {
        id: true,
        clickCount: true,
        clickedByEmails: true,
        integrationId: true,
        metadata: true,
      },
    });

    if (!notification) {
      console.error(`Notification not found: ${notificationId}`);
      return false;
    }

    const alreadyClicked = notification.clickedByEmails.includes(recipientEmail);
    const currentMetadata = (notification.metadata || {}) as Record<string, any>;

    const updatedMetadata = {
      ...currentMetadata,
      lastClickedBy: recipientEmail,
      lastClickedAt: new Date().toISOString(),
      ...(trackingId && { trackingId }),
    };

    if (alreadyClicked) {
      // Update timestamp, metadata, and read flag even for repeated clicks
      await db.newsletterOwnerNotification.update({
        where: { id: notificationId },
        data: {
          lastClicked: new Date(),
          read: true,
          metadata: updatedMetadata,
        },
      });
      return false;
    }

    const updates: any[] = [
      db.newsletterOwnerNotification.update({
        where: { id: notificationId },
        data: {
          clickCount: { increment: 1 },
          lastClicked: new Date(),
          read: true,
          clickedByEmails: { set: [...notification.clickedByEmails, recipientEmail] },
          metadata: updatedMetadata,
        },
      }),
      db.notificationEmailClickedLink.create({
        data: {
          notificationEmailId: notificationId,
          url,
          clickedBy: recipientEmail,
          clickedAt: new Date(),
        },
      }),
    ];

    if (notification.integrationId) {
      updates.push(
        db.integration.update({
          where: { id: notification.integrationId },
          data: { clickRate: { increment: 1 } },
        })
      );
    }

    await db.$transaction(updates);
    return true;
  } catch (error) {
    console.error("Error in recordClick:", error);
    return false;
  }
};
