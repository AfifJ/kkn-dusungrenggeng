import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  getDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/firebase/client";

const COLLECTION_NAME = "dataUsaha";

// Get all business data
export const getDataUsaha = async () => {
  try {
    const q = query(collection(db, COLLECTION_NAME), 
      orderBy("nama", "asc"));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error getting business data:", error);
    throw error;
  }
};

// Add new business data
export const addDataUsaha = async (data, userEmail) => {
  try {
    const usahaData = {
      ...data,
      createdAt: new Date().toISOString(),
      createdBy: userEmail,
      lastModified: new Date().toISOString(),
      lastModifiedBy: userEmail,
    };

    const docRef = await addDoc(collection(db, COLLECTION_NAME), usahaData);

    // Log activity
    await logActivity("create", "dataUsaha", data.nama || "Unnamed Business", userEmail);

    return {
      id: docRef.id,
      ...usahaData,
    };
  } catch (error) {
    console.error("Error adding business data:", error);
    throw error;
  }
};

// Update business data
export const updateDataUsaha = async (id, data, userEmail) => {
  try {
    const usahaRef = doc(db, COLLECTION_NAME, id);

    const updateData = {
      ...data,
      lastModified: new Date().toISOString(),
      lastModifiedBy: userEmail,
    };

    await updateDoc(usahaRef, updateData);

    // Log activity
    await logActivity("update", "dataUsaha", data.nama || "Unnamed Business", userEmail);

    return {
      id,
      ...updateData,
    };
  } catch (error) {
    console.error("Error updating business data:", error);
    throw error;
  }
};

// Delete business data
export const deleteDataUsaha = async (id, nama, userEmail) => {
  try {
    const usahaRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(usahaRef);

    // Log activity
    await logActivity("delete", "dataUsaha", nama || "Unnamed Business", userEmail);

    return true;
  } catch (error) {
    console.error("Error deleting business data:", error);
    throw error;
  }
};

// Delete all business data
export const deleteAllDataUsaha = async (userEmail) => {
  try {
    const q = query(collection(db, COLLECTION_NAME));
    const querySnapshot = await getDocs(q);
    
    const batch = writeBatch(db);
    querySnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();

    // Log activity
    await logActivity("delete_all", "dataUsaha", "All business data", userEmail);

    return true;
  } catch (error) {
    console.error("Error deleting all business data:", error);
    throw error;
  }
};

// Bulk upload business data
export const bulkUploadDataUsaha = async (dataArray, userEmail) => {
  try {
    const batch = writeBatch(db);
    const collectionRef = collection(db, COLLECTION_NAME);

    dataArray.forEach((data) => {
      const docRef = doc(collectionRef);
      batch.set(docRef, {
        ...data,
        createdAt: new Date().toISOString(),
        createdBy: userEmail,
        lastModified: new Date().toISOString(),
        lastModifiedBy: userEmail,
      });
    });

    await batch.commit();

    // Log activity
    await logActivity("bulk_upload", "dataUsaha", `${dataArray.length} items`, userEmail);

    return true;
  } catch (error) {
    console.error("Error in bulk upload:", error);
    throw error;
  }
};

// Search business data
export const searchDataUsaha = async (searchTerm) => {
  try {
    const q = query(collection(db, COLLECTION_NAME));
    const querySnapshot = await getDocs(q);
    const allData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Client-side filtering
    if (searchTerm) {
      return allData.filter(
        (item) =>
          item.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.jenis?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.pemilik?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.alamat?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return allData;
  } catch (error) {
    console.error("Error searching business data:", error);
    throw error;
  }
};

// Get business by ID
export const getDataUsahaById = async (id) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      };
    } else {
      throw new Error("No such document!");
    }
  } catch (error) {
    console.error("Error getting business by ID:", error);
    throw error;
  }
};

// Get business by type
export const getDataUsahaByType = async (type) => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where("jenis", "==", type),
      orderBy("nama", "asc")
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error getting business by type:", error);
    throw error;
  }
};

// Log activity helper function
const logActivity = async (action, module, item, userEmail) => {
  try {
    const activityData = {
      action: `${action} ${module}`,
      item: item,
      module: module,
      adminEmail: userEmail,
      timestamp: new Date().toISOString(),
    };

    await addDoc(collection(db, "activities"), activityData);
  } catch (error) {
    console.error("Error logging activity:", error);
  }
};
