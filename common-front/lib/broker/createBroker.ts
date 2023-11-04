import { Broker } from "./Broker";

export async function createBroker(
    url: string,
    onOpen?: () => unknown,
    onClose?: () => unknown
): Promise<Broker> {
    return new Promise((resolve, reject) => {
        const broker = new Broker(
            url,
            () => {
                onOpen?.();
                resolve(broker);
            },
            () => {
                onClose?.();
                reject();
            }
        );
    });
}
