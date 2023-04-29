import React, { useState } from 'react';
import Webcam from 'react-webcam'
import { resizeImage } from '../components/capture/ImageUtil.js';
import './capture.css';
import 'font-awesome/css/font-awesome.min.css';

const videoConstraints = {
    width: 1280,
    height: 960,
    facingMode: 'environment',
}

function CapturePage({ captureCallback }) {
    const webcamRef = React.useRef(null)

    async function captureImage(width) {
        var image = webcamRef.current.getScreenshot();
        if (width) {
            image = await resizeImage(image, width);
        }
        return image;
    }

    const handleCapturePhoto = async () => {
        const image = await captureImage();
        captureCallback(image);
    };

    return (
        <div className="capture-container">
            <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
                className="webcam"
            />
            <button onClick={handleCapturePhoto} className="capture-button"></button>
        </div >
    );
}

export default CapturePage;
