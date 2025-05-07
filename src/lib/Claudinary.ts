// /lib/cloudinary.ts

export const uploadToCloudinary = async (
    file: File,
    uploadPreset: string = "Blogsapp"
  ): Promise<string> => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", uploadPreset);
    data.append("api_key", "689265731956763");
  
    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/dt3ekhfch/upload", {
        method: "POST",
        body: data,
      });
  
      const result = await res.json();
  
      if (result.secure_url) {
        return result.secure_url as string;
      } else {
        throw new Error("Upload failed: No secure_url returned");
      }
    } catch (error: unknown) {
      console.error("Cloudinary upload error:", error);
      throw error;
    }
  };
  