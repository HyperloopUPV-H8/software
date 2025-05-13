import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';

type Props = {
    src: string;
    width?: string;
    height?: string;
    borderRadius?: string;
};

const LiveStreamPlayer: React.FC<Props> = ({ src, width = '100%', height = '100%', borderRadius = '8px' }) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        const video = videoRef.current;

        if (video) {
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = src;
            } else if (Hls.isSupported()) {
                const hls = new Hls();
                hls.loadSource(src);
                hls.attachMedia(video);

                return () => hls.destroy();
            } else {
                console.error('HLS no soportado');
            }
        }
    }, [src]);

    return (
        <div>
            <video
                ref={videoRef}
                controls
                style={{ width: width, height: height, borderRadius: borderRadius }}
            />
        </div>
    );
};

export default LiveStreamPlayer;
