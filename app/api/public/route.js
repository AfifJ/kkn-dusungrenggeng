import { NextRequest, NextResponse } from "next/server";
import { getPublishedData, searchData, filterDataByCategory } from "@/data";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get("section");
    const search = searchParams.get("search");
    const category = searchParams.get("category");
    const limit = searchParams.get("limit");

    if (!section) {
      return NextResponse.json({ error: "Section parameter required" }, { status: 400 });
    }

    let data = getPublishedData(section);

    // Apply search filter
    if (search) {
      data = searchData(section, search);
    }

    // Apply category filter
    if (category) {
      data = filterDataByCategory(section, category);
    }

    // Apply limit
    if (limit) {
      const limitNum = parseInt(limit);
      data = data.slice(0, limitNum);
    }

    // Sort by date (newest first) for applicable sections
    if (['berita', 'galeri', 'agenda'].includes(section)) {
      data.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching public data:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
