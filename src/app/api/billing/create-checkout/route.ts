import { SubscriptionPlan } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { requireStripe } from "@/lib/stripe";

const schema = z.object({
  plan: z.enum([SubscriptionPlan.PRO, SubscriptionPlan.BUSINESS]),
});

const priceMap = {
  [SubscriptionPlan.PRO]: process.env.STRIPE_PRO_PRICE_ID,
  [SubscriptionPlan.BUSINESS]: process.env.STRIPE_BUSINESS_PRICE_ID,
};

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id || !session.user.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { plan } = schema.parse(await request.json());
    const priceId = priceMap[plan];
    if (!priceId) {
      return NextResponse.json({ error: "This plan is not configured." }, { status: 503 });
    }

    const stripe = requireStripe();
    const baseUrl = new URL(request.url).origin;
    const user = await prisma.user.findUnique({ where: { id: session.user.id } });

    let customerId = user?.stripeCustomerId ?? null;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: session.user.email,
        name: session.user.name ?? undefined,
        metadata: { userId: session.user.id },
      });
      customerId = customer.id;
      await prisma.user.update({ where: { id: session.user.id }, data: { stripeCustomerId: customer.id } });
    }

    const checkout = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${baseUrl}/dashboard?billing=success`,
      cancel_url: `${baseUrl}/dashboard?billing=cancelled`,
      metadata: { userId: session.user.id, plan },
    });

    return NextResponse.json({ url: checkout.url });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? "Invalid billing payload." }, { status: 400 });
    }
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to create checkout." }, { status: 500 });
  }
}
