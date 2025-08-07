






"use server";


import { KYCStatusResponse } from "@/app/configs/types";
import { db } from "@/shared/libs/database";
import { currentUser } from "@clerk/nextjs/server";
import { KYCAccountType, KYCStatus } from "@prisma/client";




export async function startKYCProcess(accountType: KYCAccountType, userId: string) {
  if (!userId) {
    return { success: false, error: "You must be logged in" };
  }

  const membership = await db.membership.findUnique({ where: { userId: userId } });
  if (!membership) {
    return { success: false, error: "Membership record not found" };
  }

  const existingKYC = await db.kYC.findUnique({ where: { userId: userId } });
  
  // If KYC exists, update it instead of creating a new one
  if (existingKYC) {
    await db.kYC.update({
      where: { userId: userId },
      data: {
        accountType,
        status: KYCStatus.PENDING,
        levels: {
          level1: { status: KYCStatus.COMPLETED, completedAt: new Date() },
          level2: { status: KYCStatus.IN_PROGRESS },
          level3: { status: KYCStatus.PENDING },
        },
        // Clear previous documents when changing account type
        ...(existingKYC.accountType !== accountType && {
          kycDocuments: {
            deleteMany: {}
          }
        })
      },
    });
    return { success: true };
  }

  // Create new KYC if it doesn't exist
  await db.kYC.create({
    data: {
      userId: userId,
      accountType,
      status: KYCStatus.PENDING,
     levels: {
          level1: { status: KYCStatus.COMPLETED, completedAt: new Date() },
          level2: { status: KYCStatus.IN_PROGRESS },
          level3: { status: KYCStatus.PENDING },
        },
      documents:[]
    },
  });

  return { success: true };
}

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
          idType: formData.get("idType") as string,
          idNumber: formData.get("idNumber") as string,
          issuingCountry: formData.get("issuingCountry") as string,
          expiryDate: formData.get("expiryDate") as string,
          occupation: formData.get("occupation") as string,
          senderName: formData.get("senderName") as string,
        }
      : {
          legalName: formData.get("legalName") as string,
          registrationNumber: formData.get("registrationNumber") as string,
          tradingName: formData.get("tradingName") as string,
          taxId: formData.get("taxId") as string,
          incorporationDate: formData.get("incorporationDate") as string,
          incorporationCountry: formData.get("incorporationCountry") as string,
          businessType: formData.get("businessType") as string,
          industry: formData.get("industry") as string,
          website: formData.get("website") as string,
          senderName: formData.get("senderName") as string,
          description: formData.get("description") as string,
          registeredAddress: formData.get("registeredAddress") as string,
          operatingAddress: formData.get("operatingAddress") as string,
          contactPerson: formData.get("contactPerson") as string,
          contactEmail: formData.get("contactEmail") as string,
          contactPhone: formData.get("contactPhone") as string,
        };

  const updatedLevels = {
    ...levels,
    level2: {
      status: KYCStatus.COMPLETED,
      completedAt: new Date(),
      data: level2Data,
    },
    level3: {
      status: KYCStatus.IN_PROGRESS,
    },
  };

  // Delete previous documents before creating new ones
  await db.kYCDocument.deleteMany({
    where: { kycId: kyc.id }
  });

  await db.kYC.update({
    where: { userId: user.id },
    data: {
      accountType, // Update account type if changed
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

  // ✅ Use `level2Data` instead of stale `kyc.levels`
  await db.membership.update({
    where: { userId: user.id },
    data: {
      kycStatus: KYCStatus.IN_PROGRESS,
      organization:
        accountType === KYCAccountType.INDIVIDUAL
          ? ""
          : `${level2Data.legalName || ""}`,
      organizationUrl:
        accountType === KYCAccountType.INDIVIDUAL
          ? ""
          : `${level2Data.website || ""}`,
          SenderName: level2Data.senderName || "",
    },
  });

  return { success: true };
}

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
      status: KYCStatus.COMPLETED,
      completedAt: new Date(),
      data: {
        addressType,
        verifiedAt: new Date(),
      },
    },
  };

  // Delete previous address proof if exists
  await db.kYCDocument.deleteMany({
    where: { 
      kycId: kyc.id,
      type: "address_proof" 
    }
  });

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

   await db.membership.update({
    where: { userId: user.id },
    data: {
      kycStatus: KYCStatus.COMPLETED,
    },
  });

  return { success: true };
}

// New function to allow updating KYC information
export async function updateKYCInformation(
  userId: string,
  accountType: KYCAccountType,
  formData: FormData
) {
  if (!userId) {
    return { success: false, error: "You must be logged in" };
  }

  const kyc = await db.kYC.findUnique({ where: { userId } });
  if (!kyc) {
    return { success: false, error: "KYC record not found" };
  }

  // Reset KYC status to pending when making changes
  await db.kYC.update({
    where: { userId },
    data: {
      accountType,
      status: KYCStatus.PENDING,
      levels: {
        level1: { status: KYCStatus.COMPLETED },
        level2: { status: KYCStatus.IN_PROGRESS },
        level3: { status: KYCStatus.PENDING },
      },
      // Clear previous documents
      kycDocuments: {
        deleteMany: {}
      }
    },
  });

  // Submit the updated information
  return await submitKYCLevel2(formData, accountType);
}




// Endpoint: GET /api/kyc/status
export async function getKYCStatus() {
  const user = await currentUser();
  if (!user) return { success: false, error: "Unauthorized" };

  const kyc = await db.kYC.findUnique({
    where: { userId: user.id },
    include: { kycDocuments: true },
  });

  if (!kyc) return { success: false, error: "KYC not found" };

  return {
    success: true,
    data: {
      id: kyc.id,
      accountType: kyc.accountType,
      status: kyc.status,
      levels: kyc.levels,
      livePhoto: kyc.livePhoto,
      documents: kyc.kycDocuments,
    },
  };
}


// export async function getKYCStatus() {
//   const user = await currentUser();
//   if (!user) {
//     return { success: false, error: "Unauthorized" };
//   }

//   const kyc = await db.kYC.findUnique({
//     where: { userId: user.id },
//     include: {
//       kycDocuments: true,
//     },
//   });

//   if (!kyc) {
//     return { success: false, error: "KYC not found" };
//   }

//   let levels: Record<string, any> = {};

//   try {
//     levels = kyc.levels as any; // Prisma JSON is already parsed if type is `Json`
//   } catch (error) {
//     console.error("Error parsing KYC levels JSON:", error);
//   }

//   return {
//     success: true,
//     data: {
//       id: kyc.id,
//       userId: kyc.userId,
//       accountType: kyc.accountType,
//       status: kyc.status,
//       createdAt: kyc.createdAt,
//       updatedAt: kyc.updatedAt,
//       levels,
//       livePhoto: kyc.livePhoto,
//       documents: kyc.kycDocuments,
//     },
//   };
// }
