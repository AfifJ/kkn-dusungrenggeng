const API_KEY = process.env.NEXT_PUBLIC_IMGHIPPO_API_KEY;
const UPLOAD_ENDPOINT = process.env.NEXT_PUBLIC_IMGHIPPO_UPLOAD_ENDPOINT;
const DELETE_ENDPOINT = process.env.NEXT_PUBLIC_IMGHIPPO_DELETE_ENDPOINT;

export const uploadImageToImghippo = async (file, title = '') => {
  try {
    if (!file) {
      throw new Error("No file provided");
    }

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
        deleteUrl: result.data.url, // Store for potential deletion
      };
    } else {
      throw new Error(result.message || "Upload failed");
    }
  } catch (error) {
    console.error("Error uploading image to Imghippo:", error);
    throw error;
  }
};

export const deleteImageFromImghippo = async (imageUrl) => {
  try {
    if (!imageUrl) {
      console.warn("No image URL provided for deletion");
      return { success: true, message: "No image URL to process" };
    }

    const formData = new FormData();
    formData.append('api_key', API_KEY);
    formData.append('url', imageUrl);

    const response = await fetch(DELETE_ENDPOINT, {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (result.success) {
      return {
        success: true,
        message: "Image deleted successfully",
      };
    } else {
      throw new Error(result.message || "Delete failed");
    }
  } catch (error) {
    console.error("Error deleting image from Imghippo:", error);
    throw error;
  }
};

// Utility function to validate image files
export const validateImageFile = (file) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!allowedTypes.includes(file.type)) {
    throw new Error("Format file tidak didukung. Gunakan JPEG, PNG, GIF, atau WebP.");
  }

  if (file.size > maxSize) {
    throw new Error("Ukuran file terlalu besar. Maksimal 5MB.");
  }

  return true;
};

// Utility function to generate unique filename
export const generateUniqueFilename = (originalName, prefix = 'background') => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const extension = originalName.split('.').pop();
  return `${prefix}-${timestamp}-${randomString}.${extension}`;
};
