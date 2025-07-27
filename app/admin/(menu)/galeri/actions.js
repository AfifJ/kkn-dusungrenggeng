import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
  getDoc,
  where,
} from "firebase/firestore";
import { db } from "@/firebase/client";

const COLLECTION_NAME = "galeri";

// Upload image to ImgHippo
export const uploadImageToImghippo = async (file, title = "") => {
  try {
    if (!file) {
      throw new Error("No file provided");
    }

    const API_KEY = process.env.NEXT_PUBLIC_IMGHIPPO_API_KEY;
    const UPLOAD_ENDPOINT = process.env.NEXT_PUBLIC_IMGHIPPO_UPLOAD_ENDPOINT;

    const formData = new FormData();
    formData.append("api_key", API_KEY);
    formData.append("file", file);
    if (title) formData.append("title", title);

    const response = await fetch(UPLOAD_ENDPOINT, {
      method: "POST",
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

    const API_KEY = process.env.NEXT_PUBLIC_IMGHIPPO_API_KEY;
    const DELETE_ENDPOINT = process.env.NEXT_PUBLIC_IMGHIPPO_UPLOAD_ENDPOINT;

    const formData = new FormData();
    formData.append("api_key", API_KEY);
    formData.append("url", imageUrl);

    const response = await fetch(DELETE_ENDPOINT, {
      method: "POST",
      body: formData,
    });

    // Handle 404 - delete endpoint might not exist
    if (response.status === 404) {
      console.warn(
        "Delete endpoint not found - image might have been deleted already"
      );
      return { success: true, message: "Image delete endpoint not found" };
    }

    // Check if response is ok
    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      return {
        success: false,
        message: `HTTP error! status: ${response.status}`,
      };
    }

    const contentType = response.headers.get("content-type");

    // Check if response is JSON
    if (contentType && contentType.includes("application/json")) {
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

// Log action to Firebase
const logAction = async (action, item, adminEmail) => {
  try {
    await addDoc(collection(db, "activities"), {
      action,
      item,
      module: "galeri",
      adminEmail,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error logging action:", error);
  }
};

// Get all galeri
export const getGaleri = async () => {
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
    console.error("Error getting galeri:", error);
    throw error;
  }
};

// Add new galeri with image
export const addGaleriWithImage = async (data, imageFile, userEmail) => {
  let imageData = null;

  try {
    // Upload image if provided
    if (imageFile) {
      imageData = await uploadImageToImghippo(imageFile, data.judul);
    }

    // Prepare galeri data
    const galeriData = {
      ...data,
      gambar: imageData?.url || "",
      gambarDeleteUrl: imageData?.deleteUrl || "",
      imageSize: imageData?.size || null,
      imageExtension: imageData?.extension || null,
      createdAt: new Date().toISOString(),
      createdBy: userEmail,
      lastModified: new Date().toISOString(),
      lastModifiedBy: userEmail,
    };

    const docRef = await addDoc(collection(db, COLLECTION_NAME), galeriData);

    // Log activity
    await logAction("create", "galeri", data.judul, userEmail);

    return {
      id: docRef.id,
      ...galeriData,
    };
  } catch (error) {
    // If galeri creation fails but image was uploaded, try to delete the image
    if (imageData?.deleteUrl) {
      await deleteImageFromImghippo(imageData.deleteUrl);
    }
    console.error("Error adding galeri with image:", error);
    throw error;
  }
};

// Update galeri with image
export const updateGaleriWithImage = async (id, data, imageFile, userEmail) => {
  let imageData = null;
  let oldImageUrl = null;

  try {
    // Get current galeri data to check for existing image
    const galeriRef = doc(db, COLLECTION_NAME, id);
    const galeriDoc = await getDoc(galeriRef);

    if (galeriDoc.exists()) {
      const currentData = galeriDoc.data();
      oldImageUrl = currentData.gambarDeleteUrl;
    }

    // Upload new image if provided
    if (imageFile) {
      imageData = await uploadImageToImghippo(imageFile, data.judul);

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
      updateData.imageSize = imageData.size;
      updateData.imageExtension = imageData.extension;
    }

    await updateDoc(galeriRef, updateData);

    // Log activity
    await logAction("update", "galeri", data.judul, userEmail);

    return {
      id,
      ...updateData,
    };
  } catch (error) {
    // If update fails but new image was uploaded, try to delete the new image
    if (imageData?.deleteUrl) {
      await deleteImageFromImghippo(imageData.deleteUrl);
    }
    console.error("Error updating galeri with image:", error);
    throw error;
  }
};

// Delete galeri with image cleanup
export const deleteGaleriWithImage = async (id, judul, userEmail) => {
  try {
    // Get galeri data to check for existing image
    const galeriRef = doc(db, COLLECTION_NAME, id);
    const galeriDoc = await getDoc(galeriRef);

    let oldImageUrl = null;
    if (galeriDoc.exists()) {
      const currentData = galeriDoc.data();
      oldImageUrl = currentData.gambarDeleteUrl;
    }

    // Delete galeri document
    await deleteDoc(galeriRef);

    // Delete image if exists
    if (oldImageUrl) {
      await deleteImageFromImghippo(oldImageUrl);
    }

    // Log activity
    await logAction("delete", "galeri", judul, userEmail);

    return true;
  } catch (error) {
    console.error("Error deleting galeri with image:", error);
    throw error;
  }
};

// Search galeri
export const searchGaleri = async (searchTerm, kategori = null) => {
  try {
    let q;

    if (kategori) {
      q = query(
        collection(db, COLLECTION_NAME),
        where("kategori", "==", kategori),
        orderBy("createdAt", "desc")
      );
    } else {
      q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"));
    }

    const querySnapshot = await getDocs(q);
    const allGaleri = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Filter by search term (client-side filtering)
    if (searchTerm) {
      const filtered = allGaleri.filter(
        (galeri) =>
          galeri.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
          galeri.deskripsi.toLowerCase().includes(searchTerm.toLowerCase()) ||
          galeri.tags.toLowerCase().includes(searchTerm.toLowerCase())
      );
      return filtered;
    }

    return allGaleri;
  } catch (error) {
    console.error("Error searching galeri:", error);
    throw error;
  }
};

// Get galeri by category
export const getGaleriByCategory = async (kategori) => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where("kategori", "==", kategori),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error getting galeri by category:", error);
    throw error;
  }
};
