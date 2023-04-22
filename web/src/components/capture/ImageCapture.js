import React, { useState } from 'react';
import Webcam from 'react-webcam'
import { getFunctions, httpsCallable } from 'firebase/functions';

const videoConstraints = {
    width: 300,
    height: 300,
    facingMode: 'user',
}

function ImageCapture() {
    const [image, setImage] = useState(null);
    const webcamRef = React.useRef(null)

    const [result, setResult] = useState("");

    const handleCapturePhoto = async () => {
        // Capture image
        const pictureSrc = webcamRef.current.getScreenshot()

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
    };

    return (
        <div>
            <button onClick={handleCapturePhoto}>Capture Photo</button>

            <Webcam
                audio={false}
                height={200}
                ref={webcamRef}
                width={200}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
            />

            {image && <img src={image} alt="Captured Image" />}

            {result}
        </div>
    );
}

export default ImageCapture;
