'use server';

import { db } from '@/shared/libs/database';
import { currentUser } from '@clerk/nextjs/server';

export async function getMembership() {
  const user = await currentUser();
  if (!user) {
    throw new Error('You must be logged in to view membership details');
  }

  const membership = await db.membership.findUnique({
    where: { userId: user.id },
  });

  if (!membership) {
    return null;
  }

  return {
    id: membership.id,
    userId: membership.userId,
    plan: membership.plan,
    role: membership.role,
    subscriptionStatus: membership.subscriptionStatus,
    paystackCustomerId: membership.paystackCustomerId,
    email: membership.email,
    organization: membership.organization,
    organizationURL: membership.organizationUrl,
    kycStatus: membership.approvedKYC,
    senderName: membership.SenderName,
    amount: membership.amount,
    currency: membership.currency,
    lastPaymentDate: membership.lastPaymentDate?.toISOString() ?? null,
    nextPaymentDate: membership.nextPaymentDate?.toISOString() ?? null,
    subscriberLimit: membership.subscriberLimit,
    emailLimit: membership.emailLimit,
    campaignLimit: membership.campaignLimit,
    appIntegratedLimit: membership.appIntegratedLimit,
    termsAndConditionsAccepted: membership.termsAndConditionsAccepted,
  };
}
