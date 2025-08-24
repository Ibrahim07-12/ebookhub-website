
import { NextResponse } from "next/server";
import { db } from '../../../lib/drizzle';
import { categories } from '../../../lib/schema';


export async function GET() {
  try {
    const result = await db.select().from(categories);
    // Optional: sort by name ascending
    result.sort((a, b) => {
      const nameA = a.name ?? '';
      const nameB = b.name ?? '';
      return nameA.localeCompare(nameB);
    });
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
