"use client";
import { useState } from 'react';

export default function VideoUpload() {
    const [duration, setDuration] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const video = document.createElement('video');
        video.preload = 'metadata';

        video.onloadedmetadata = () => {
            URL.revokeObjectURL(video.src); // Clean up memory
            setDuration(video.duration); // Duration in seconds
        };

        video.src = URL.createObjectURL(file);
    };

    return (
        <div className="p-4">
            <input type="file" accept="video/*" onChange={handleFileChange} />
            {duration && (
                <p className="mt-2">Duration: {duration.toFixed(2)} seconds</p>
            )}
        </div>
    );
}
