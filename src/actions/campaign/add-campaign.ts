




// // app/actions/campaign/add-campaign.ts
// "use server";

// import { db } from "@/shared/libs/database";
// import { currentUser } from "@clerk/nextjs/server";
// import { revalidatePath } from "next/cache";
// import { checkUsageLimit, incrementUsage } from "@/lib/checkAndUpdateUsage";
// import { CampaignTrigger } from "@prisma/client";

// interface State {
//   errors?: {
//     name?: string[];
//     subject?: string[];
//     integrationId?: string[];
//     trigger?: string[];
//     [key: string]: string[] | undefined;
//   };
//   message?: string | null;
// }

// export async function createCampaign(prevState: State, formData: FormData): Promise<State> {
//   const user = await currentUser();
//   if (!user) return { message: "Unauthorized" };

//   const name = formData.get("name") as string;
//   const description = formData.get("description") as string;
//   const trigger = formData.get("trigger") as CampaignTrigger;
//   const subject = formData.get("subject") as string;
//   const integrationId = formData.get("integrationId") as string;
//   const appName = formData.get("appName") as string;
//   const isAutoTrigger = formData.get("isAutoTrigger") === "true";

//   // Validate inputs
//   const errors: State["errors"] = {};

//   if (!name || name.trim().length === 0) {
//     errors.name = ["Name is required"];
//   } else if (name.length > 100) {
//     errors.name = ["Name must be less than 100 characters"];
//   }

//   if (!subject || subject.trim().length === 0) {
//     errors.subject = ["Subject is required"];
//   } else if (subject.length > 200) {
//     errors.subject = ["Subject must be less than 200 characters"];
//   }

//   if (!integrationId || integrationId.trim().length === 0) {
//     errors.integrationId = ["Integration ID is required"];
//   }

//   if (!Object.values(CampaignTrigger).includes(trigger)) {
//     errors.trigger = ["Valid trigger is required"];
//   }

//   if (Object.keys(errors).length > 0) {
//     return { errors, message: "Validation failed" };
//   }

//   try {
//     // 1. Check usage limit first
//     const usageCheck = await checkUsageLimit(user.id, "campaignsCreated");
//     if (!usageCheck.success) {
//       return {
//         message: usageCheck.message || "Campaign limit reached",
//         errors: { name: [usageCheck.message || "Campaign limit reached"] }
//       };
//     }

//     // 2. Verify integration exists and is active
//     const integration = await db.integration.findUnique({
//       where: { id: integrationId },
//     });

//     if (!integration) {
//       return { 
//         errors: { integrationId: ["Integration not found"] },
//         message: "Integration must exist to create campaign" 
//       };
//     }

//     if (integration.status !== "active") {
//       return { 
//         errors: { integrationId: ["Integration is not active"] },
//         message: "Integration must be active to create campaign" 
//       };
//     }

//     // 3. Create transaction for campaign creation and related records
//     const result = await db.$transaction(async (tx) => {
//       // Create the campaign
//       const campaign = await tx.campaign.create({
//         data: {
//           name,
//           userId: user.id,
//           description: description || null,
//           trigger,
//           subject,
//           status: 'inactive',
//           integrationId,
//           automated: isAutoTrigger,
          
//         },
//       });

//       // Create AutoTrigger if needed
//    // Create AutoTrigger if needed
//       if (isAutoTrigger && trigger === CampaignTrigger.scheduled) {
//         const existingTrigger = await tx.autoTrigger.findFirst({
//           where: {
//             name: campaign.trigger,
//           },
//         });

//         if (!existingTrigger) {
//           await tx.autoTrigger.create({
//             data: {
//               name: campaign.trigger,
//               description: description || null,
//               trigger,
//               status: 'active',
//               integrationId,
//               campaignId: campaign.id,
//             },
//           });
//         } else {
//           console.log('AutoTrigger already exists, skipping creation.');
//         }
//       }


//       // Update integration campaign count
//       await tx.integration.update({
//         where: { id: integrationId },
//         data: {
//           campaigns: {
//             increment: 1
//           }
//         }
//       });

//       return campaign;
//     });

//     // 4. Increment usage after successful creation
//     await incrementUsage(user.id, "campaignsCreated");

//     revalidatePath(`/dashboard/integration/${appName}/campaigns`);
//     return { 
//       message: "Campaign created successfully",
//       errors: undefined
//     };
//   } catch (error: any) {
//     console.error("Failed to create campaign:", error);
    
