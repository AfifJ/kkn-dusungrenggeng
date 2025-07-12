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
  limit,
} from "firebase/firestore";
import { db } from "@/firebase/client";

const COLLECTION_NAME = "produk";

// Upload image to ImgHippo
export const uploadImageToImghippo = async (file, title = '') => {
  try {
    if (!file) {
      throw new Error("No file provided");
    }

    const API_KEY = process.env.NEXT_PUBLIC_IMGHIPPO_API_KEY || '0f9a78dcc8d06f6cde2641718afaad7c';
    const UPLOAD_ENDPOINT = 'https://api.imghippo.com/v1/upload';

    const formData = new FormData();
    formData.append('api_key', API_KEY);
    formData.append('file', file);
    if (title) formData.append('title', title);

    const response = await fetch(UPLOAD_ENDPOINT, {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (result.success) {
      return {
        url: result.data.url,
        viewUrl: result.data.view_url,
        title: result.data.title,
        size: result.data.size,
        extension: result.data.extension,
        createdAt: result.data.created_at,
        deleteUrl: result.data.url,
      };
    } else {
      throw new Error(result.message || "Upload failed");
    }
  } catch (error) {
    console.error("Error uploading image to Imghippo:", error);
    throw error;
  }
};

// Delete image from ImgHippo
export const deleteImageFromImghippo = async (imageUrl) => {
  try {
    if (!imageUrl) {
      console.warn("No image URL provided for deletion");
      return { success: true, message: "No image URL to process" };
    }

    const API_KEY = process.env.NEXT_PUBLIC_IMGHIPPO_API_KEY || '0f9a78dcc8d06f6cde2641718afaad7c';
    const DELETE_ENDPOINT = 'https://api.imghippo.com/v1/delete';

    const formData = new FormData();
    formData.append('api_key', API_KEY);
    formData.append('url', imageUrl);

    const response = await fetch(DELETE_ENDPOINT, {
      method: 'POST',
      body: formData,
    });

    // Handle 404 - delete endpoint might not exist
    if (response.status === 404) {
      console.warn("Delete endpoint not found - image might have been deleted already");
      return { success: true, message: "Image delete endpoint not found" };
    }

    // Check if response is ok
    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      return { success: false, message: `HTTP error! status: ${response.status}` };
    }

    const contentType = response.headers.get('content-type');
    
    // Check if response is JSON
    if (contentType && contentType.includes('application/json')) {
      const result = await response.json();
      return {
        success: true,
        message: result.message || "Image deleted successfully",
        data: result,
      };
    } else {
      // Handle non-JSON response
      const text = await response.text();
      return {
        success: true,
        message: "Image deleted successfully",
        data: text,
      };
    }
  } catch (error) {
    console.error("Error deleting image from Imghippo:", error);
    
    // Return a warning instead of throwing error to avoid breaking main operations
    return {
      success: false,
      message: `Could not delete image: ${error.message}`,
      error: error.message,
    };
  }
};

// Get all produk
export const getProduk = async () => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error getting produk:", error);
    throw error;
  }
};

// Get published produk only
export const getPublishedProduk = async () => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where("status", "==", "tersedia"),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error getting published produk:", error);
    throw error;
  }
};

// Add new produk
export const addProduk = async (data, userEmail) => {
  try {
    const produkData = {
      ...data,
      createdAt: new Date().toISOString(),
      createdBy: userEmail,
      lastModified: new Date().toISOString(),
      lastModifiedBy: userEmail,
    };

    const docRef = await addDoc(collection(db, COLLECTION_NAME), produkData);

    // Log activity
    await logActivity("create", "produk", data.nama, userEmail);

    return {
      id: docRef.id,
      ...produkData,
    };
  } catch (error) {
    console.error("Error adding produk:", error);
    throw error;
  }
};

// Update produk
export const updateProduk = async (id, data, userEmail) => {
  try {
    const produkRef = doc(db, COLLECTION_NAME, id);

    const updateData = {
      ...data,
      lastModified: new Date().toISOString(),
      lastModifiedBy: userEmail,
    };

    await updateDoc(produkRef, updateData);

    // Log activity
    await logActivity("update", "produk", data.nama, userEmail);

    return {
      id,
      ...updateData,
    };
  } catch (error) {
    console.error("Error updating produk:", error);
    throw error;
  }
};

// Delete produk
export const deleteProduk = async (id, nama, userEmail) => {
  try {
    const produkRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(produkRef);

    // Log activity
    await logActivity("delete", "produk", nama, userEmail);

    return true;
  } catch (error) {
    console.error("Error deleting produk:", error);
    throw error;
  }
};

