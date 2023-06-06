import { PodDataAdapter, VehicleOrders } from "../index.ts";
import { config } from "./../config.ts";

type Endpoints = {
    [config.paths.podDataDescription]: PodDataAdapter;
    [config.paths.orderDescription]: VehicleOrders;
    [config.paths.uploadableBoards]: string[];
};

export async function fetchBack<T extends keyof Endpoints>(
    path: T,
    signal?: AbortSignal
) {
    const res = await fetch(
        `http://${config.server.ip}:${config.server.port}/${path}`,
        {
            signal,
        }
    );

    return (await res.json()) as Promise<Endpoints[T]>;
}