//     if (error.code === "P2002") {
//       if (error.meta?.target?.includes('name')) {
//         return { 
//           errors: { name: ["Campaign name already exists"] },
//           message: "Validation failed" 
//         };
//       }
//       if (error.meta?.target?.includes('campaignId')) {
//         return { 
//           errors: { integrationId: ["AutoTrigger already exists for this campaign"] },
//           message: "Validation failed" 
//         };
//       }
//     }
    
//     return { 
//       message: error.message || "Database error: Failed to create campaign",
//       errors: undefined
//     };
//   }
// }


"use server";

import { db } from "@/shared/libs/database";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { checkUsageLimit, incrementUsage } from "@/lib/checkAndUpdateUsage";
import { CampaignTrigger, CampaignStatus } from "@prisma/client";

interface State {
  errors?: {
    name?: string[];
    integrationId?: string[];
    trigger?: string[];
    [key: string]: string[] | undefined;
  };
  message?: string | null;
}

export async function createCampaign(
  prevState: State,
  formData: FormData
): Promise<State> {
  const user = await currentUser();
  if (!user) {
    return { message: "Unauthorized" };
  }

  // Extract and validate form data
  const name = formData.get("name")?.toString().trim() || "";
  const description = formData.get("description")?.toString().trim() || "";
  const trigger = formData.get("trigger") as CampaignTrigger;
  const integrationId = formData.get("integrationId")?.toString() || "";
  const appName = formData.get("appName")?.toString() || "";
  const status = formData.get("status") as CampaignStatus || CampaignStatus.ACTIVE;

  // Validate inputs
  const errors: State["errors"] = {};

  if (!name) {
    errors.name = ["Name is required"];
  } else if (name.length > 100) {
    errors.name = ["Name must be less than 100 characters"];
  }

  if (!integrationId) {
    errors.integrationId = ["Integration ID is required"];
  }

  if (!trigger || !Object.values(CampaignTrigger).includes(trigger)) {
    errors.trigger = ["Valid trigger is required"];
  }

  if (Object.keys(errors).length > 0) {
    return { errors, message: "Validation failed" };
  }

  try {
    // Check usage limit
    const usageCheck = await checkUsageLimit(user.id, "campaignsCreated");
    if (!usageCheck.success) {
      return {
        message: usageCheck.message || "Campaign limit reached",
        errors: { name: [usageCheck.message || "Campaign limit reached"] }
      };
    }

    // Verify integration exists and is active
    const integration = await db.integration.findUnique({
      where: { id: integrationId },
      select: { id: true, status: true }
    });

    if (!integration) {
      return { 
        errors: { integrationId: ["Integration not found"] },
        message: "Integration must exist to create campaign" 
      };
    }

    if (integration.status !== "ACTIVE") {
      return { 
        errors: { integrationId: ["Integration is not active"] },
        message: "Integration must be active to create campaign" 
      };
    }

    // Create campaign and related records in transaction
    const result = await db.$transaction(async (tx) => {
      // Create the campaign
      const campaign = await tx.campaign.create({
        data: {
          name,
          userId: user.id,
          description: description || null,
          trigger,
          status,
          integrationId,
        },
      });


      // Update integration campaign count
      await tx.integration.update({
        where: { id: integrationId },
        data: {
          campaigns: {
            increment: 1
          }
        }
      });

      return campaign;
    });

    // Increment usage after successful creation
    await incrementUsage(user.id, "campaignsCreated");

    revalidatePath(`/dashboard/integration/${appName}/campaigns`);
    revalidatePath(`/dashboard/integration/${appName}`);
    return { 
      message: "Campaign created successfully",
      errors: undefined
    };
  } catch (error: any) {
    console.error("Failed to create campaign:", error);
    
    // Handle specific database errors
    if (error.code === "P2002") {
      if (error.meta?.target?.includes('name')) {
        return { 
          errors: { name: ["Campaign name already exists"] },
          message: "Validation failed" 
        };
      }
      if (error.meta?.target?.includes('campaignId')) {
        return { 
          errors: { integrationId: ["AutoTrigger already exists for this campaign"] },
          message: "Validation failed" 
        };
      }
    }
    
    return { 
      message: error.message || "Database error: Failed to create campaign",
      errors: undefined
    };
  }
}