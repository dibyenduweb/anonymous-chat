export const compressImage = (file, maxWidth = 800, quality = 0.7) => {
  return new Promise((resolve, reject) => {
    if (!file.type.match(/image\/(jpeg|jpg|png|webp|gif)/i)) {
      return reject(new Error('Invalid file type. Only JPG, PNG, WEBP, and GIF are allowed.'));
    }
    if (file.size > 2 * 1024 * 1024) {
      return reject(new Error('File size exceeds 2MB limit.'));
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        // Fill white background for JPEG transparency issues
        if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        
        // Compress to JPEG to ensure predictable size, unless it's a GIF (keep as is but resized)
        const mimeType = file.type === 'image/gif' ? 'image/gif' : 'image/jpeg';
        const compressedDataUrl = canvas.toDataURL(mimeType, quality);
        
        // Rough check: Base64 length * 0.75 ≈ bytes. Keep under ~800KB to be safe for Firestore 1MB limit.
        const base64Length = compressedDataUrl.split(',')[1].length;
        const estimatedSizeKB = (base64Length * 0.75) / 1024;
        
        if (estimatedSizeKB > 900) {
          return reject(new Error('Compressed image still too large for Firestore. Please choose a smaller image.'));
        }

        resolve(compressedDataUrl);
      };
      img.onerror = () => reject(new Error('Failed to load image.'));
    };
    reader.onerror = () => reject(new Error('Failed to read file.'));
  });
};