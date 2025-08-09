'use server';

import { db } from '@/shared/libs/database';
import { currentUser } from '@clerk/nextjs/server';

export const getAllEmails = async () => {
  try {
    const user = await currentUser();
    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    const emails = await db.email.findMany({
      where: {
        newsLetterOwnerId: user.id,
      },
      include: {
        campaign: { select: { name: true } },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const formattedEmails = emails.map((email) => {
      const recipients = email.recipients ?? 0; // or define your own logic
      const deliveryRate =
        recipients > 0
          ? parseFloat(
              (((recipients - (email.bounceCount || 0)) / recipients) * 100).toFixed(1)
            )
          : 0;

      return {
        id: email.id,
        subject: email.title,
        previewText: email.title, // optional, populate if your model has it
        campaign: email.campaign?.name || '',
        type: email.emailType || '',
        status: email.status,
        recipients,
        openRate: email.openCount || 0,
        clickRate: email.clickCount || 0,
        deliveryRate,
        sentDate: email.sentAt ? email.sentAt.toISOString().split('T')[0] : '',
      };
    });

    return { success: true, emails: formattedEmails };
  } catch (error) {
    console.error('[GET_ALL_EMAILS_ERROR]', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch emails',
    };
  }
};




export const getEmailById = async (emailId: string) => {
  try {
    const user = await currentUser();
    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    const email = await db.email.findUnique({
      where: { id: emailId },
      include: {
        campaign: { select: { name: true } },
      },
    });

    if (!email || email.newsLetterOwnerId !== user.id) {
      return { success: false, error: 'Email not found or unauthorized access' };
    }

    return { success: true, email };
  } catch (error) {
    console.error('[GET_EMAIL_BY_ID_ERROR]', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch email',
    };
  }
};


export const getEmailByTitle = async ({
  title,
  newsLetterOwnerId,
}: {
  title: string;
  newsLetterOwnerId: string;
}) => {
  try {
    const user = await currentUser();
    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    // Normalize title
    const normalizedTitle = title.trim().toLowerCase();

    // console.log(normalizedTitle, 'normalized title server'  );

    const email = await db.email.findUnique({
      where: {

          title: normalizedTitle,
          newsLetterOwnerId,
      },
      include: {
        campaign: { select: { id: true, name: true } },
      },
    });

    if (!email) {
      return {
        success: false,
        error: `No email found for title "${title}" and owner ID "${user.id}"`,
      };
    }

    return {
      success: true,
      data: {
        id: email.id,
        title: email.title,
        content: email.content,
        campaign: email.campaign,
        emailType: email.emailType,
        status: email.status,
        previewText: email.previewText,
      },
    };
  } catch (error) {
    console.error("[GET_EMAIL_BY_TITLE_ERROR]", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch email",
    };
  }
};
