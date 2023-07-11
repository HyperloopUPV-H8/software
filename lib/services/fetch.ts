// import { PodDataAdapter, VehicleOrders } from "../index.ts";

import { useConfig } from "..";

// type Endpoints = {
//     [config.paths.podDataDescription]: PodDataAdapter;
//     [config.paths.orderDescription]: VehicleOrders;
//     [config.paths.uploadableBoards]: string[];
// };

// Use abort controller internally with useEffect instead of exposing it.
export async function useFetchBack(
    production: boolean,
    path: string,
    signal?: AbortSignal
) {
    const config = useConfig();
    return fetchBack(
        `http://${production ? config.prodServer.ip : config.devServer.ip}:${
            production ? config.prodServer.port : config.devServer.port
        }/${path}`,
        signal
    );
}

export async function fetchBack(url: string, signal?: AbortSignal) {
    const res = await fetch(url, {
        signal,
    });

    return await res.json();
}
