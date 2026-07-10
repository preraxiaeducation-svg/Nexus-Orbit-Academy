import { NextRequest, NextResponse } from "next/server";
import { getNasaExplorerData } from "@/lib/nasa/service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") ?? "space";
    const data = await getNasaExplorerData(query);
    return NextResponse.json(data);
  } catch (error) {
    console.error("NASA API route error:", error);
    return NextResponse.json({ error: "Unable to load NASA resources right now." }, { status: 502 });
  }
}
