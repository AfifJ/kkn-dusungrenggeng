import { NextRequest, NextResponse } from "next/server";
import { 
  getDataBySection, 
  validateData,
  websiteData,
  beritaData,
  produkData,
  galeriData,
  agendaData 
} from "@/data";

// In-memory storage (in production, use database)
let dataStore = {
  website: websiteData,
  berita: beritaData,
  produk: produkData,
  galeri: galeriData,
  agenda: agendaData
};

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get("section");
    const id = searchParams.get("id");

    if (!section) {
      return NextResponse.json({ error: "Section parameter required" }, { status: 400 });
    }

    const data = dataStore[section] || dataStore[section === 'settings' ? 'website' : section];
    
    if (!data) {
      return NextResponse.json({ error: "Section not found" }, { status: 404 });
    }

    // If ID is provided, return specific item
    if (id && Array.isArray(data)) {
      const item = data.find(item => item.id.toString() === id);
      if (!item) {
        return NextResponse.json({ error: "Item not found" }, { status: 404 });
      }
      return NextResponse.json(item);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { section, data } = body;

    if (!section || !data) {
      return NextResponse.json({ error: "Section and data required" }, { status: 400 });
    }

    // Handle website/settings data
    if (section === 'website' || section === 'settings') {
      dataStore.website = { ...dataStore.website, ...data };
      return NextResponse.json({ success: true, data: dataStore.website });
    }

    // Handle array data (berita, produk, galeri, agenda)
    if (Array.isArray(dataStore[section])) {
      // Validate data
      if (!validateData(section, data)) {
        return NextResponse.json({ error: "Invalid data format" }, { status: 400 });
      }

      // Generate new ID
      const maxId = Math.max(...dataStore[section].map(item => item.id), 0);
      const newItem = { ...data, id: maxId + 1 };
      
      dataStore[section].push(newItem);
      return NextResponse.json({ success: true, data: newItem });
    }

    return NextResponse.json({ error: "Invalid section" }, { status: 400 });
  } catch (error) {
    console.error("Error creating data:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { section, id, data } = body;

    if (!section || !id || !data) {
      return NextResponse.json({ error: "Section, ID, and data required" }, { status: 400 });
    }

    if (!Array.isArray(dataStore[section])) {
      return NextResponse.json({ error: "Invalid section" }, { status: 400 });
    }

    // Validate data
    if (!validateData(section, data)) {
      return NextResponse.json({ error: "Invalid data format" }, { status: 400 });
    }

    const index = dataStore[section].findIndex(item => item.id.toString() === id.toString());
    if (index === -1) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    dataStore[section][index] = { ...dataStore[section][index], ...data };
    return NextResponse.json({ success: true, data: dataStore[section][index] });
  } catch (error) {
    console.error("Error updating data:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get("section");
    const id = searchParams.get("id");

    if (!section || !id) {
      return NextResponse.json({ error: "Section and ID required" }, { status: 400 });
    }

    if (!Array.isArray(dataStore[section])) {
      return NextResponse.json({ error: "Invalid section" }, { status: 400 });
    }

    const index = dataStore[section].findIndex(item => item.id.toString() === id.toString());
    if (index === -1) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    const deletedItem = dataStore[section].splice(index, 1)[0];
    return NextResponse.json({ success: true, data: deletedItem });
  } catch (error) {
    console.error("Error deleting data:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
