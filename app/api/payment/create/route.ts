import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/drizzle";
import { categories, purchases } from "@/lib/schema";
import { eq } from "drizzle-orm";

// Midtrans config
const midtransServerKey = process.env.MIDTRANS_SERVER_KEY;
const midtransIsProduction = process.env.MIDTRANS_IS_PRODUCTION === "false";
const midtransBaseUrl = midtransIsProduction
  ? "https://app.midtrans.com/snap/v1/transactions"
  : "https://app.sandbox.midtrans.com/snap/v1/transactions";

export async function POST(request: NextRequest) {
  try {
    const { categoryId, amount, email, name } = await request.json();

    if (!categoryId || !amount || !email || !name) {
      return NextResponse.json(
        { error: "categoryId, amount, email, and name are required" },
        { status: 400 }
      );
    }

    // Get category details
    const catArr = await db.select().from(categories).where(eq(categories.slug, categoryId));
    const category = catArr[0];
    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    // Check if amount matches category price
    if (amount !== category.price) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    // Generate unique order ID
    const orderId = `ORDER-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Create purchase record in database
    await db.insert(purchases).values({
      id: orderId,
      categoryId: String(category.id),
      orderId,
      amount,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Prepare Midtrans payload
    const payload = {
      transaction_details: {
        order_id: orderId,
        gross_amount: amount,
      },
      customer_details: {
        email,
        first_name: name,
      },
      item_details: [
        {
          id: category.id,
          price: amount,
          quantity: 1,
          name: category.name,
        },
      ],
    };

    // Call Midtrans Snap API
    const response = await fetch(midtransBaseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": "Basic " + Buffer.from(midtransServerKey + ":").toString("base64"),
      },
      body: JSON.stringify(payload),
    });
    const midtransRes = await response.json();

    if (!midtransRes.token) {
      return NextResponse.json({ error: "Failed to create transaction", midtransRes }, { status: 500 });
    }

    // Return snap_token to frontend
    return NextResponse.json({
      snap_token: midtransRes.token,
      redirect_url: midtransRes.redirect_url,
      orderId,
    });
  } catch (error) {
    console.error("Payment creation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
