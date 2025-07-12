import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/firebase/client";

const ACTIVITIES_COLLECTION = "activities";

// Add new activity log
export const logActivity = async (action, module, item, userEmail) => {
  try {
    const activityData = {
      action: `${action} ${module}`,
      item: item,
      module: module,
      adminEmail: userEmail,
      timestamp: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    const docRef = await addDoc(collection(db, ACTIVITIES_COLLECTION), activityData);
    
    return {
      id: docRef.id,
      ...activityData,
    };
  } catch (error) {
    console.error("Error logging activity:", error);
    throw error;
  }
};

// Get all activity logs with pagination
export const getActivityLogs = async (limitCount = 50) => {
  try {
    const q = query(
      collection(db, ACTIVITIES_COLLECTION),
      orderBy("timestamp", "desc"),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error getting activity logs:", error);
    throw error;
  }
};

// Get recent activity logs for dashboard
export const getRecentActivityLogs = async (limitCount = 10) => {
  try {
    const q = query(
      collection(db, ACTIVITIES_COLLECTION),
      orderBy("timestamp", "desc"),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error getting recent activity logs:", error);
    throw error;
  }
};

// Get activity logs by module
export const getActivityLogsByModule = async (module, limitCount = 20) => {
  try {
    const q = query(
      collection(db, ACTIVITIES_COLLECTION),
      where("module", "==", module),
      orderBy("timestamp", "desc"),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error getting activity logs by module:", error);
    throw error;
  }
};

// Get activity logs by user
export const getActivityLogsByUser = async (userEmail, limitCount = 20) => {
  try {
    const q = query(
      collection(db, ACTIVITIES_COLLECTION),
      where("adminEmail", "==", userEmail),
      orderBy("timestamp", "desc"),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error getting activity logs by user:", error);
    throw error;
  }
};

// Delete old activity logs (cleanup function)
export const deleteOldActivityLogs = async (daysOld = 30) => {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);
    
    const q = query(
      collection(db, ACTIVITIES_COLLECTION),
      where("timestamp", "<", cutoffDate.toISOString())
    );
    
    const querySnapshot = await getDocs(q);
    
    const deletePromises = querySnapshot.docs.map((docSnapshot) =>
      deleteDoc(doc(db, ACTIVITIES_COLLECTION, docSnapshot.id))
    );
    
    await Promise.all(deletePromises);
    
    return querySnapshot.docs.length;
  } catch (error) {
    console.error("Error deleting old activity logs:", error);
    throw error;
  }
};

// Search activity logs
export const searchActivityLogs = async (searchTerm, module = null, limitCount = 50) => {
  try {
    let q;
    
    if (module) {
      q = query(
        collection(db, ACTIVITIES_COLLECTION),
        where("module", "==", module),
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
    const allLogs = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    
    // Filter by search term (client-side filtering)
    if (searchTerm) {
      const filtered = allLogs.filter(
        (log) =>
          log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.adminEmail.toLowerCase().includes(searchTerm.toLowerCase())
      );
      return filtered;
    }
    
    return allLogs;
  } catch (error) {
    console.error("Error searching activity logs:", error);
    throw error;
  }
};

// Get activity statistics
export const getActivityStats = async () => {
  try {
    const q = query(
      collection(db, ACTIVITIES_COLLECTION),
      orderBy("timestamp", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    const allLogs = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    
    // Calculate statistics
    const stats = {
      total: allLogs.length,
      today: 0,
      thisWeek: 0,
      thisMonth: 0,
      byModule: {},
      byUser: {},
    };
    
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    
    allLogs.forEach((log) => {
      const logDate = new Date(log.timestamp);
      
      // Count by time periods
      if (logDate >= todayStart) stats.today++;
      if (logDate >= weekStart) stats.thisWeek++;
      if (logDate >= monthStart) stats.thisMonth++;
      
      // Count by module
      if (stats.byModule[log.module]) {
        stats.byModule[log.module]++;
      } else {
        stats.byModule[log.module] = 1;
      }
      
      // Count by user
      if (stats.byUser[log.adminEmail]) {
        stats.byUser[log.adminEmail]++;
      } else {
        stats.byUser[log.adminEmail] = 1;
      }
    });
    
    return stats;
  } catch (error) {
    console.error("Error getting activity statistics:", error);
    throw error;
  }
};
