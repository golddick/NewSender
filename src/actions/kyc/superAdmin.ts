"use server";

import { computeCompletion } from "@/lib/kyc";
import { db } from "@/shared/libs/database";
import {  currentUser } from "@clerk/nextjs/server"; // or your auth lib
import { notifyUserAboutKycStatus } from "./notify";

// ✅ Utility: restrict to super admin
async function requireSuperAdmin(userId: string) {
  const membership = await db.membership.findUnique({
    where: { userId },
    select: { role: true },
  });

//   if (!membership || membership.role !== "THENEWSADMIN") {
//     throw new Error("Unauthorized: Super Admins only");
//   }
}

/**
 * Fetch all KYC records (Super Admin only)
 */
export async function fetchAllKyc() {
 const user = await currentUser();
  if (!user) return { success: false, error: "You must be logged in" };

  const userId = user.id

  try {
    await requireSuperAdmin(userId);

    const kycs = await db.kYC.findMany({
      include: {
        user: {
          select: {
            userId: true,
            fullName: true,
            email: true,
          },
        },
        kycDocuments: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, data: kycs };
  } catch (err: any) {
    console.error("Fetch KYC error:", err);
    return { success: false, error: err.message || "Failed to fetch KYC" };
  }
}


/**
 * Fetch single KYC by KYC id (Super Admin only)
 */
export async function fetchKycById(kycId: string) {
  const user = await currentUser();
  if (!user) return { success: false, error: "You must be logged in" };

  const userId = user.id;

  try {
    await requireSuperAdmin(userId);

    const kyc = await db.kYC.findUnique({
      where: { id: kycId }, // ✅ fetch by KYC id
      include: {
        user: {
          select: {
            userId: true,
            fullName: true,
            email: true,
          },
        },
        kycDocuments: true,
      },
    });

    if (!kyc) {
      return { success: false, error: "KYC not found" };
    }

     // 🧮 Compute completion percentage
    const completion = computeCompletion(kyc.levels, kyc.status);


    return { success: true, data: { ...kyc, completion } };
  } catch (err: any) {
    console.error("Fetch single KYC error:", err);
    return { success: false, error: err.message || "Failed to fetch KYC" };
  }
}





export async function updateKycStatus(
  kycId: string,
  status: "APPROVED" | "REJECTED",
  comments?: string
) {
   const user = await currentUser();
  if (!user) return { success: false, error: "You must be logged in" };

  const userId = user.id;

  try {

     // Get KYC application with user details
    const kycApplication = await db.kYC.findUnique({
      where: { id: kycId },
      select: {
        id: true,
        userId: true,
        status: true,
        reviewedBy: true,
        reviewedTime: true,
        rejectedResponse: true,
        user: {
          select: {
            email: true,
            fullName: true,
            imageUrl: true,
          }
          
        }
        

      }
      // include: {
        
      //   user: {
      //     select: {
      //       id: true,
      //       email: true,
      //       userId: true,
      //       fullName: true,
      //       imageUrl: true,
      //     }
      //   }
      // }
      
       

    })

    if (!kycApplication) {
      return { success: false, error: "KYC application not found" }
    }



    const updated = await db.kYC.update({
      where: { id: kycId },
      data: {
        status,
        comments: comments || null,
        reviewedBy: user.fullName,
        reviewedTime: new Date(),
      },
    });

        // Send notification for both APPROVED and REJECTED statuses
    const notificationResult = await notifyUserAboutKycStatus({
      kycApplication: {
        ...updated,
        user: kycApplication.user
      },
      adminEmail: user.emailAddresses[0]?.emailAddress || '',
      fromApplication: "TheNews Team",
    })

    if (!notificationResult.success) {
      console.warn('KYC notification failed:', notificationResult.error)
      // Continue even if notification fails
    }
 
    return { success: true, data: updated };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to update KYC status" };
  }
}
