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

const COLLECTION_NAME = "berita";

// Get all berita
export const getBerita = async () => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      orderBy("tanggal", "desc")
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error getting berita:", error);
    throw error;
  }
};

// Get published berita only
export const getPublishedBerita = async () => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where("status", "==", "published"),
      orderBy("tanggal", "desc")
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error getting published berita:", error);
    throw error;
  }
};

// Add new berita
export const addBerita = async (data, userEmail) => {
  try {
    const beritaData = {
      ...data,
      createdAt: new Date().toISOString(),
      createdBy: userEmail,
      lastModified: new Date().toISOString(),
      lastModifiedBy: userEmail,
    };

    const docRef = await addDoc(collection(db, COLLECTION_NAME), beritaData);

    // Log activity
    await logActivity("create", "berita", data.judul, userEmail);

    return {
      id: docRef.id,
      ...beritaData,
    };
  } catch (error) {
    console.error("Error adding berita:", error);
    throw error;
  }
};

// Update berita
export const updateBerita = async (id, data, userEmail) => {
  try {
    const beritaRef = doc(db, COLLECTION_NAME, id);

    const updateData = {
      ...data,
      lastModified: new Date().toISOString(),
      lastModifiedBy: userEmail,
    };

    await updateDoc(beritaRef, updateData);

    // Log activity
    await logActivity("update", "berita", data.judul, userEmail);

    return {
      id,
      ...updateData,
    };
  } catch (error) {
    console.error("Error updating berita:", error);
    throw error;
  }
};

// Delete berita
export const deleteBerita = async (id, judul, userEmail) => {
  try {
    const beritaRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(beritaRef);

    // Log activity
    await logActivity("delete", "berita", judul, userEmail);

    return true;
  } catch (error) {
    console.error("Error deleting berita:", error);
    throw error;
  }
};

// Search berita
export const searchBerita = async (searchTerm, category = null) => {
  try {
    let q;

    if (category) {
      q = query(
        collection(db, COLLECTION_NAME),
        where("kategori", "==", category),
        orderBy("tanggal", "desc")
      );
    } else {
      q = query(collection(db, COLLECTION_NAME), orderBy("tanggal", "desc"));
    }

    const querySnapshot = await getDocs(q);
    const allBerita = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Filter by search term (client-side filtering)
    if (searchTerm) {
      return allBerita.filter(
        (berita) =>
          berita.judul?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          berita.konten?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          berita.kategori?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return allBerita;
  } catch (error) {
    console.error("Error searching berita:", error);
    throw error;
  }
};

// Get berita by category
export const getBeritaByCategory = async (category) => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where("kategori", "==", category),
      where("status", "==", "published"),
      orderBy("tanggal", "desc")
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error getting berita by category:", error);
    throw error;
  }
};

// Get latest berita (for homepage)
export const getLatestBerita = async (limit = 3) => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where("status", "==", "published"),
      orderBy("tanggal", "desc"),
      limit(limit)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error getting latest berita:", error);
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

// Upload image to Imghippo
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

