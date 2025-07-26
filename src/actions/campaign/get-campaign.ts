// app/actions/campaign.ts
"use server";

import { db } from "@/shared/libs/database";
import { currentUser } from "@clerk/nextjs/server";
import Campaign from "@/models/newsLetterCampaign.model";
import Subscriber from "@/models/subscriber.model";
import { Types } from "mongoose";



export async function getCampaignsByCreatorId(userId: string) {
  try {
    const campaigns = await db.campaign.findMany({
      where: {
        userId,
        status: 'ACTIVE'
      },
      include: {
        integration: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return campaigns.map(campaign => ({
      id: campaign.id,
      name: campaign.name,
      description: campaign.description,
      integration: campaign.integration,
      createdAt: campaign.createdAt,
      updatedAt: campaign.updatedAt
    }));
  } catch (error) {
    console.error("Error fetching campaigns by creator:", error);
    return null;
  }
}


export async function getCampaignsByIntegrationName(integrationName: string) {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized", data: null };
  }

  try {
    // First: Get the integration by name
    const integration = await db.integration.findFirst({
      where: {
        name: integrationName
      },
      select: {
        id: true,
        name: true,
        logo: true,
        url: true,
        status: true
      }
    });

    if (!integration) {
      return { error: "Integration not found", data: null };
    }

    // Second: Get all campaigns linked to that integration
    const campaigns = await db.campaign.findMany({
      where: {
        integrationId: integration.id
      }
    });

    const formattedCampaigns = campaigns.map(campaign => {
      const deliveryRate = campaign.emailsSent > 0 ? 98.5 : 0;
      const bounceRate = campaign.emailsSent > 0 ? 1.2 : 0;
      const unsubscribeRate = campaign.emailsSent > 0 ? 0.3 : 0;
      const avgTimeToOpen = campaign.emailsSent > 0 ? "2h 15m" : "N/A";

      return {
        id: campaign.id,
        name: campaign.name,
        description: campaign.description ?? "",
        trigger: campaign.trigger,
        status: campaign.status,
        sentCount: campaign.emailsSent,
        openRate: campaign.openRate,
        clickRate: campaign.clickRate,
        createdAt: campaign.createdAt.toISOString(),
        updatedAt: campaign.updatedAt.toISOString(),
        lastSent: campaign.updatedAt.toISOString(),
        deliveryRate,
        bounceRate,
        unsubscribeRate,
        avgTimeToOpen,
      };
    });

    return {
      error: null,
      data: {
        integration: {
          id: integration.id,
          name: integration.name,
          logo: integration.logo,
          url: integration.url,
          status: integration.status
        },
        campaigns: formattedCampaigns
      }
    };
  } catch (error) {
    console.error("Error fetching integration and campaigns:", error);
    return { error: "Failed to fetch campaigns", data: null };
  }
}



export async function getCampaignsByIntegration(integrationId: string) {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  if (!integrationId) {
    return { error: "Missing integration ID" };
  }

  try {
    const integration = await db.integration.findFirst({
      where: { id: integrationId },
      select: {
        id: true,
        name: true,
        logo: true,
        url: true,
        status: true,
      },
    });

    if (!integration) {
      return { error: "Integration not found" };
    }

    const campaigns = await db.campaign.findMany({
      where: {
        integrationId: integration.id,
        userId: user.id,
        status: "ACTIVE",
      },
    });

    // Get total subscribers per campaign
    const formattedCampaigns = await Promise.all(
      campaigns.map(async (campaign) => {
        const totalSubscribers = await db.subscriber.count({
          where: {
            integrationId: integration.id,
            campaignId: campaign.id,
            newsLetterOwnerId: user.id,
          },
        });

        const sentCount = campaign.emailsSent || 0;
        const openRate = campaign.openRate || 0;
        const deliveryRate = openRate > 0 ? 98.5 : 0;
        const bounceRate = sentCount > 0 ? 1.2 : 0;
        const unsubscribeRate = sentCount > 0 ? 0.3 : 0;
        const avgTimeToOpen = openRate > 0 ? "2h 15m" : "N/A";

       const subscriberRate =
        totalSubscribers > 0
          ? parseFloat(
              (Math.min(sentCount, totalSubscribers) / totalSubscribers * 100).toFixed(1)
            )
          : 0;

        return {
          id: campaign.id,
          name: campaign.name,
          description: campaign.description ?? "",
          trigger: campaign.trigger,
          status: campaign.status,
          sentCount,
          openRate: campaign.openRate,
          clickRate: campaign.clickRate,
          createdAt: campaign.createdAt.toISOString(),
          updatedAt: campaign.updatedAt.toISOString(),
          lastSent: campaign.updatedAt.toISOString(),
          deliveryRate,
          bounceRate,
          unsubscribeRate,
          avgTimeToOpen,
          totalSubscribers,
          subscriberRate,
        };
      })
    );

    return {
      error: null,
      data: {
        integration,
        campaigns: formattedCampaigns,
      },
    };
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    return { error: "Failed to fetch campaigns" };
  }
}


export async function updateCampaignStatus(campaignId: string, status: "ACTIVE" | "INACTIVE") {
  const user = await currentUser()
  if (!user) {
    return { error: "Unauthorized" }
  }

  try {
    const updatedCampaign = await db.campaign.update({
      where: {
        id: campaignId,
        userId: user.id
      },
      data: {
        status
      }
    })

    return { data: updatedCampaign }
  } catch (error) {
    console.error("Error updating campaign status:", error)
    return { error: "Failed to update campaign status" }
  }
}


export async function getCampaignsByIntegrationId(integrationId: string) {
  try {
    const campaigns = await db.campaign.findMany({
      where: { integrationId },
      select: { id: true, name: true },
    });

    return { data: campaigns };
  } catch (error) {
    return { error: "Failed to fetch campaigns" };
  }
}


export async function getCampaignById(campaignId: string) {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  if (!campaignId) {
    return { error: "Missing campaign ID" };
  }

  try {
    const campaign = await db.campaign.findFirst({
      where: {
        id: campaignId,
        userId: user.id,
      },
      include: {
        integration: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        emails: {
          where: {
            // status: "SAVED",
            campaignId: campaignId,
          },
          select: {
            id: true,
            content: true,
            textContent: true,
            emailSubject: true,
            title: true,
            template: true,
            sentAt: true,
            trackOpens: true,
            trackClicks: true,
            enableUnsubscribe: true,
            emailType: true
          }
        },
        _count: {
          select: {
            subscribers: {
              where: {
                status: "Subscribed"
              }
            }
          }
        }
      },
    });

    if (!campaign) {
      return { error: "Campaign not found" };
    }

    const savedEmail = campaign.emails[0] || null;
    const totalSubscribers = campaign._count.subscribers || 0;
    const sentCount = campaign.emailsSent || 0;
    const totalEmailCount = campaign.emails.length || campaign.emailsSent || 0;
    const deliveryRate = sentCount > 0 ? 98.5 : 0;
    const bounceRate = sentCount > 0 ? 1.2 : 0;
    const unsubscribeRate = sentCount > 0 ? 0.3 : 0;
    const avgTimeToOpen = sentCount > 0 ? "2h 15m" : "N/A";
    const subscriberRate =
    totalSubscribers > 0
    ? parseFloat(
        (Math.min(sentCount, totalSubscribers) / totalSubscribers * 100).toFixed(1)
      )
    : 0;

    const formattedCampaign = {
      id: campaign.id,
      name: campaign.name,
      description: campaign.description || " ",
      trigger: campaign.trigger,
      status: campaign.status,
      sentCount,
      openRate: campaign.openRate || 0,
      clickRate: campaign.clickRate || 0,
      lastSent: campaign.lastSentAt?.toISOString(),
      createdAt: campaign.createdAt.toISOString(),
      updatedAt: campaign.updatedAt.toISOString(),
      template: savedEmail?.template || " ",
      deliveryRate,
      bounceRate,
      unsubscribeRate,
      avgTimeToOpen,
      emailID: savedEmail?.id || null,
      emailSubject:   savedEmail?.emailSubject || " ",
      emailContent: savedEmail?.content || '',
      textContent: savedEmail?.textContent || '',
      totalSubscribers,
      subscriberRate,
      totalEmails: totalEmailCount,
      emailSettings: {
        trackOpens: savedEmail?.trackOpens ?? true,
        trackClicks: savedEmail?.trackClicks ?? true,
        enableUnsubscribe: savedEmail?.enableUnsubscribe ?? true,
        emailType: savedEmail?.emailType || " ",
        
      }
    };

    return {
      error: null,
      data: formattedCampaign,
    };
  } catch (error) {
    console.error("Error fetching campaign:", error);
    return { error: "Failed to fetch campaign" };
  }
}

const defaultWelcomeTemplate = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Welcome to TheNews</title>
  </head>
  <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: #000; color: #fff; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
      <h1 style="margin: 0; color: #EAB308;">Welcome to TheNews! 🎉</h1>
      <p style="margin: 10px 0 0 0; color: #ccc;">We're excited to have you on board</p>
    </div>
    
    <div style="background: #fff; padding: 30px; border: 1px solid #eee; border-top: none;">
      <h2 style="color: #000; margin-top: 0;">Hi there!</h2>
      
      <p>Thank you for subscribing to our newsletter. We're thrilled to welcome you to our community of newsletter enthusiasts!</p>
      
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #EAB308; margin-top: 0;">What to expect:</h3>
        <ul style="margin: 0; padding-left: 20px;">
          <li>Weekly industry insights and trends</li>
          <li>Expert tips for newsletter marketing</li>
          <li>Exclusive templates and resources</li>
          <li>Platform updates and new features</li>
        </ul>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="#" style="background: #EAB308; color: #000; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Get Started Now</a>
      </div>
      
      <p>If you have any questions, feel free to reply to this email or contact our support team.</p>
      
      <p>Best regards,<br>The TheNews Team</p>
    </div>
    
    <div style="background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; color: #666;">
      <p>You received this email because you subscribed to our newsletter.</p>
      <p><a href="#" style="color: #EAB308;">Unsubscribe</a> | <a href="#" style="color: #EAB308;">Update Preferences</a></p>
    </div>
  </body>
</html>`;

const defaultWelcomeText = `Welcome to TheNews! 🎉

Hi there!

Thank you for subscribing to our newsletter. We're thrilled to welcome you to our community of newsletter enthusiasts!

What to expect:
- Weekly industry insights and trends
- Expert tips for newsletter marketing
- Exclusive templates and resources
- Platform updates and new features

Get started: [Link]

If you have any questions, feel free to reply to this email or contact our support team.

Best regards,
The TheNews Team

You received this email because you subscribed to our newsletter.
Unsubscribe: [Link] | Update Preferences: [Link]`;
