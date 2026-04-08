import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { env } from "@/env";

// Credit pack config — mirrors the Zustand store definition
const PACK_CONFIG: Record<string, { credits: number; name: string; amountCents: number }> = {
  starter_50: { credits: 50, name: "Starter", amountCents: 499 },
  growth_150: { credits: 150, name: "Growth", amountCents: 1299 },
  pro_400: { credits: 400, name: "Pro", amountCents: 2999 },
};

export async function POST(request: NextRequest) {
  try {
    // Verify the user is authenticated
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { packId } = body as { packId: string };

    const pack = PACK_CONFIG[packId];
    if (!pack) {
      return NextResponse.json({ error: "Invalid pack" }, { status: 400 });
    }

    const appUrl = env.NEXT_PUBLIC_APP_URL;

    // Create a Stripe Checkout session (one-time payment)
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `CourseGen ${pack.name} Pack`,
              description: `${pack.credits} AI course generation credits`,
              images: [],
            },
            unit_amount: pack.amountCents,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      // Encode pack info in success URL so client can read it without a webhook
      success_url: `${appUrl}/billing/success?credits=${pack.credits}&pack=${pack.name}&amount=${pack.amountCents}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/billing?cancelled=true`,
      customer_email: session.user.email ?? undefined,
      metadata: {
        userId: session.user.id,
        packId,
        credits: pack.credits.toString(),
        packName: pack.name,
      },
      // Expires in 30 minutes
      expires_at: Math.floor(Date.now() / 1000) + 60 * 30,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("[stripe/checkout] Error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
