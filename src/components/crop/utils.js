/**
 *  Function to download image drawn on canvas
 *
 * @param {HTMLCanvasElement} canvas
 * @param {import('react-image-crop').PixelCrop} crop
 * @returns void
 */
export function generateDownload(canvas, crop) {
    if (!crop || !canvas) {
      return;
    }
  
    canvas.toBlob(
      (blob) => {
        const previewUrl = window.URL.createObjectURL(blob);
  
        const anchor = document.createElement('a');
        anchor.download = 'cropPreview.png';
        anchor.href = URL.createObjectURL(blob);
        anchor.click();
  
        window.URL.revokeObjectURL(previewUrl);
      },
      'image/png',
      1
    );
  }
  
  /**
   * Function to draw cropped image on canvas
   * @param {HTMLImageElement} image
   * @param {HTMLCanvasElement} canvas
   * @param {import('react-image-crop').PixelCrop} crop
   * @returns void
   */
  export function drawImageOnCanvas(image, canvas, crop) {
    if (!crop || !canvas || !image) {
      return;
    }
  
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext('2d');
    // refer https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio
    const pixelRatio = window.devicePixelRatio;
  
    canvas.width = crop.width * pixelRatio * scaleX;
    canvas.height = crop.height * pixelRatio * scaleY;
  
    // refer https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/setTransform
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = 'high';
  
    // refer https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY
    );
  }
  