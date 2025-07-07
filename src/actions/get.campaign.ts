// "use server";

// import Campaign from "@/models/newsLetterCampaign.model";
// import { connectDb } from "@/shared/libs/db";
// import Subscriber from "@/models/subscriber.model";
// import Email from "@/models/email.model";
// import { Types } from "mongoose";

// // Interfaces
// interface ICampaign {
//   _id: Types.ObjectId;
//   name: string;
//   description: string;
//   category: Types.ObjectId;
//   subscriberIds?: Types.ObjectId[];
//   subscribers?: number;
//   emailsSent?: number;
//   startDate?: Date;
//   endDate?: Date;
// }

// interface ISubscriber {
//   _id: Types.ObjectId;
//   email: string;
//   source?: string;
//   createdAt: Date;
//   status: string;
// }

// interface IEmail {
//   _id: Types.ObjectId;
//   title: string;
//   sentAt: Date;
//   createdAt: Date;
//   status: string;
//   openCount:number;
//   clickCount:number;
// }

// interface CampaignResponse {
//   _id: string;
//   name: string;
//   description: string;
//   category: Types.ObjectId;
//   subscribers: {
//     _id: string;
//     email: string;
//     source?: string;
//     createdAt: string;
//     status: string;
//   }[];
//   emailsSent: number;
//   startDate: string | null;
//   endDate: string | null;
//   subscriberCount: number;
// }

// interface CampaignDetails extends CampaignResponse {
//   emails: {
//     _id: string;
//     subject: string;
//     sentAt: string;
//     status: string;
//   }[];
// }

// // Get all campaigns by owner
// export const getAllCampaignsByOwnerId = async ({
//   newsLetterOwnerId,
// }: {
//   newsLetterOwnerId: string;
// }): Promise<CampaignResponse[] | { error: string }> => {
//   try {
//     await connectDb();

//     const campaigns = await Campaign.find({ newsLetterOwnerId }).lean<ICampaign[]>();

//     const enhancedCampaigns = await Promise.all(
//       campaigns.map(async (campaign) => {
//         const subscribers = await Subscriber.find({
//           category: campaign.category,
//         }).lean<ISubscriber[]>();

//         return {
//           _id: campaign._id.toString(),
//           name: campaign.name,
//           description: campaign.description,
//           category: campaign.category,
//           subscribers: subscribers.map((sub) => ({
//             _id: sub._id.toString(),
//             email: sub.email,
//             source: sub.source || "unknown",
//             createdAt: sub.createdAt.toISOString(),
//             status: sub.status || "active",
//           })),
//           emailsSent: campaign.emailsSent || 0,
//           startDate: campaign.startDate?.toISOString() || null,
//           endDate: campaign.endDate?.toISOString() || null,
//           subscriberCount: campaign.subscribers || subscribers.length,
//         };
//       })
//     );

//     return enhancedCampaigns;
//   } catch (error) {
//     console.error("Error fetching campaigns:", error);
//     return { error: "Failed to fetch campaigns" };
//   }
// };





// // Get a single campaign by ID
// export const getCampaignById = async ({
//   campaignId,
// }: {
//   campaignId: string;
// }): Promise<CampaignDetails | { error: string }> => {
//   try {
//     await connectDb();

//     const campaign = await Campaign.findById(campaignId)
//       .populate("subscriberIds")
//       .lean<ICampaign | null>();

//       console.log(campaign, 'server camp')


//     if (!campaign) {
//       return { error: "Campaign not found" };
//     }

//     const emails = await Email.find({ campaign: campaign._id }).lean<IEmail[]>();

    

//     console.log(emails, 'server emails')

//     const subscribers =
//       (campaign.subscriberIds || []).map((sub: any) => ({
//         _id: sub._id?.toString(),
//         email: sub.email,
//         source: sub.source || "unknown",
//         createdAt: sub.createdAt?.toISOString() || "",
//         status: sub.status || "active",
//       })) || [];

//     // return {
//     //   _id: campaign._id.toString(),
//     //   name: campaign.name,
//     //   description: campaign.description,
//     //   category: campaign.category || null,
//     //   subscribers,
//     //   emailsSent: emails.length,
//     //   startDate: campaign.startDate?.toISOString() || null,
//     //   endDate: campaign.endDate?.toISOString() || null,
//     //   subscriberCount: subscribers.length,
//     //   emails: emails.map((email) => ({

//     //     _id: email._id.toString(),
//     //     subject: email.title || "No Subject",
//     //     sentAt: email.createdAt?.toISOString() || "",
//     //     status: email.status || "sent",
//     //   })),

//     return {
//       _id: campaign._id.toString(),
//       name: campaign.name,
//       description: campaign.description,
//       category: campaign.category || null,
//       subscribers,
//       emailsSent: emails.length,
//       startDate: campaign.startDate?.toISOString() || null,
//       endDate: campaign.endDate?.toISOString() || null,
//       subscriberCount: subscribers.length,
//       emails: emails.map((email) => {
//         const totalSubscribers = subscribers.length || 1; // Prevent division by zero
//         const openRate = totalSubscribers
//         ? Math.min(100, parseFloat(((email.openCount / totalSubscribers) * 100).toFixed(2)))
//         : 0;
      
//       const clickRate = totalSubscribers
//         ? Math.min(100, parseFloat(((email.clickCount / totalSubscribers) * 100).toFixed(2)))
//         : 0;
      
//         return {
//           _id: email._id.toString(),
//           subject: email.title || "No Subject",
//           sentAt: email.createdAt?.toISOString() || "",
//           status: email.status || "sent",
//           openRate,
//           clickRate
//         };
//       }),
//     };
    
    
//   } catch (error) {
//     console.error("Error fetching campaign by ID:", error);
//     return { error: "Failed to load campaign" };
//   }
// };


