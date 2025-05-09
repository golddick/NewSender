// "use server";

// import Campaign from "@/models/newsLetterCampaign.model";
// import { connectDb } from "@/shared/libs/db";

// export const getAllCampaignsByOwnerId = async ({ newsLetterOwnerId }: { newsLetterOwnerId: string }) => {
//     try {
//       await connectDb()
//       const campaigns = await Campaign.find({ newsLetterOwnerId })
//       return campaigns.map((campaign) => ({
//         _id: campaign._id.toString(),
//         name: campaign.name,
//         description: campaign.description,
//         category: campaign.category,
//         subscribers: campaign.subscribers || 0,
//         emailsSent: campaign.emailsSent || 0,
//         startDate: campaign.startDate ? campaign.startDate.toISOString() : null,
//         endDate: campaign.endDate ? campaign.endDate.toISOString() : null,
        
        
//       }))
//     } catch (error) {
//       console.error('Error fetching campaigns:', error)
//       return { error: 'Failed to fetch campaigns' }
//     }
//   }





// export const getCampaignById = async ({
//   campaignId,
// }: {
//   campaignId: string;
// }) => {
//   try {
//     await connectDb();

//     const campaign = await Campaign.findById(campaignId).lean();

//     if (!campaign) {
//       return { error: "Campaign not found" };
//     }

//     return campaign;
//   } catch (error) {
//     console.error("Error fetching campaign by ID:", error);
//     return { error: "Failed to load campaign" };
//   }
// };





"use server";

import Campaign from "@/models/newsLetterCampaign.model";
import { connectDb } from "@/shared/libs/db";
import Subscriber from "@/models/subscriber.model";
import Email from "@/models/email.model";
import { Types } from "mongoose";

interface ICampaign {
  _id: Types.ObjectId;
  name: string;
  description: string;
  category: Types.ObjectId;
  subscriberIds?: Types.ObjectId[];
  subscribers?: number;
  emailsSent?: number;
  startDate?: Date;
  endDate?: Date;
}

interface ISubscriber {
  _id: Types.ObjectId;
  email: string;
  name?: string;
  createdAt: Date;
  status: string;
}

interface IEmail {
  _id: Types.ObjectId;
  subject: string;
  sentAt: Date;
  status: string;
}

interface CampaignResponse {
  _id: string;
  name: string;
  description: string;
  category: Types.ObjectId;
  subscribers: {
    _id: string;
    email: string;
    name?: string;
    createdAt: string;
    status: string;
  }[];
  emailsSent: number;
  startDate: string | null;
  endDate: string | null;
  subscriberCount: number;
}

export const getAllCampaignsByOwnerId = async ({ 
  newsLetterOwnerId 
}: { 
  newsLetterOwnerId: string 
}): Promise<CampaignResponse[] | { error: string }> => {
  try {
    await connectDb();
    
    const campaigns = await Campaign.find({ newsLetterOwnerId }).lean<ICampaign[]>();

    console.log("Campaigns: star", campaigns);
    
    const enhancedCampaigns = await Promise.all(
      campaigns.map(async (campaign) => {
        const subscribers = await Subscriber.find({
          category: campaign.category
        }).lean<ISubscriber[]>();

        console.log("Subscribers: star", subscribers);

        return {
          _id: campaign._id.toString(),
          name: campaign.name,
          description: campaign.description,
          category: campaign.category,
          subscribers: subscribers.map(sub => ({
            _id: sub._id.toString(),
            email: sub.email,
            name: sub.name,
            createdAt: sub.createdAt.toISOString(),
            status: sub.status || 'active'
          })),
          emailsSent: campaign.emailsSent || 0,
          startDate: campaign.startDate?.toISOString() || null,
          endDate: campaign.endDate?.toISOString() || null,
          subscriberCount: campaign.subscribers || subscribers.length,
        };

       
      })
    );
    
    return enhancedCampaigns;
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return { error: 'Failed to fetch campaigns' };
  }
};

interface CampaignDetails extends CampaignResponse {
  emails: {
    _id: string;
    subject: string;
    sentAt: string;
    status: string;
  }[];
}

export const getCampaignById = async ({
  campaignId,
}: {
  campaignId: string;
}): Promise<CampaignDetails | { error: string }> => {
  try {
    await connectDb();

    const campaign = await Campaign.findById(campaignId)
    .populate('subscriberIds') 
    .lean<ICampaign>();
    
    if (!campaign) {
      return { error: "Campaign not found" };
    }

    console.log("Campaign mmm race:", campaign);

    const subscribers = await Subscriber.find({
      categoryId: campaign.category
    }).lean<ISubscriber[]>();

    const emails = await Email.find({
      campaignId: campaign._id
    }).lean<IEmail[]>();


    return {
      _id: campaign._id.toString(),
      name: campaign.name,
      description: campaign.description,
      category: campaign.category,
      subscribers: (campaign.subscriberIds || []).map((sub: any) => ({
        _id: sub._id.toString(),
        email: sub.email,
        name: sub.name,
        createdAt: sub.createdAt?.toISOString() || "",
        status: sub.status || "active",
      })),
      emailsSent: emails.length,
      startDate: campaign.startDate?.toISOString() || null,
      endDate: campaign.endDate?.toISOString() || null,
      subscriberCount: campaign.subscribers || (campaign.subscriberIds?.length ?? 0),
      emails: emails.map((email) => ({
        _id: email._id.toString(),
        subject: email.subject,
        sentAt: email.sentAt.toISOString(),
        status: email.status || "sent",
      })),
    };

    // return {
    //   _id: campaign._id.toString(),
    //   name: campaign.name,
    //   description: campaign.description,
    //   category: campaign.category,
    //   subscribers: subscribers.map(sub => ({
    //     _id: sub._id.toString(),
    //     email: sub.email,
    //     name: sub.name,
    //     createdAt: sub.createdAt.toISOString(),
    //     status: sub.status || 'active'
    //   })),
    //   emailsSent: emails.length,
    //   startDate: campaign.startDate?.toISOString() || null,
    //   endDate: campaign.endDate?.toISOString() || null,
    //   subscriberCount: campaign.subscribers || subscribers.length,
    //   emails: emails.map(email => ({
    //     _id: email._id.toString(),
    //     subject: email.subject,
    //     sentAt: email.sentAt.toISOString(),
    //     status: email.status || 'sent'
    //   }))
    // };
  } catch (error) {
    console.error("Error fetching campaign by ID:", error);
    return { error: "Failed to load campaign" };
  }
};