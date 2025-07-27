const API_KEY = process.env.NEXT_PUBLIC_IMGHIPPO_API_KEY;
const UPLOAD_ENDPOINT = process.env.NEXT_PUBLIC_IMGHIPPO_UPLOAD_ENDPOINT;
const DELETE_ENDPOINT = process.env.NEXT_PUBLIC_IMGHIPPO_DELETE_ENDPOINT;

export const uploadImageToImghippo = async (file, title = "") => {
  try {
    if (!file) {
      throw new Error("No file provided");
    }

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
    formData.append("api_key", API_KEY);
    formData.append("url", imageUrl);

    const response = await fetch(DELETE_ENDPOINT, {
      method: "POST",
      body: formData,
    });

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
  } catch (error) {
    console.error("Error deleting image from Imghippo:", error);
    throw error;
  }
};

export const compressImage = (
  file,
  maxWidth = 1920,
  maxHeight = 1080,
  quality = 0.8
) => {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      let { width, height } = img;

      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;

      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(resolve, "image/jpeg", quality);
    };

    img.src = URL.createObjectURL(file);
  });
};
