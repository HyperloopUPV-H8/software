import { WsHandler } from "./WsHandler";

export async function createWsHandler(
    url: string,
    reconnect: boolean,
    onOpen?: () => unknown,
    onClose?: () => unknown
): Promise<WsHandler> {
    return new Promise((resolve, reject) => {
        const handler = new WsHandler(
            url,
            reconnect,
            () => {
                onOpen?.();
                resolve(handler);
            },
            () => {
                onClose?.();
                reject();
            }
        );
    });
}
