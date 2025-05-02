// import Stripe from "stripe";
// import { NextRequest, NextResponse } from "next/server";
// import Membership from "@/models/membership.model";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: "2025-03-31.basil",
// });

// const webhookSecret: string = process.env.STRIPE_WEBHOOK_SECRET!;

// const webhookHandler = async (req: NextRequest) => {
//   try {
//     const buf = await req.text();
//     const sig = req.headers.get("stripe-signature")!;

//     let event: Stripe.Event;

//     try {
//       event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : "Unknown error";
//       // On error, log and return the error message.
//       if (err! instanceof Error) console.log(err);
//       console.log(`❌ Error message: ${errorMessage}`);

//       return NextResponse.json(
//         {
//           error: {
//             message: `Webhook Error: ${errorMessage}`,
//           },
//         },
//         { status: 400 }
//       );
//     }

//     // Successfully constructed event.
//     console.log("✅ Success:", event.id);

//     // getting to the data we want from the event
//     const subscription = event.data.object as Stripe.Subscription;
//     const itemId: any = subscription.items.data[0].price.product;

//     // Fetch the product (plan) details
//     const product = await stripe.products.retrieve(itemId);

//     const planName = product.name;

//     switch (event.type) {
//       case "customer.subscription.created":
//         // customer subscription created
//         const membership = await Membership.findOne({
//           stripeCustomerId: subscription.customer,
//         });

//         if (membership) {
//           await Membership.updateOne(
//             {
//               stripeCustomerId: subscription.customer,
//             },
//             { $set: { plan: planName } }
//           );
//         }
//         break;
//       case "customer.subscription.deleted":
//         // subscription deleted
//         break;
//         case 'customer.subscription.resumed':
//       const customerSubscriptionResumed = event.data.object;
//       // Then define and call a function to handle the event customer.subscription.resumed
//       break;
//     case 'customer.subscription.updated':
//       const customerSubscriptionUpdated = event.data.object;
//       // Then define and call a function to handle the event customer.subscription.updated
//       break;

//       default:
//         console.warn(`🤷‍♀️ Unhandled event type: ${event.type}`);
//         break;
//     }

//     // Return a response to acknowledge receipt of the event.
//     return NextResponse.json({ received: true });
//   } catch {
//     return NextResponse.json(
//       {
//         error: {
//           message: `Method Not Allowed`,
//         },
//       },
//       { status: 405 }
//     ).headers.set("Allow", "POST");
//   }
// };

// export { webhookHandler as POST };



import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import Membership from "@/models/membership.model";

// Initialize Stripe with current API version
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-03-31.basil", // Updated to latest stable version
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// Disable Next.js body parser for this route
export const config = {
  api: {
    bodyParser: false,
  },
};

const webhookHandler = async (req: NextRequest) => {
  // Only allow POST requests
  if (req.method !== "POST") {
    return new NextResponse("Method Not Allowed", { status: 405 });
  }

  try {
    // Get raw body as buffer to ensure exact payload
    const rawBody = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: { message: "Missing stripe-signature header" } },
        { status: 400 }
      );
    }

    let event: Stripe.Event;
    
    try {
      event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    } catch (err) {
      console.error("❌ Webhook signature verification failed:", err);
      return NextResponse.json(
        { error: { message: "Webhook signature verification failed" } },
        { status: 400 }
      );
    }

    console.log(`✅ Webhook processed: ${event.type} (${event.id})`);

    // Handle subscription events
    if (event.type.startsWith("customer.subscription.")) {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer;

      console.log(subscription, 'customerId', customerId);
      
      // Get the first product from subscription
      const productId = subscription.items.data[0]?.price?.product;
      if (!productId || typeof productId !== "string") {
        console.error("No product found in subscription");
        return NextResponse.json(
          { error: { message: "No product in subscription" } },
          { status: 400 }
        );
      }

      // Retrieve product details
      const product = await stripe.products.retrieve(productId);
      const planName = product.name;

      // Find and update membership
      const membership = await Membership.findOne({ stripeCustomerId: customerId });
      if (!membership) {
        console.warn(`Membership not found for customer: ${customerId}`);
        return NextResponse.json(
          { error: { message: "Membership not found" } },
          { status: 404 }
        );
      }

      // Handle different subscription events
      switch (event.type) {
        case "customer.subscription.created":
        case "customer.subscription.updated":
        case "customer.subscription.resumed":
          await Membership.updateOne(
            { stripeCustomerId: customerId },
            { $set: { plan: planName} }
          );
          console.log(`Updated membership plan to ${planName}`);
          break;

        case "customer.subscription.deleted":
          // await Membership.updateOne(
          //   { stripeCustomerId: customerId },
          //   { $set: { plan: "free", status: "inactive" } }
          // );
          console.log("Subscription cancelled - membership downgraded");
          break;

        default:
          console.warn(`Unhandled subscription event: ${event.type}`);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Webhook processing error:", error);
    return NextResponse.json(
      { error: { message: "Internal server error" } },
      { status: 500 }
    );
  }
};

export { webhookHandler as POST };




// import Stripe from "stripe";
// import { NextRequest, NextResponse } from "next/server";
// import Membership from "@/models/membership.model";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: "2025-03-31.basil",
// });

// const webhookSecret: string = process.env.STRIPE_WEBHOOK_SECRET!;

// const webhookHandler = async (req: NextRequest) => {
//   try {
//     const buf = await req.text();
//     const sig = req.headers.get("stripe-signature")!;

//     let event: Stripe.Event;

//     try {
//       event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : "Unknown error";
//       console.error("❌ Error verifying webhook:", errorMessage);
//       return NextResponse.json(
//         {
//           error: {
//             message: `Webhook Error: ${errorMessage}`,
//           },
//         },
//         { status: 400 }
//       );
//     }

//     console.log("✅ Webhook received:", event.id);

//     switch (event.type) {
//       case "customer.subscription.created":
//       case "customer.subscription.updated": {
//         const subscription = event.data.object as Stripe.Subscription;
//         const productId = subscription.items.data[0].price.product;
//         const product = await stripe.products.retrieve(productId as string);
//         const planName = product.name;

//         const membership = await Membership.findOne({
//           stripeCustomerId: subscription.customer,
//         });

//         if (membership) {
//           await Membership.updateOne(
//             { stripeCustomerId: subscription.customer },
//             { $set: { plan: planName } }
//           );
//           console.log(`✅ Membership plan updated to ${planName}`);
//         } else {
//           console.warn("⚠️ Membership not found for customer:", subscription.customer);
//         }

//         break;
//       }

//       case "customer.subscription.deleted":
//         // You can choose to handle plan removal here
//         break;

//       case "customer.subscription.resumed":
//         // Handle resumed logic if needed
//         break;

//       default:
//         console.warn(`🤷‍♀️ Unhandled event type: ${event.type}`);
//         break;
//     }

//     return NextResponse.json({ received: true });
//   } catch (err) {
//     console.error("❌ Webhook handler error:", err);
//     return new NextResponse(
//       JSON.stringify({
//         error: { message: "Method Not Allowed" },
//       }),
//       {
//         status: 405,
//         headers: { Allow: "POST" },
//       }
//     );
//   }
// };

// export { webhookHandler as POST };
