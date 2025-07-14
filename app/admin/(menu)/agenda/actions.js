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
  getDoc 
} from "firebase/firestore";
import { db } from "@/firebase/client";

const COLLECTION_NAME = "agenda";

// Log action to Firebase
const logActivity = async (action, item, adminEmail) => {
  try {
    await addDoc(collection(db, "activities"), {
      action: `${action} agenda`,
      item,
      module: "agenda",
      adminEmail,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error logging action:", error);
  }
};

// Get all agenda
export const getAgenda = async () => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      orderBy("tanggal", "asc")
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting agenda:", error);
    throw error;
  }
};

// Add new agenda
export const addAgenda = async (data, userEmail) => {
  try {
    const agendaData = {
      ...data,
      createdAt: new Date().toISOString(),
      createdBy: userEmail,
      lastModified: new Date().toISOString(),
      lastModifiedBy: userEmail,
    };

    const docRef = await addDoc(collection(db, COLLECTION_NAME), agendaData);

    // Log activity
    await logActivity("create", data.judul, userEmail);

    return {
      id: docRef.id,
      ...agendaData,
    };
  } catch (error) {
    console.error("Error adding agenda:", error);
    throw error;
  }
};

// Update agenda
export const updateAgenda = async (id, data, userEmail) => {
  try {
    // Ensure id is a string
    const documentId = String(id);
    const agendaRef = doc(db, COLLECTION_NAME, documentId);

    const updateData = {
      ...data,
      lastModified: new Date().toISOString(),
      lastModifiedBy: userEmail,
    };

    await updateDoc(agendaRef, updateData);

    // Log activity
    await logActivity("update", data.judul, userEmail);

    return {
      id,
      ...updateData,
    };
  } catch (error) {
    console.error("Error updating agenda:", error);
    throw error;
  }
};

// Delete agenda
export const deleteAgenda = async (id, judul, userEmail) => {
  try {
    // Ensure id is a string
    const documentId = String(id);
    const agendaRef = doc(db, COLLECTION_NAME, documentId);
    await deleteDoc(agendaRef);

    // Log activity
    await logActivity("delete", judul, userEmail);

    return true;
  } catch (error) {
    console.error("Error deleting agenda:", error);
    throw error;
  }
};

// Get agenda by ID
export const getAgendaById = async (id) => {
  try {
    // Ensure id is a string
    const documentId = String(id);
    const agendaRef = doc(db, COLLECTION_NAME, documentId);
    const agendaDoc = await getDoc(agendaRef);
    
    if (agendaDoc.exists()) {
      return {
        id: agendaDoc.id,
        ...agendaDoc.data(),
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting agenda by ID:", error);
    throw error;
  }
};

// Search agenda
export const searchAgenda = async (searchTerm, kategori = null) => {
  try {
    let q;

    if (kategori) {
      q = query(
        collection(db, COLLECTION_NAME),
        where("kategori", "==", kategori),
        orderBy("tanggal", "asc")
      );
    } else {
      q = query(
        collection(db, COLLECTION_NAME),
        orderBy("tanggal", "asc")
      );
    }

    const querySnapshot = await getDocs(q);
    const allAgenda = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Filter by search term (client-side filtering)
    if (searchTerm) {
      const filtered = allAgenda.filter(
        (agenda) =>
          (agenda.judul && agenda.judul.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (agenda.deskripsi && agenda.deskripsi.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (agenda.tempat && agenda.tempat.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (agenda.penyelenggara && agenda.penyelenggara.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      return filtered;
    }

    return allAgenda;
  } catch (error) {
    console.error("Error searching agenda:", error);
    throw error;
  }
};

// Get agenda by category
export const getAgendaByCategory = async (kategori) => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where("kategori", "==", kategori),
      orderBy("tanggal", "asc")
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error getting agenda by category:", error);
    throw error;
  }
};

// Get agenda by status
export const getAgendaByStatus = async (status) => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where("status", "==", status),
      orderBy("tanggal", "asc")
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error getting agenda by status:", error);
    throw error;
  }
};

// Update agenda status (for completion toggle)
export const updateAgendaStatus = async (id, status, userEmail) => {
  try {
    // Ensure id is a string
    const documentId = String(id);
    const agendaRef = doc(db, COLLECTION_NAME, documentId);
    
    const updateData = {
      status,
      lastModified: new Date().toISOString(),
      lastModifiedBy: userEmail,
    };

    await updateDoc(agendaRef, updateData);

    // Log activity
    await logActivity(status === "completed" ? "complete" : "uncomplete", `agenda status`, userEmail);

    return {
      id,
      ...updateData,
    };
  } catch (error) {
    console.error("Error updating agenda status:", error);
    throw error;
  }
};

// Get upcoming agenda (not completed and future dates)
export const getUpcomingAgenda = async (limitCount = 10) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const q = query(
      collection(db, COLLECTION_NAME),
      where("tanggal", ">=", today),
      where("status", "!=", "completed"),
      orderBy("tanggal", "asc")
    );

    const querySnapshot = await getDocs(q);
    const agendaList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return agendaList.slice(0, limitCount);
  } catch (error) {
    console.error("Error getting upcoming agenda:", error);
    throw error;
  }
};
