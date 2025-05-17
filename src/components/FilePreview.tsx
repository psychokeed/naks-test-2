import React, { useState } from 'react';

const FilePreview = () => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const blobUrl = URL.createObjectURL(file);
      setPreviewUrl(blobUrl);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      {previewUrl && <img src={previewUrl} alt="Preview" />}
    </div>
  );
};

export default FilePreview;
