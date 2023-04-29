import React, { useState } from 'react';
import DebugCapture from '../components/capture/DebugCapture';
import { Link } from 'react-router-dom';

function DebugPage() {
    return (
        <div>
            <Link to="/">
                <button>Back</button>
            </Link>

            <DebugCapture />

        </div>
    );
}

export default DebugPage;