// Search produk
export const searchProduk = async (searchTerm, kategori = null) => {
  try {
    let q;

    if (kategori) {
      q = query(
        collection(db, COLLECTION_NAME),
        where("kategori", "==", kategori),
        orderBy("createdAt", "desc")
      );
    } else {
      q = query(
        collection(db, COLLECTION_NAME),
        orderBy("createdAt", "desc")
      );
    }

    const querySnapshot = await getDocs(q);
    const allProduk = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Filter by search term (client-side filtering)
    if (searchTerm) {
      const filtered = allProduk.filter(
        (produk) =>
          produk.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
          produk.deskripsi.toLowerCase().includes(searchTerm.toLowerCase()) ||
          produk.penjual.toLowerCase().includes(searchTerm.toLowerCase())
      );
      return filtered;
    }

    return allProduk;
  } catch (error) {
    console.error("Error searching produk:", error);
    throw error;
  }
};

// Get produk by category
export const getProdukByCategory = async (kategori) => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where("kategori", "==", kategori),
      where("status", "==", "tersedia"),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error getting produk by category:", error);
    throw error;
  }
};

// Get latest produk (for homepage)
export const getLatestProduk = async (limitCount = 6) => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where("status", "==", "tersedia"),
      orderBy("createdAt", "desc"),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error getting latest produk:", error);
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
    // Don't throw error here to avoid breaking main operation
  }
};

// Add produk with image upload using Imghippo
export const addProdukWithImage = async (data, imageFile, userEmail) => {
  let imageData = null;
  
  try {
    // Upload image if provided
    if (imageFile) {
      imageData = await uploadImageToImghippo(imageFile, data.nama);
    }

    // Prepare produk data
    const produkData = {
      ...data,
      gambar: imageData?.url || "",
      gambarDeleteUrl: imageData?.deleteUrl || "",
      createdAt: new Date().toISOString(),
      createdBy: userEmail,
      lastModified: new Date().toISOString(),
      lastModifiedBy: userEmail,
    };

    const docRef = await addDoc(collection(db, COLLECTION_NAME), produkData);

    // Log activity
    await logActivity("create", "produk", data.nama, userEmail);

    return {
      id: docRef.id,
      ...produkData,
    };
  } catch (error) {
    // If produk creation fails but image was uploaded, try to delete the image
    if (imageData?.deleteUrl) {
      await deleteImageFromImghippo(imageData.deleteUrl);
    }
    console.error("Error adding produk with image:", error);
    throw error;
  }
};

// Update produk with image upload using Imghippo
export const updateProdukWithImage = async (id, data, imageFile, userEmail) => {
  let imageData = null;
  let oldImageUrl = null;

  try {
    // Get current produk data to check for existing image
    const produkRef = doc(db, COLLECTION_NAME, id);
    const produkDoc = await getDoc(produkRef);
    
    if (produkDoc.exists()) {
      const currentData = produkDoc.data();
      oldImageUrl = currentData.gambarDeleteUrl;
    }

    // Upload new image if provided
    if (imageFile) {
      imageData = await uploadImageToImghippo(imageFile, data.nama);
      
      // Delete old image if exists
      if (oldImageUrl) {
        await deleteImageFromImghippo(oldImageUrl);
      }
    }

    // Prepare update data
    const updateData = {
      ...data,
      lastModified: new Date().toISOString(),
      lastModifiedBy: userEmail,
    };

    // Add image data if new image was uploaded
    if (imageData) {
      updateData.gambar = imageData.url;
      updateData.gambarDeleteUrl = imageData.deleteUrl;
    }

    await updateDoc(produkRef, updateData);

    // Log activity
    await logActivity("update", "produk", data.nama, userEmail);

    return {
      id,
      ...updateData,
    };
  } catch (error) {
    // If update fails but new image was uploaded, try to delete the new image
    if (imageData?.deleteUrl) {
      await deleteImageFromImghippo(imageData.deleteUrl);
    }
    console.error("Error updating produk with image:", error);
    throw error;
  }
};

// Get produk by ID
export const getProdukById = async (id) => {
  try {
    const produkRef = doc(db, COLLECTION_NAME, id);
    const produkDoc = await getDoc(produkRef);
    
    if (produkDoc.exists()) {
      return {
        id: produkDoc.id,
        ...produkDoc.data(),
      };
    } else {
      throw new Error("Produk not found");
    }
  } catch (error) {
    console.error("Error getting produk by ID:", error);
    throw error;
  }
};

// Delete produk with image cleanup using Imghippo
export const deleteProdukWithImage = async (id, nama, userEmail) => {
  try {
    // Get produk data to check for existing image
    const produkRef = doc(db, COLLECTION_NAME, id);
    const produkDoc = await getDoc(produkRef);
    
    let oldImageUrl = null;
    if (produkDoc.exists()) {
      const currentData = produkDoc.data();
      oldImageUrl = currentData.gambarDeleteUrl;
    }

    // Delete produk document
    await deleteDoc(produkRef);

    // Delete image if exists
    if (oldImageUrl) {
      await deleteImageFromImghippo(oldImageUrl);
    }

    // Log activity
    await logActivity("delete", "produk", nama, userEmail);

    return true;
  } catch (error) {
    console.error("Error deleting produk with image:", error);
    throw error;
  }
};
