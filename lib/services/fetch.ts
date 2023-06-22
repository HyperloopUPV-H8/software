// import { PodDataAdapter, VehicleOrders } from "../index.ts";
import { config } from "./../config.ts";

// type Endpoints = {
//     [config.paths.podDataDescription]: PodDataAdapter;
//     [config.paths.orderDescription]: VehicleOrders;
//     [config.paths.uploadableBoards]: string[];
// };

export async function fetchBack(
    production: boolean,
    path: string,
    signal?: AbortSignal
) {
    const res = await fetch(
        `http://${production ? config.prodServer.ip : config.devServer.ip}:${
            production ? config.prodServer.port : config.devServer.port
        }/${path}`,
        {
            signal,
        }
    );

    return await res.json();
}
