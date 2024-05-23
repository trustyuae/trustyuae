import React, { useState } from 'react';
import { API_URL } from '../redux/constants/Constants';
import { CompressImage } from '../utils/CompressImage';

const ImageUpload = () => {
  const [image, setImage] = useState(null);

  const handleImageChange = async (e) => {
    if (e.target.files[0]) {
      const file = await CompressImage(e?.target.files[0])
      setImage(file);
    }
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('image', image);

    try {
      const response = await fetch(`${API_URL}wp-json/custom-image-upload/v1/upload-image`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        console.log('Image uploaded successfully');
        // Optionally, you can do something after successful upload
      } else {
        console.error('Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <button onClick={handleUpload}>Upload Image</button>
    </div>
  );
};

export default ImageUpload;