// // src/app/actions/kyc.ts

// "use server";

// import { db } from "@/shared/libs/database";
// import { currentUser } from "@clerk/nextjs/server";
// import { KYCAccountType, KYCStatus } from "@prisma/client";

// // Start KYC process
// export async function startKYCProcess(accountType: KYCAccountType) {
//    const user = await currentUser();
//    if (!user) {
//      return { success: false, error: "You must be logged in to create a blog post" };
//    }

//    const userId = user.id

//   // Check if KYC already exists
//   const existingKYC = await db.kYC.findUnique({
//     where: { userId: userId }
//   });

//   if (existingKYC) {
//     throw new Error("KYC already started");
//   }

//   // Create new KYC record
//   await db.kYC.create({
//     data: {
//       userId: userId,
//       accountType,
//       status:KYCStatus.PENDING,
//       levels: {
//         level1: { status: "completed", completedAt: new Date() },
//         level2: { status: "pending" },
//         level3: { status: "not_started" }
//       },
//       documents:{}
//     }
//   });

//   return { success: true };
// }

// // Submit Level 2 (Identity/Organization Verification)
// export async function submitKYCLevel2(
//   formData: FormData,
//   accountType:KYCAccountType
// ) {
// const user = await currentUser();
//    if (!user) {
//      return { success: false, error: "You must be logged in to create a blog post" };
//    }

//    const userId = user.id

//   // Get files from FormData
//   const idFront = formData.get("idFront") as File;
//   const idBack = formData.get("idBack") as File;
  
//   // Upload files to UploadThing
//   const uploads = await Promise.all([
//     UTApi.uploadFiles(idFront),
//     utapi.uploadFiles(idBack),
//   ]);

//   // Update KYC record
//   await db.kYC.update({
//     where: { userId: userId },
//     data: {
//       levels: {
//         level2: {
//           status: "completed",
//           completedAt: new Date(),
//           data: accountType === KYCAccountType.INDIVIDUAL ? {
//             idType: formData.get("idType"),
//             idNumber: formData.get("idNumber"),
//             issuingCountry: formData.get("issuingCountry"),
//             expiryDate: formData.get("expiryDate"),
//             occupation: formData.get("occupation"),
//           } : {
//             legalName: formData.get("legalName"),
//             registrationNumber: formData.get("registrationNumber"),
//             tradingName:formData.get("tradingName"),
//             taxId: formData.get("taxId"),
//             incorporationDate: formData.get("incorporationDate"),
//             incorporationCountry: formData.get("incorporationCountry"),
//             businessType: formData.get("businessType"),
//             industry: formData.get("industry"),
//             website: formData.get("website"),
//             description: formData.get("description"),
//             registeredAddress:formData.get("registeredAddress"),
//             operatingAddress: formData.get("operatingAddress"),
//             contactPerson:formData.get("contactPerson"),
//             contactEmail:formData.get("contactEmail"),
//             contactPhone:formData.get("contactPhone"),
//           }
//         },
//         level3: { status: "in_progress" }
//       },
//       documents: {
//         createMany: {
//           data: [
//             { type: "id_front", url: uploads[0].data?.url || "", key: uploads[0].data?.key || "" },
//             { type: "id_back", url: uploads[1].data?.url || "", key: uploads[1].data?.key || "" },
//           ]
//         }
//       }
//     }
//   });

//   return { success: true };
// }

// // Submit Level 3 (Proof of Life & Address)
// export async function submitKYCLevel3(
//   livePhoto: string, // base64 string
//   addressProof: File,
//   addressType: string
// ) {
//  const user = await currentUser();
//    if (!user) {
//      return { success: false, error: "You must be logged in to create a blog post" };
//    }

//    const userId = user.id

//   // Upload address proof to UploadThing
//   const upload = await utapi.uploadFiles(addressProof);

//   // Update KYC record
//   await db.kYC.update({
//     where: { userId:userId },
//     data: {
//       levels: {
//         level3: {
//           status: "completed",
//           completedAt: new Date(),
//           data: {
//             addressType,
//             verifiedAt: new Date()
//           }
//         }
//       },
//       livePhoto, // Store base64 image directly
//       status: KYCStatus.COMPLETED, // Ready for admin review
//       documents: {
//         create: {
//           type: "address_proof",
//           url: upload.data?.url || "",
//           key: upload.data?.key || ""
//         }
//       }
//     }
//   });

//   return { success: true };
// }

// // Get current KYC status
// export async function getKYCStatus() {
//  const user = await currentUser();
//    if (!user) {
//      return { success: false, error: "You must be logged in to create a blog post" };
//    }

//    const userId = user.id

//   return await db.kYC.findUnique({
//     where: { userId: userId },
//     select: {
//       id: true,
//       status: true,
//       accountType: true,
//       levels: true,
//       createdAt: true,
//       updatedAt: true
//     }
//   });
// }








"use server";


