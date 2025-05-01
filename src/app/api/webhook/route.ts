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

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-03-31.basil",
});

const webhookSecret: string = process.env.STRIPE_WEBHOOK_SECRET!;

const webhookHandler = async (req: NextRequest) => {
  try {
    const buf = await req.text();
    const sig = req.headers.get("stripe-signature")!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      console.error("❌ Error verifying webhook:", errorMessage);
      return NextResponse.json(
        {
          error: {
            message: `Webhook Error: ${errorMessage}`,
          },
        },
        { status: 400 }
      );
    }

    console.log("✅ Webhook received:", event.id);

    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const productId = subscription.items.data[0].price.product;
        const product = await stripe.products.retrieve(productId as string);
        const planName = product.name;

        const membership = await Membership.findOne({
          stripeCustomerId: subscription.customer,
        });

        if (membership) {
          await Membership.updateOne(
            { stripeCustomerId: subscription.customer },
            { $set: { plan: planName } }
          );
          console.log(`✅ Membership plan updated to ${planName}`);
        } else {
          console.warn("⚠️ Membership not found for customer:", subscription.customer);
        }

        break;
      }

      case "customer.subscription.deleted":
        // You can choose to handle plan removal here
        break;

      case "customer.subscription.resumed":
        // Handle resumed logic if needed
        break;

      default:
        console.warn(`🤷‍♀️ Unhandled event type: ${event.type}`);
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("❌ Webhook handler error:", err);
    return new NextResponse(
      JSON.stringify({
        error: { message: "Method Not Allowed" },
      }),
      {
        status: 405,
        headers: { Allow: "POST" },
      }
    );
  }
};

export { webhookHandler as POST };
