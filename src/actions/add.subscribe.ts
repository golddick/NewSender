
"use server";

import Subscriber from "@/models/subscriber.model";
import Membership from "@/models/membership.model";
import MembershipUsage from "@/models/membershipUsage.model";
import { connectDb } from "@/shared/libs/db";
import { validateEmail } from "@/shared/utils/ZeroBounceApi";
import { clerkClient } from "@clerk/nextjs/server";

export const subscribe = async ({
  email,
  username,
}: {
  email: string;
  username: string;
}) => {
  try {
    await connectDb();

    const client = await clerkClient();
    const allUsersResponse = await client.users.getUserList();
    const allUsers = allUsersResponse.data;

    const newsletterOwner = allUsers.find((i) => i.username === username);
    if (!newsletterOwner) {
      throw Error("Username is not valid!");
    }

    console.log("Newsletter Owner ID:", newsletterOwner.id);

    // Fetch Membership
    const membership = await Membership.findOne({ userId: newsletterOwner.id });
    if (!membership) {
      return { error: "No active plan found for this user." };
    }

    const currentMonth = new Date().toISOString().slice(0, 7); // e.g. "2025-05"

    // Get current usage
    const usage = await MembershipUsage.findOne({
      userId: newsletterOwner.id,
      month: currentMonth,
    });

    const subscriberCount = usage?.subscribersAdded ?? 0;

    if (subscriberCount >= (membership.subscriberLimit ?? 0)) {
      return { error: "Monthly subscriber limit reached." };
    }

    // Check for duplicate subscriber
    const isSubscriberExist = await Subscriber.findOne({
      email,
      newsLetterOwnerId: newsletterOwner.id,
    });

    if (isSubscriberExist) {
      return { error: "Email already exists!" };
    }

    // Validate email
    const validationResponse = await validateEmail({ email });
    if (validationResponse.status === "invalid") {
      return { error: "Email not valid!" };
    }

    // Create new subscriber
    const subscriber = await Subscriber.create({
      email,
      newsLetterOwnerId: newsletterOwner.id,
      source: "By TheNews website",
      status: "Subscribed",
    });

    // Increment usage
    await MembershipUsage.updateOne(
      { userId: newsletterOwner.id, month: currentMonth },
      { $inc: { subscribersAdded: 1 } },
      { upsert: true }
    );

    return subscriber;

  } catch (error) {
    console.error(error);
    return { error: "An error occurred while subscribing." };
  }
};
