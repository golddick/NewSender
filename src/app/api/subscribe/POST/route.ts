// // // src/app/api/subscribers/POST/route.ts
// // import { NextRequest, NextResponse } from "next/server";
// // import { connectDb } from "@/shared/libs/db";
// // import Subscriber from "@/models/subscriber.model";
// // import Campaign from "@/models/newsLetterCampaign.model";
// // import { validateEmail } from "@/shared/utils/ZeroBounceApi";
// // import { verifyApiKey } from "@/lib/sharedApi/auth";
// // import { checkUsageLimit, incrementUsage } from "@/lib/checkAndUpdateUsage";

// // export async function POST(req: NextRequest) {
// //   try {
// //     const apiKey = req.headers.get("TheNews-api-key");
// //     const { userId, error } = await verifyApiKey(apiKey);
// //     if (error) {
// //       return NextResponse.json({ error, code: "INVALID_API_KEY" }, { status: 403 });
// //     }

// //     const { email, source = "API", metadata, categoryId } = await req.json();

// //     if (!email || !categoryId) {
// //       return NextResponse.json(
// //         { error: "Email and categoryId are required.", code: "MISSING_FIELDS" },
// //         { status: 400 }
// //       );
// //     }

// //     await connectDb();

// //     // Check if subscriber already exists
// //     const existing = await Subscriber.findOne({ email, newsLetterOwnerId: userId, category: categoryId });
// //     if (existing) {
// //       return NextResponse.json(
// //         { error: "Subscriber already exists", code: "DUPLICATE_SUBSCRIBER" },
// //         { status: 409 }
// //       );
// //     }

// //     // Validate email
// //     const validation = await validateEmail({ email });
// //     if (validation.status === "invalid") {
// //       return NextResponse.json(
// //         { error: "Invalid email address", code: "INVALID_EMAIL" },
// //         { status: 422 }
// //       );
// //     }

// //     // Check usage limit
// //     const usageCheck = await checkUsageLimit(userId, "subscribersAdded");
// //     if (!usageCheck.success) {
// //       return NextResponse.json(
// //         { error: usageCheck.message, code: "USAGE_LIMIT_EXCEEDED" },
// //         { status: 429 }
// //       );
// //     }

// //     // Create subscriber
// //     const subscriber = await Subscriber.create({
// //       email,
// //       newsLetterOwnerId: userId,
// //       category: categoryId,
// //       source: `API - ${source}`,
// //       status: "Subscribed",
// //       metadata: {
// //         campaign: metadata?.campaign || null,
// //         pageUrl: metadata?.pageUrl || null,
// //         formId: metadata?.formId || null,
// //       },
// //     });

// //     // Update campaign subscriber count if campaign name was passed
// //     if (metadata?.campaign) {
// //       await Campaign.findOneAndUpdate(
// //         { name: metadata.campaign, newsLetterOwnerId: userId },
// //         {
// //           $inc: { subscribers: 1 },
// //           // Optionally store subscriber references:
// //           $addToSet: { subscriberIds: subscriber._id } // if you have this field
// //         }
// //       );
// //     }

// //     // Increment usage
// //     await incrementUsage(userId, "subscribersAdded");

// //     return NextResponse.json({ success: true, data: subscriber }, { status: 200 });
// //   } catch (err: any) { 
// //     console.error("Subscription Error:", err);
// //     return NextResponse.json(
// //       {
// //         error: err.message || "An error occurred while subscribing.",
// //         code: err.code || "SUBSCRIBE_ERROR",
// //       },
// //       { status: 500 }
// //     );
// //   }
// // }

// // app/api/integrations/[appName]/subscribe/route.ts

// import { NextResponse, type NextRequest } from 'next/server'
// import { validateEmail } from '@/shared/utils/ZeroBounceApi'
// import { sendCampaignConfirmationEmail } from '@/actions/email/sendCampaignConfirmation'
// import { currentUser } from '@clerk/nextjs/server'
// import { db } from '@/shared/libs/database'

// interface SubscribeRequestBody {
//   email: string
//   name?: string
//   campaignId?: string
//   source?: string
//   pageUrl?: string
// }

// export async function POST(
//   req: NextRequest,
//   context: { params: { appName: string } }
// ) {
//   try {
//     const user = await currentUser()
//     if (!user) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
//     }

//     const body = (await req.json()) as SubscribeRequestBody
//     const {
//       email,
//       name,
//       campaignId,
//       source = 'unknown',
//       pageUrl
//     } = body

//     if (!email) {
//       return NextResponse.json({ error: 'Email is required' }, { status: 400 })
//     }

//     if (!/\S+@\S+\.\S+/.test(email)) {
//       return NextResponse.json({ error: 'Invalid email format' }, { status: 422 })
//     }

//     // Validate integration
//     const integration = await db.integration.findFirst({
//       where: {
//         name: context.params.appName,
//         userId: user.id
//       }
//     })

//     if (!integration) {
//       return NextResponse.json({ error: 'Integration not found' }, { status: 404 })
//     }

//     // Optional campaign lookup
//     let campaign = null
//     if (campaignId) {
//       campaign = await db.campaign.findFirst({
//         where: {
//           id: campaignId,
//           integrationId: integration.id
//         }
//       })

