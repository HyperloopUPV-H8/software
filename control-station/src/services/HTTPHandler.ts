export async function fetchFromBackend(path: string) {
    return fetch(
        `http://${import.meta.env.VITE_SERVER_IP}:${
            import.meta.env.VITE_SERVER_PORT
        }${path}`,
        { mode: "cors" }
    );
}
