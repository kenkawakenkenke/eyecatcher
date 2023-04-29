import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function EntrypointPage() {
    return (
        <div>
            Entrypoint

            <Link to="/capture">
                <button>Capture</button>
            </Link>
            <Link to="/debug">
                <button>Debug</button>
            </Link>
        </div>
    );
}

export default EntrypointPage;
