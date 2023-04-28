import React, { useState } from 'react';
import Webcam from 'react-webcam'
import { getFunctions, httpsCallable } from 'firebase/functions';

const videoConstraints = {
    // width: 300,
    // height: 300,
    facingMode: 'user',
}

function ImageCapture() {
    const [image, setImage] = useState(null);
    const webcamRef = React.useRef(null)

    const [result, setResult] = useState("");

    async function getImageDimensions(dataUrl) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = dataUrl;
            img.onload = () => {
                resolve({ width: img.width, height: img.height });
            };
            img.onerror = reject;
        });
    }

    async function resizeImage(imageUrl, width) {
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

    async function capture(width) {
        var pictureSrc = webcamRef.current.getScreenshot();
        if (width) {
            pictureSrc = await resizeImage(pictureSrc, width);
        }

        // Show image
        setImage(pictureSrc);

        // Query image to backend.
        const processImage = httpsCallable(getFunctions(undefined), 'processImage');

        var response = await processImage({
            image: pictureSrc,
        });

        console.log(response);
        if (!response || response.data.status !== "ok") {
            throw new Error("Failed to query image")
        }

        setResult(response.data.result);
    }

    const handleCapturePhoto = async () => {
        capture();
    };
    const handleCapturePhotoSmall = async () => {
        capture(300);
    };

    return (
        <div>
            <button onClick={handleCapturePhoto}>Capture Photo</button>
            <button onClick={handleCapturePhotoSmall}>Capture Photo Small</button>

            <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
            />

            {image && <img src={image} alt="Captured Image" />}

            {result}
        </div>
    );
}

export default ImageCapture;
