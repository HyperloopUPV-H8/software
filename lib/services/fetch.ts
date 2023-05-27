import { config } from "./../config.ts";

export async function fetchFromBackend(path: string, signal?: AbortSignal) {
    return fetch(`http://${config.server.ip}:${config.server.port}/${path}`, {
        signal,
    });
}

export function postToBackend(path: string, data: BodyInit) {
    return fetch(`http://${config.server.ip}:${config.server.port}/${path}`, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: data,
    });
}
