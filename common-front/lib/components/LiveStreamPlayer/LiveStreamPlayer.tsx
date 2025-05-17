import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';

type Props = {
    src: string;
    width?: string;
    height?: string;
    borderRadius?: string;
};

export const LiveStreamPlayer = ({ src, width = '100%', height = '100%', borderRadius = '8px' }: Props) => {
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
                console.error('HLS not supported');
            }
        }
    }, [src]);

    return (
        <video
            ref={videoRef}
            controls
            style={{ width: width, height: height, borderRadius: borderRadius }}
        />
    );
};
