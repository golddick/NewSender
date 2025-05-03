// import { NextRequest, NextResponse } from "next/server";
// import jwt from "jsonwebtoken";
// import { connectDb } from "@/shared/libs/db";
// import Subscriber from "@/models/subscriber.model";
// import { validateEmail } from "@/shared/utils/ZeroBounceApi";

// export async function POST(req: NextRequest, res: any) {
//   try {
//     const data = await req.json();
//     const apiKey = data.apiKey;

//     console.log(data, "API Key Data")

//     const decoded: any = jwt.verify(apiKey, process.env.JWT_SECRET_KEY!);

//     console.log("Decoded API Key:", decoded);

//     await connectDb();
//     // check if subscribers already exists
//     const isSubscriberExist = await Subscriber.findOne({
//       email: data.email,
//       newsLetterOwnerId: decoded?.user?.id,
//     });

//     if (isSubscriberExist) {
//       return NextResponse.json(
//         { error: "Email already exists!" },
//         { status: 409 } // Conflict
//       );
//     }


//     // Validate email
//     const validationResponse = await validateEmail({ email: data.email });
//     if (validationResponse.status === "invalid") {
//       return NextResponse.json(
//         { error: "Email not valid!" },
//         { status: 400 } // Bad Request
//       );
//     }

//     // Create new subscriber
//     const subscriber = await Subscriber.create({
//       email: data.email,
//       newsLetterOwnerId: decoded?.user?.id,
//       source: "By API",
//       status: "Subscribed",
//     });

//     return NextResponse.json(subscriber);
//   } catch (error) {
//     return new NextResponse("Internal Error", { status: 500 });
//   }
// }





import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDb } from "@/shared/libs/db";
import Subscriber from "@/models/subscriber.model";
import Membership from "@/models/membership.model";
import { validateEmail } from "@/shared/utils/ZeroBounceApi";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const apiKey = data.apiKey;

    const decoded: any = jwt.verify(apiKey, process.env.JWT_SECRET_KEY!);
    const userId = decoded?.user?.id;

    await connectDb();

    // 1. Get the user's membership info
    const membership = await Membership.findOne({ userId });

    if (!membership) {
      return NextResponse.json({ error: "Membership not found" }, { status: 404 });
    }

    // 2. Count current subscribers
    const currentSubscriberCount = await Subscriber.countDocuments({
      newsLetterOwnerId: userId,
    });

    // 3. Check subscriber limit
    if (currentSubscriberCount >= (membership.subscriberLimit || 500)) {
      return NextResponse.json(
        { error: `Subscriber limit reached for your plan (${membership.plan}).` },
        { status: 403 } // Forbidden
      );
    }

    // 4. Check if email already exists
    const isSubscriberExist = await Subscriber.findOne({
      email: data.email,
      newsLetterOwnerId: userId,
    });

    if (isSubscriberExist) {
      return NextResponse.json(
        { error: "Email already exists!" },
        { status: 409 } // Conflict
      );
    }

    // 5. Validate email
    const validationResponse = await validateEmail({ email: data.email });
    if (validationResponse.status === "invalid") {
      return NextResponse.json(
        { error: "Email not valid!" },
        { status: 400 } // Bad Request
      );
    }

    // 6. Create new subscriber
    const subscriber = await Subscriber.create({
      email: data.email,
      newsLetterOwnerId: userId,
      source: "By API",
      status: "Subscribed",
    });

    return NextResponse.json(subscriber);
  } catch (error) {
    console.error("Error in subscriber API:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