//       if (!campaign) {
//         return NextResponse.json(
//           { error: 'Campaign not found for this integration' },
//           { status: 404 }
//         )
//       }
//     }

//     // External email verification
//     const validation = await validateEmail({ email })
//     if (validation.status === 'invalid') {
//       return NextResponse.json({ error: 'Invalid email address' }, { status: 422 })
//     }

//     // Prevent duplicates
//     const existing = await db.subscriber.findFirst({
//       where: {
//         email,
//         newsLetterOwnerId: user.id,
//         integrationId: integration.id,
//         campaignId: campaignId || null
//       }
//     })

//     if (existing) {
//       return NextResponse.json({
//         error: 'Subscriber already exists for this integration and campaign'
//       }, { status: 409 })
//     }

//     // Create subscriber
//     const subscriber = await db.subscriber.create({
//       data: {
//         email,
//         name,
//         newsLetterOwnerId: user.id,
//         status: 'Subscribed',
//         campaignId: campaignId || null,
//         integrationId: integration.id,
//         source,
//         pageUrl
//       }
//     })

//     // Increment count
//     await db.integration.update({
//       where: { id: integration.id },
//       data: { subscribers: { increment: 1 } }
//     })

//     // Send confirmation email (if automated template exists)
//     if (campaignId && campaign) {
//       const emailTemplate = await db.email.findFirst({
//         where: {
//           campaignId,
//           integrationId: integration.id,
//           emailType: 'automated'
//         },
//         orderBy: { updatedAt: 'desc' }
//       })

//       if (emailTemplate) {
//         await sendCampaignConfirmationEmail({
//           userEmail: email,
//           campaign: campaign.name,
//           integration: integration.name,
//           newsLetterOwnerId: user.id,
//           emailTemplateId: emailTemplate.id,
//           adminEmail: user.emailAddresses[0]?.emailAddress || '',
//           fromApplication: integration.name,
//         })
//       }
//     }

//     return NextResponse.json({ success: true, data: subscriber }, { status: 201 })

//   } catch (error: unknown) {
//     console.error('Subscription Error:', error)
//     const message =
//       error instanceof Error ? error.message : 'Internal server error'
//     return NextResponse.json({ error: message }, { status: 500 })
//   }
// }


import { NextResponse, type NextRequest } from 'next/server'
import { validateEmail } from '@/shared/utils/ZeroBounceApi'
import { sendCampaignConfirmationEmail } from '@/actions/email/sendCampaignConfirmation'
import { currentUser } from '@clerk/nextjs/server'
import { db } from '@/shared/libs/database'

interface SubscribeRequestBody {
  email: string
  name?: string
  campaignId: string
  appName: string
  source?: string
  pageUrl?: string
}

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = (await req.json()) as SubscribeRequestBody
    const {
      email,
      name,
      campaignId,
      appName,
      source = 'unknown',
      pageUrl
    } = body

    // ✅ Validate required fields
    if (!email || !campaignId || !appName) {
      return NextResponse.json(
        { error: 'Email, campaignId, and appName are required' },
        { status: 400 }
      )
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 422 })
    }

    // ✅ Look up integration by name and owner
    const integration = await db.integration.findFirst({
      where: {
        name: appName,
        userId: user.id
      }
    })

    if (!integration) {
      return NextResponse.json({ error: 'Integration not found' }, { status: 404 })
    }

    // ✅ Validate campaign
    const campaign = await db.campaign.findFirst({
      where: {
        id: campaignId,
        integrationId: integration.id
      }
    })

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found for this integration' }, { status: 404 })
    }

    // ✅ External email validation
    const validation = await validateEmail({ email })
    if (validation.status === 'invalid') {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 422 })
    }

    // ✅ Prevent duplicates
    const existing = await db.subscriber.findFirst({
      where: {
        email,
        newsLetterOwnerId: user.id,
        integrationId: integration.id,
        campaignId
      }
    })

    if (existing) {
      return NextResponse.json({
        error: 'Subscriber already exists for this integration and campaign'
      }, { status: 409 })
    }

    // ✅ Create subscriber
    const subscriber = await db.subscriber.create({
      data: {
        email,
        name,
        newsLetterOwnerId: user.id,
        status: 'Subscribed',
        campaignId,
        integrationId: integration.id,
        source,
        pageUrl
      }
    })

    // ✅ Increment integration subscriber count
    await db.integration.update({
      where: { id: integration.id },
      data: { subscribers: { increment: 1 } }
    })

    // ✅ Send confirmation email (if automated email template exists)
    const emailTemplate = await db.email.findFirst({
      where: {
        campaignId,
        integrationId: integration.id,
        emailType: 'automated'
      },
      orderBy: { updatedAt: 'desc' }
    })

    if (emailTemplate) {
      await sendCampaignConfirmationEmail({
        userEmail: email,
        campaign: campaign.name,
        integration: integration.name,
        newsLetterOwnerId: user.id,
        emailTemplateId: emailTemplate.id,
        adminEmail: user.emailAddresses[0]?.emailAddress || '',
        fromApplication: integration.name,
      })
    }

    return NextResponse.json({ success: true, data: subscriber }, { status: 201 })

  } catch (error: unknown) {
    console.error('Subscription Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
