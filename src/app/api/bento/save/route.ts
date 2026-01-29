import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";
import type { BentoData } from "@/lib/bento-types";

export async function POST(request: NextRequest) {
  // Only allow in development mode
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      { error: "This endpoint is only available in development mode" },
      { status: 403 }
    );
  }

  try {
    const data: BentoData = await request.json();

    // Validate basic structure
    if (!data.profile || !data.sections) {
      return NextResponse.json(
        { error: "Invalid data structure" },
        { status: 400 }
      );
    }

    // Write to the JSON file
    const filePath = join(process.cwd(), "src", "data", "bento-links.json");
    const jsonContent = JSON.stringify(data, null, 2) + "\n";

    await writeFile(filePath, jsonContent, "utf-8");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to save bento data:", error);
    return NextResponse.json(
      { error: "Failed to save data" },
      { status: 500 }
    );
  }
}
