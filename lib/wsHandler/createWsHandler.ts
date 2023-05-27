import { WsHandler } from "./WsHandler";

export async function createWsHandler(
    url: string,
    onOpen?: () => unknown,
    onClose?: () => unknown
): Promise<WsHandler> {
    return new Promise((resolve, reject) => {
        const handler = new WsHandler(
            url,
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