// Delete image from Imghippo
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
      console.warn("Delete endpoint not found (404) - image deletion not supported by API");
      return {
        success: false,
        message: "Image deletion not supported by API",
        error: "Endpoint not found",
      };
    }

    // Check if response is ok
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const contentType = response.headers.get('content-type');
    
    // Check if response is JSON
    if (contentType && contentType.includes('application/json')) {
      const result = await response.json();
      
      if (result.status === 200) {
        return {
          success: true,
          message: result.message,
          deletedUrl: result.deleted_url,
        };
      } else {
        throw new Error(result.message || "Delete failed");
      }
    } else {
      // If not JSON, get text response for debugging
      const textResponse = await response.text();
      console.error("Non-JSON response received:", textResponse);
      
      // Check if the response indicates success (sometimes APIs return HTML on success)
      if (textResponse.includes('deleted successfully') || textResponse.includes('File deleted')) {
        return {
          success: true,
          message: "Image deleted successfully",
          deletedUrl: imageUrl,
        };
      }
      
      throw new Error("Invalid response format - expected JSON but got HTML");
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

// Replace existing image upload functions
export const uploadImageToFreeimage = uploadImageToImghippo;
export const deleteImageFromFreeimage = deleteImageFromImghippo;

// Update berita with image upload using Imghippo
export const addBeritaWithImage = async (data, imageFile, userEmail) => {
  let imageData = null;
  
  try {
    // Upload image if provided
    if (imageFile) {
      imageData = await uploadImageToImghippo(imageFile, data.judul);
    }

    // Prepare berita data
    const beritaData = {
      ...data,
      gambar: imageData ? imageData.url : data.gambar || "",
      imageTitle: imageData ? imageData.title : "",
      imageSize: imageData ? imageData.size : 0,
      imageExtension: imageData ? imageData.extension : "",
      viewUrl: imageData ? imageData.viewUrl : "",
      deleteUrl: imageData ? imageData.deleteUrl : "",
      createdAt: new Date().toISOString(),
      createdBy: userEmail,
      lastModified: new Date().toISOString(),
      lastModifiedBy: userEmail,
    };

    // Save to Firestore
    const docRef = await addDoc(collection(db, COLLECTION_NAME), beritaData);

    // Log activity
    await logActivity("create", "berita", data.judul, userEmail);

    return {
      id: docRef.id,
      ...beritaData,
    };
  } catch (error) {
    console.error("Error adding berita with image:", error);
    throw error;
  }
};

// Update berita with image upload using Imghippo
export const updateBeritaWithImage = async (id, data, imageFile, userEmail) => {
  let imageData = null;
  let oldImageUrl = null;

  try {
    // Get current berita data to check for existing image
    const currentBerita = await getBeritaById(id);
    if (currentBerita?.gambar) {
      oldImageUrl = currentBerita.gambar;
    }

    // Upload new image if provided
    if (imageFile) {
      imageData = await uploadImageToImghippo(imageFile, data.judul);
    }

    // Prepare update data
    const updateData = {
      ...data,
      ...(imageData && {
        gambar: imageData.url,
        imageTitle: imageData.title,
        imageSize: imageData.size,
        imageExtension: imageData.extension,
        viewUrl: imageData.viewUrl,
        deleteUrl: imageData.deleteUrl,
      }),
      lastModified: new Date().toISOString(),
      lastModifiedBy: userEmail,
    };

    // Update in Firestore
    const beritaRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(beritaRef, updateData);

    // Delete old image if new image was uploaded and old image exists
    if (imageData && oldImageUrl) {
      const deleteResult = await deleteImageFromImghippo(oldImageUrl);
      if (deleteResult.success) {
        console.log("Old image deleted successfully:", oldImageUrl);
      } else {
        console.warn("Could not delete old image:", oldImageUrl, deleteResult.message);
      }
    }

    // Log activity
    await logActivity("update", "berita", data.judul, userEmail);

    return {
      id,
      ...updateData,
    };
  } catch (error) {
    console.error("Error updating berita with image:", error);
    // If new image was uploaded but update failed, try to clean up the new image
    if (imageData?.url) {
      const cleanupResult = await deleteImageFromImghippo(imageData.url);
      if (cleanupResult.success) {
        console.log("Cleaned up new image due to update failure:", imageData.url);
      } else {
        console.warn("Could not clean up new image:", cleanupResult.message);
      }
    }
    throw error;
  }
};

// Get berita by ID
export const getBeritaById = async (id) => {
  try {
    const beritaDoc = await getDoc(doc(db, COLLECTION_NAME, id));
    if (beritaDoc.exists()) {
      return {
        id: beritaDoc.id,
        ...beritaDoc.data(),
      };
    }
    return null;
  } catch (error) {
    console.error("Error getting berita by ID:", error);
    throw error;
  }
};

// Delete berita with image cleanup using Imghippo
export const deleteBeritaWithImage = async (id, judul, userEmail) => {
  try {
    // Get berita data first to check for image
    const beritaData = await getBeritaById(id);

    // Delete from Firestore first
    const beritaRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(beritaRef);

    // Delete associated image if exists
    if (beritaData?.gambar) {
      const deleteResult = await deleteImageFromImghippo(beritaData.gambar);
      if (deleteResult.success) {
        console.log("Associated image deleted successfully:", beritaData.gambar);
      } else {
        console.warn("Could not delete associated image:", beritaData.gambar, deleteResult.message);
      }
    }

    // Log activity
    await logActivity("delete", "berita", judul, userEmail);

    return true;
  } catch (error) {
    console.error("Error deleting berita with image:", error);
    throw error;
  }
};
