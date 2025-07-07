// lib/trackingService.ts
import { db } from "@/shared/libs/database";

export const recordOpen = async (emailId: string, ip: string): Promise<boolean> => {
  try {
    const email = await db.email.findUnique({
      where: { id: emailId },
      select: {
        id: true,
        openedByIps: true,
        openCount: true,
        campaignId: true,
        integrationId: true,
      },
    });

    if (!email) {
      console.error(`Email not found for ID: ${emailId}`);
      return false;
    }

    // Avoid duplicate opens from same IP
    if (email.openedByIps.includes(ip)) {
      return false;
    }

    await db.$transaction([
      // Update email open tracking
      db.email.update({
        where: { id: emailId },
        data: {
          openCount: { increment: 1 },
          lastOpened: new Date(),
          openedByIps: { set: [...email.openedByIps, ip] },
        },
      }),

      // Update campaign open rate
      ...(email.campaignId
        ? [
            db.campaign.update({
              where: { id: email.campaignId },
              data: {
                openRate: { increment: 1 },
              },
            }),
          ]
        : []),

      // Update integration open rate
      ...(email.integrationId
        ? [
            db.integration.update({
              where: { id: email.integrationId },
              data: {
                openRate: { increment: 1 },
              },
            }),
          ]
        : []),
    ]);

    return true;
  } catch (error) {
    console.error("Error recording open:", error);
    return false;
  }
};





export const recordClick = async (emailId: string, url: string, ip: string): Promise<boolean> => {
  try {
    // Fetch the email record
    const email = await db.email.findUnique({
      where: { id: emailId },
      select: {
        id: true,
        clickCount: true,
        clickedByIps: true,
        campaignId: true,
        integrationId: true,
      }
    });

    if (!email) {
      console.error(`Email not found: ${emailId}`);
      return false;
    }

    // Avoid counting multiple clicks from the same IP
    if (email.clickedByIps.includes(ip)) {
      return false;
    }

    // Track the clicked link
    await db.$transaction([
      // Update the email record
      db.email.update({
        where: { id: emailId },
        data: {
          clickCount: { increment: 1 },
          lastClicked: new Date(),
          clickedByIps: {
            set: [...email.clickedByIps, ip]
          },
        }
      }),

      // Record clicked link
      db.clickedLink.create({
        data: {
          emailId,
          url,
        }
      }),

      // Update campaign if applicable
      ...(email.campaignId
        ? [db.campaign.update({
            where: { id: email.campaignId },
            data: {
              clickRate: { increment: 1 }
            }
          })]
        : [])
    ]);

    return true;
  } catch (error) {
    console.error("Error in recordClick:", error);
    return false;
  }
};
