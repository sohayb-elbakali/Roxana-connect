'use client';

import { useEffect } from 'react';
import { useSelector } from 'react-redux';

const LoadingFavicon = () => {
    const loading = useSelector((state) => state.users.loading || state.profiles.loading || state.internships.loading);

    useEffect(() => {
        const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
        link.type = 'image/svg+xml';
        link.rel = 'icon';
        document.head.appendChild(link);

        let interval;

        if (loading) {
            // Create a dynamic SVG spinner
            const spinnerSvg = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" stroke="#3B82F6" stroke-width="10" fill="none" stroke-dasharray="180" stroke-dashoffset="0">
            <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="1s" repeatCount="indefinite"/>
          </circle>
        </svg>
      `;
            const encodedSvg = encodeURIComponent(spinnerSvg);
            link.href = `data:image/svg+xml,${encodedSvg}`;
        } else {
            // Restore original favicon
            link.href = '/icon.svg'; // Assuming this is your default favicon path
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [loading]);

    return null;
};

export default LoadingFavicon;
