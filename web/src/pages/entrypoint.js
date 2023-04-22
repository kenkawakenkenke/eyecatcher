import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function EntrypointPage() {
    return (
        <div>
            Entrypoint

            <Link to="/capture">
                <button>Capture</button>
            </Link>
        </div>
    );
}

export default EntrypointPage;