import { KYCStatusResponse } from "@/app/configs/types";
import { db } from "@/shared/libs/database";
import { currentUser } from "@clerk/nextjs/server";
import { KYCAccountType, KYCStatus } from "@prisma/client";


// Start KYC process
// export async function startKYCProcess(accountType: KYCAccountType) {
//   const user = await currentUser();
//   if (!user) {
//     return { success: false, error: "You must be logged in" };
//   }

//   const existingKYC = await db.kYC.findUnique({ where: { userId: user.id } });
//   if (existingKYC) throw new Error("KYC already started");

//   await db.kYC.create({
//     data: {
//       userId: user.id,
//       accountType,
//       status: KYCStatus.PENDING,
//       levels: {
//         level1: JSON.stringify({ status: "completed", completedAt: new Date() }),
//         level2: JSON.stringify({ status: "pending" }),
//         level3: JSON.stringify({ status: "not_started" }),
//       },
//       documents: {},
//     },
//   });

//   return { success: true };
// }

export async function startKYCProcess(accountType: KYCAccountType, userId: string)  {
  // const user = await currentUser();
  if (!userId) {
    return { success: false, error: "You must be logged in" };
  }

  console.log(userId, 'startKYCProcess')

  const membership = await db.membership.findUnique({ where: { userId: userId } });
  if (!membership) {
    return { success: false, error: "Membership record not found" };
  }

  console.log(membership, 'membership')

  const existingKYC = await db.kYC.findUnique({ where: { userId: userId } });
  if (existingKYC) throw new Error("KYC already started");

  await db.kYC.create({
    data: {
      userId: userId,
      accountType,
      status: KYCStatus.PENDING,
      levels: {
        level1: { status: "completed", completedAt: new Date() },
        level2: { status: "pending" },
        level3: { status: "not_started" },
      },
      documents: {},
    },
  });

  return { success: true };
}


// Submit Level 2 (Identity or Business)

export async function submitKYCLevel2(formData: FormData, accountType: KYCAccountType) {
  const user = await currentUser();
  if (!user) return { success: false, error: "You must be logged in" };

  const idFrontUrl = formData.get("idFrontUrl") as string;
  const idFrontKey = formData.get("idFrontKey") as string;
  const idBackUrl = formData.get("idBackUrl") as string;
  const idBackKey = formData.get("idBackKey") as string;

  const kyc = await db.kYC.findUnique({ where: { userId: user.id } });
  if (!kyc) return { success: false, error: "KYC not started" };

  const levels = kyc.levels as any;

  const level2Data =
    accountType === KYCAccountType.INDIVIDUAL
      ? {
          idType: formData.get("idType"),
          idNumber: formData.get("idNumber"),
          issuingCountry: formData.get("issuingCountry"),
          expiryDate: formData.get("expiryDate"),
          occupation: formData.get("occupation"),
        }
      : {
          legalName: formData.get("legalName"),
          registrationNumber: formData.get("registrationNumber"),
          tradingName: formData.get("tradingName"),
          taxId: formData.get("taxId"),
          incorporationDate: formData.get("incorporationDate"),
          incorporationCountry: formData.get("incorporationCountry"),
          businessType: formData.get("businessType"),
          industry: formData.get("industry"),
          website: formData.get("website"),
          description: formData.get("description"),
          registeredAddress: formData.get("registeredAddress"),
          operatingAddress: formData.get("operatingAddress"),
          contactPerson: formData.get("contactPerson"),
          contactEmail: formData.get("contactEmail"),
          contactPhone: formData.get("contactPhone"),
        };

  const updatedLevels = {
    ...levels,
    level2: {
      status: "completed",
      completedAt: new Date(),
      data: level2Data,
    },
    level3: {
      status: "in_progress",
    },
  };

  await db.kYC.update({
    where: { userId: user.id },
    data: {
      levels: updatedLevels,
      kycDocuments: {
        createMany: {
          data: [
            { type: "id_front", url: idFrontUrl, key: idFrontKey },
            { type: "id_back", url: idBackUrl, key: idBackKey },
          ],
        },
      },
    },
  });

  return { success: true };
}


// export async function submitKYCLevel2(
//   formData: FormData,
//   accountType: KYCAccountType
// ) {
//   const user = await currentUser();
//   if (!user) {
//     return { success: false, error: "You must be logged in" };
//   }

//     // Receive URL & key directly from client-side UploadThing
//   const idFrontUrl = formData.get("idFrontUrl") as string;
//   const idFrontKey = formData.get("idFrontKey") as string;
//   const idBackUrl = formData.get("idBackUrl") as string;
//   const idBackKey = formData.get("idBackKey") as string;

  

