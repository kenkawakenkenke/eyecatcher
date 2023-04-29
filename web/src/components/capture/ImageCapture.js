import React, { useState } from 'react';
import Webcam from 'react-webcam'
import { IMAGE_BOOK_1 } from './TestImage.js';
import { TextSummarizer } from './TextSummarizer.js';
import { resizeImage } from './ImageUtil.js';

const videoConstraints = {
    width: 1280,
    height: 960,
    facingMode: 'environment',
}

const summarizer = new TextSummarizer();

function ImageCapture() {
    const [image, setImage] = useState(null);
    const webcamRef = React.useRef(null)

    const [result, setResult] = useState("");

    async function captureImage(width) {
        var image = webcamRef.current.getScreenshot();
        if (width) {
            image = await resizeImage(image, width);
        }
        return image;
    }

    async function loadImage(image, skipAll = false) {
        setImage(image);

        const response = await summarizer.summarize(image, skipAll);

        setResult("Captured: " + response.data.gptResult.questions);
    }

    const handleCapturePhoto = async () => {
        const image = await captureImage();
        loadImage(image);
    };
    const handleCapturePhotoSmall = async () => {
        const image = await captureImage(300);
        loadImage(image);
    };
    const handleFakeImage = async () => {
        loadImage(IMAGE_BOOK_1, true);
    };
    const printImage = async () => {
        console.log(`export const IMAGE = "${webcamRef.current.getScreenshot()}";`);
    };

    return (
        <div>
            <button onClick={handleCapturePhoto}>Capture Photo</button>
            <button onClick={handleCapturePhotoSmall}>Capture Photo Small</button>
            <button onClick={handleFakeImage}>Capture Fake</button>
            <button onClick={printImage}>Print image</button>

            <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
            />

            {image && <img src={image} alt="Captured Image" />}

            {result}
        </div >
    );
}

export default ImageCapture;
