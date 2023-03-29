import { useCallback, useEffect, useMemo, useState } from "react";

export type CameraData = {
    id: number;
    stream: MediaStream;
};

export function useCameras(streams: Array<MediaStream>) {
    const [cameras, setCameras] = useState<Array<CameraData>>(() =>
        streams?.map((stream, index) => ({ id: index, stream }))
    );

    // When streams change, initialize cameras
    useEffect(() => {
        setCameras(
            streams?.map((stream, index) => ({ id: index, stream })) ?? []
        );
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
