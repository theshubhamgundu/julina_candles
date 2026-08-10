/**
 * Cloudinary unsigned upload utility for frontend image uploads
 */
export const uploadToCloudinary = async (fileOrBase64: File | string): Promise<{ url: string; publicId: string }> => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'bzykgznp';
  const uploadPreset = 'julina_unsigned'; // Or direct unsigned upload

  const formData = new FormData();
  formData.append('file', fileOrBase64);
  formData.append('upload_preset', uploadPreset);
  formData.append('folder', 'julina_candles/products');

  try {
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    if (res.ok && data.secure_url) {
      return {
        url: data.secure_url,
        publicId: data.public_id,
      };
    } else {
      throw new Error(data.error?.message || 'Failed to upload image to Cloudinary');
    }
  } catch (error: any) {
    console.error('Cloudinary Upload Error:', error);
    throw error;
  }
};
