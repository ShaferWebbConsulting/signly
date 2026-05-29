import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { requireStripe } from "@/lib/stripe";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user?.stripeCustomerId) {
    return NextResponse.json({ error: "No Stripe customer found." }, { status: 404 });
  }

  try {
    const stripe = requireStripe();
    const portal = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${new URL(request.url).origin}/dashboard`,
    });

    return NextResponse.json({ url: portal.url });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to create portal session." }, { status: 500 });
  }
}