//   const data =
//     accountType === KYCAccountType.INDIVIDUAL
//       ? {
//           idType: formData.get("idType"),
//           idNumber: formData.get("idNumber"),
//           issuingCountry: formData.get("issuingCountry"),
//           expiryDate: formData.get("expiryDate"),
//           occupation: formData.get("occupation"),
//         }
//       : {
//           legalName: formData.get("legalName"),
//           registrationNumber: formData.get("registrationNumber"),
//           tradingName: formData.get("tradingName"),
//           taxId: formData.get("taxId"),
//           incorporationDate: formData.get("incorporationDate"),
//           incorporationCountry: formData.get("incorporationCountry"),
//           businessType: formData.get("businessType"),
//           industry: formData.get("industry"),
//           website: formData.get("website"),
//           description: formData.get("description"),
//           registeredAddress: formData.get("registeredAddress"),
//           operatingAddress: formData.get("operatingAddress"),
//           contactPerson: formData.get("contactPerson"),
//           contactEmail: formData.get("contactEmail"),
//           contactPhone: formData.get("contactPhone"),
//         };

//   await db.kYC.update({
//     where: { userId: user.id },
//     data: {
//       levels: {
//         level2: JSON.stringify({
//           status: "completed",
//           completedAt: new Date(),
//           data,
//         }),
//         level3: JSON.stringify({ status: "in_progress" }),
//       },
//       documents: {
//         createMany: {
//           data: [
//               {
//               type: "id_front",
//               url: idFrontUrl,
//               key: idFrontKey,
//             },
//             {
//               type: "id_back",
//               url: idBackUrl,
//               key: idBackKey,
//             },
//           ],
//         },
//       },
//     },
//   });

//   return { success: true };
// }




// Submit Level 3


export async function submitKYCLevel3(
  livePhoto: string,
  addressProofUrl: string,
  addressProofKey: string,
  addressType: string
) {
  const user = await currentUser();
  if (!user) return { success: false, error: "You must be logged in" };

  const kyc = await db.kYC.findUnique({ where: { userId: user.id } });
  if (!kyc) return { success: false, error: "KYC not started" };

  const levels = kyc.levels as any;

  const updatedLevels = {
    ...levels,
    level3: {
      status: "completed",
      completedAt: new Date(),
      data: {
        addressType,
        verifiedAt: new Date(),
      },
    },
  };

  await db.kYC.update({
    where: { userId: user.id },
    data: {
      levels: updatedLevels,
      livePhoto,
      status: KYCStatus.COMPLETED,
      kycDocuments: {
        create: {
          type: "address_proof",
          url: addressProofUrl,
          key: addressProofKey,
        },
      },
    },
  });

  return { success: true };
}


// export async function submitKYCLevel3(
//   livePhoto: string, // base64
//   addressProofUrl: string,
//   addressProofKey: string,
//   addressType: string
// ) {
//   const user = await currentUser();
//   if (!user) {
//     return { success: false, error: "You must be logged in" };
//   }

//   await db.kYC.update({
//     where: { userId: user.id },
//     data: {
//       levels: {
//         level3: JSON.stringify({
//           status: "completed",
//           completedAt: new Date(),
//           data: {
//             addressType,
//             verifiedAt: new Date(),
//           },
//         }),
//       },
//       livePhoto, // base64
//       status: KYCStatus.COMPLETED,
//       documents: {
//         create: {
//           type: "address_proof",
//           url: addressProofUrl,
//           key: addressProofKey,
//         },
//       },
//     },
//   });

//   return { success: true };
// }


// Get KYC status


// export async function getKYCStatus(): Promise<KYCStatusResponse> {
//   const user = await currentUser();
//   if (!user) {
//     return null;
//   }

//   const kyc = await db.kYC.findUnique({
//     where: { userId: user.id },
//     select: {
//       id: true,
//       status: true,
//       accountType: true,
//       levels: true,
//       createdAt: true,
//       updatedAt: true,
//     },
//   });

//   if (!kyc) {
//     return null;
//   }

//   // Ensure levels has the expected structure
//   const levels = kyc.levels as {
//     level1: string;
//     level2: string;
//     level3: string;
//   };

//   return {
//     ...kyc,
//     levels,
//   };
// }

// src/actions/kyc/getKYCStatus.ts



export async function getKYCStatus() {
  const user = await currentUser();
  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const kyc = await db.kYC.findUnique({
    where: { userId: user.id },
    include: {
      kycDocuments: true,
    },
  });

  if (!kyc) {
    return { success: false, error: "KYC not found" };
  }

  let levels: Record<string, any> = {};

  try {
    levels = kyc.levels as any; // Prisma JSON is already parsed if type is `Json`
  } catch (error) {
    console.error("Error parsing KYC levels JSON:", error);
  }

  return {
    success: true,
    data: {
      id: kyc.id,
      userId: kyc.userId,
      accountType: kyc.accountType,
      status: kyc.status,
      createdAt: kyc.createdAt,
      updatedAt: kyc.updatedAt,
      levels,
      livePhoto: kyc.livePhoto,
      documents: kyc.kycDocuments,
    },
  };
}
