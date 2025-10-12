import { http } from "@/services/http";

export async function uploadWithCloudinary(file) {
  if (!file || !(file instanceof Blob)) return;
  const formData = new FormData();
  formData.append("file", file);
  formData.append(
    "upload_preset",
    import.meta.env.VITE_CLOUDINARY_CLOUD_PRESET_NAME
  );
  try {
    const url = `https://api.cloudinary.com/v1_1/${
      import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
    }/auto/upload`;
    const response = await http.post(url, formData);
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
}
