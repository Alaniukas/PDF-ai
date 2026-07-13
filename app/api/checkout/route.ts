import { NextRequest, NextResponse } from "next/server";
import { getAppUrl } from "@/lib/app-url";
import { getStripe } from "@/lib/stripe";
import { PACKAGES, PackageId } from "@/lib/packages";

/** @deprecated Naudok /api/intake — forma pirmiau, mokėjimas po */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const packageId = body.packageId as PackageId;

    const pkg = PACKAGES[packageId];
    if (!pkg) {
      return NextResponse.json({ error: "Neteisingas paketas" }, { status: 400 });
    }

    const stripe = getStripe();
    const appUrl = getAppUrl();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `${pkg.name}: ${pkg.subtitle}`,
              description: pkg.description,
            },
            unit_amount: pkg.priceCents,
          },
          quantity: 1,
        },
      ],
      metadata: { package_id: pkg.id },
      success_url: `${appUrl}/aciu?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/anketa?package=${packageId}&cancelled=true`,
      billing_address_collection: "auto",
      customer_creation: "always",
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Nepavyko sukurti mokėjimo sesijos" },
      { status: 500 }
    );
  }
}
