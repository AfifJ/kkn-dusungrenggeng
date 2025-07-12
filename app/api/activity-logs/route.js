import { NextResponse } from "next/server";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  where,
} from "firebase/firestore";
import { db } from "@/firebase/client";

const ACTIVITIES_COLLECTION = "activities";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limitCount = parseInt(searchParams.get("limit")) || 20;
    const moduleFilter = searchParams.get("module");
    const userEmail = searchParams.get("user");

    let q;

    if (moduleFilter) {
      q = query(
        collection(db, ACTIVITIES_COLLECTION),
        where("module", "==", moduleFilter),
        orderBy("timestamp", "desc"),
        limit(limitCount)
      );
    } else if (userEmail) {
      q = query(
        collection(db, ACTIVITIES_COLLECTION),
        where("adminEmail", "==", userEmail),
        orderBy("timestamp", "desc"),
        limit(limitCount)
      );
    } else {
      q = query(
        collection(db, ACTIVITIES_COLLECTION),
        orderBy("timestamp", "desc"),
        limit(limitCount)
      );
    }

    const querySnapshot = await getDocs(q);
    const activities = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ activities });
  } catch (error) {
    console.error("Error fetching activities:", error);
    return NextResponse.json(
      { error: "Failed to fetch activities" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { action, module: moduleType, item, userEmail } = await request.json();

    if (!action || !moduleType || !userEmail) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const activityData = {
      action: `${action} ${moduleType}`,
      item: item || "",
      module: moduleType,
      adminEmail: userEmail,
      timestamp: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    const docRef = await addDoc(collection(db, ACTIVITIES_COLLECTION), activityData);

    return NextResponse.json({
      id: docRef.id,
      ...activityData,
    });
  } catch (error) {
    console.error("Error logging activity:", error);
    return NextResponse.json(
      { error: "Failed to log activity" },
      { status: 500 }
    );
  }
}
