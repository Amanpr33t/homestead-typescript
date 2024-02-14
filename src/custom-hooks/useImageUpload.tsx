import {  useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

interface ImageType {
  file: string;
  upload: File;
}

interface UploadResult {
  uploadImages: (images: ImageType[] | null) => Promise<string[]>;
}

const useUploadImages = (): UploadResult => {
  const cloudinaryCloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
  const navigate = useNavigate();

  const uploadImages = useCallback(async (images: ImageType[] | null) => {
    if (!cloudinaryCloudName) {
      navigate('/field-agent');
      throw new Error('Cloud name not found');
    }

    if (images) {
      try {
        const uploadPromises = images.map(async (image) => {
          const formData = new FormData();
          formData.append('file', image.upload);
          formData.append('upload_preset', 'homestead');
          formData.append('cloud_name', cloudinaryCloudName as string);
          const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`, {
            method: 'post',
            body: formData
          });
          const data = await response.json();
          if (response.ok && data && data.secure_url) { // Check if response is OK
            return data.secure_url;
          } else {
            throw new Error('Upload failed');
          }
        });
        const uploadedUrls = await Promise.all(uploadPromises);
        return uploadedUrls;
      } catch (error) {
        throw new Error('Upload failed');
      }
    } else {
      throw new Error('No images provided');
    }
  }, [cloudinaryCloudName, navigate]);

  return { uploadImages };
};

export default useUploadImages;
