export async function fetchFromBackend(path: string) {
    return fetch(
        `http://${import.meta.env.VITE_SERVER_IP}:${
            import.meta.env.VITE_SERVER_PORT
        }${path}`
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

export function createWebSocketToBackend(path: string) {
    return new WebSocket(
        `ws://${import.meta.env.VITE_SERVER_IP}:${
            import.meta.env.VITE_SERVER_PORT
        }${path}`
    );
}
