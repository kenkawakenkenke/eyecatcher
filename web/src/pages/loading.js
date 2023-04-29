import React, { useState } from 'react';
import "./loading.css";

function LoadingPage({ image, resetCallback }) {

    // return <div>
    //     Loading...
    //     <img src={image} />
    // </div>;
    return <div className="loading-container">
        <img className="image" src={image} alt="Captured" />
        <div className="spinner" /> {/* Add the spinner */}
        <div className="flash" />
    </div>
}

export default LoadingPage;
