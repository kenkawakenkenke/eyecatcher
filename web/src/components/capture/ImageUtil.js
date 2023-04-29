
export async function getImageDimensions(dataUrl) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = dataUrl;
        img.onload = () => {
            resolve({ width: img.width, height: img.height });
        };
        img.onerror = reject;
    });
}

export async function resizeImage(imageUrl, width) {
    if (!width) {
        return imageUrl;
    }
    const image = new Image();
    image.src = imageUrl;

    await image.decode();

    const canvas = document.createElement('canvas');
    const height = (image.height / image.width) * width;
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext('2d');
    context.drawImage(image, 0, 0, width, height);

    const resizedImageUrl = canvas.toDataURL('image/jpeg');
    return resizedImageUrl;
}