import { useCallback, useEffect, useState } from "react";

export type CameraData = {
    id: number;
    stream: MediaStream;
};

//TODO: use MediaStream id instead
function streamsToCameras(streams: MediaStream[]): CameraData[] {
    return streams.map((stream, index) => ({ id: index, stream }));
}

export function useCameras(streams: MediaStream[]) {
    const [cameras, setCameras] = useState<CameraData[]>(
        streamsToCameras(streams)
    );
    // When streams change, initialize cameras
    useEffect(() => {
        setCameras(streamsToCameras(streams));
    }, [streams]);

    const setMainCamera = useCallback((index: number) => {
        setCameras((prevCameras) => {
            const newCameras = [...prevCameras];

            [newCameras[0], newCameras[index]] = [
                newCameras[index],
                newCameras[0],
            ];

            return newCameras;
        });
    }, []);

    return { cameras, setMainCamera };
}
