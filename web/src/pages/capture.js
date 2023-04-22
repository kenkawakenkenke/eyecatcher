import React, { useState } from 'react';
import ImageCapture from '../components/capture/ImageCapture';
import { Link } from 'react-router-dom';

function CapturePage() {
    return (
        <div>
            <Link to="/">
                <button>Back</button>
            </Link>

            <ImageCapture />

        </div>
    );
}

export default CapturePage;
