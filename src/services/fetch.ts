export async function fetchFromBackend(path: string, signal: AbortSignal) {
    return fetch(
        `http://${import.meta.env.VITE_SERVER_IP}:${
            import.meta.env.VITE_SERVER_PORT
        }${path}`,
        { signal }
    );
}

export function postToBackend(path: string, data: BodyInit) {
    return fetch(
        `http://${import.meta.env.VITE_SERVER_IP}:${
            import.meta.env.VITE_SERVER_PORT
        }${path}`,
        {
            method: "POST",
            headers: { "Content-Type": "text/plain" },
            body: data,
        }
    );
}
