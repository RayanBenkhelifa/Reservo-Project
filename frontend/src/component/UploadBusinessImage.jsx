// src/components/UploadBusinessImage.js

import React, { useState } from "react";
import "../styles.css";

function UploadBusinessImage() {
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!image) {
      setMessage("Please select an image to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await fetch("/business/upload-image", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Image uploaded successfully!");
        // Refresh the page or trigger a re-fetch of the image
        window.location.reload();
      } else {
        setMessage(data.message || "Upload failed.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      setMessage("An error occurred during upload.");
    }
  };

  return (
    <div className="upload-image-container">
      <form onSubmit={handleUpload}>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <button type="submit" className="btn">
          Upload Image
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default UploadBusinessImage;
