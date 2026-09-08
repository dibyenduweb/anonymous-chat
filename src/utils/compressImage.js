export const compressImage = (file, maxWidth = 800, quality = 0.7) => {
  return new Promise((resolve, reject) => {
    if (!file.type.match(/image\/(jpeg|jpg|png|webp|gif)/i)) {
      return reject(new Error('Invalid file type. Only JPG, PNG, WEBP, and GIF are allowed.'));
    }
    if (file.size > 2 * 1024 * 1024) {
      return reject(new Error('File size exceeds 2MB limit.'));
    }

    const estimateKB = (dataUrl) => (dataUrl.split(',')[1].length * 0.75) / 1024;

    const readDataURL = (callback) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => callback(reader.result);
      reader.onerror = () => reject(new Error('Failed to read file.'));
    };

    // Animated GIFs can't be resized with <canvas> (it would flatten them to a
    // single frame), so preserve the original data URL and just enforce the
    // Firestore 1MB document limit.
    if (file.type === 'image/gif') {
      readDataURL((dataUrl) => {
        if (estimateKB(dataUrl) > 900) {
          return reject(new Error('GIF still too large for Firestore. Please choose a smaller GIF.'));
        }
        resolve(dataUrl);
      });
      return;
    }

    readDataURL((dataUrl) => {
      const img = new Image();
      img.src = dataUrl;
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

        // Compress to JPEG to ensure predictable size.
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);

        if (estimateKB(compressedDataUrl) > 900) {
          return reject(new Error('Compressed image still too large for Firestore. Please choose a smaller image.'));
        }

        resolve(compressedDataUrl);
      };
      img.onerror = () => reject(new Error('Failed to load image.'));
    });
  });
};
