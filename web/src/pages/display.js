import React, { useState, useEffect } from 'react';
import './display.css';

function DisplayPage({ image, summary, resetCallback, timeout }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [backgroundColor, setBackgroundColor] = useState('#ff5252');
    const [textColor, setTextColor] = useState('white');

    const texts = summary.data.gptResult.questions;


    // Function to generate a random vivid color
    const randomColor = () => {
        const colors = [
            '#ff5252', '#ff9800', '#ffeb3b', '#4caf50', '#2196f3', '#9c27b0',
            '#ff4081', '#26a69a', '#7e57c2', '#d4e157', '#ff7043', '#5c6bc0',
            '#8bc34a', '#ffc107', '#009688', '#3f51b5', '#cddc39', '#03a9f4',
            '#673ab7', '#00bcd4'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    };
    // Function to calculate the luminance of a color
    const luminance = (color) => {
        const rgb = color.match(/\w\w/g).map((c) => parseInt(c, 16));
        return (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) / 255;
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % texts.length);
            const newColor = randomColor();
            setBackgroundColor(newColor);
            // Calculate text color based on background luminance
            const lum = luminance(newColor);
            setTextColor(lum > 0.5 ? '#222222' : '#eeeeee');
        }, timeout); // Rotate every few seconds

        return () => clearInterval(interval);
    }, [texts]);

    return (
        <div className="display-container" style={{ backgroundColor }}>
            <button className="back-button" onClick={resetCallback}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                </svg>
            </button> {/* Replace the arrow text with an SVG arrow icon */}
            <p className="display-text" style={{ color: textColor }}>{texts[currentIndex]}</p>

            {/* <div className="arrow-animation">
                <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L12 22M12 22L6 16M12 22L18 16" stroke={textColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div> */}
            <div className="arrow-container">
                {/* <span className="arrow-text" style={{ color: textColor }}>読んで知ろう！</span> */}
                <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L12 22M12 22L6 16M12 22L18 16" stroke={textColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
        </div>
    );
}

export default DisplayPage;
