import { Order } from "common";
import { Connection } from "common";
import { ProtectionMessageAdapter } from "common";
import { PacketUpdate } from "common";

type ConnectionsUpdate = Connection[];

type BootloaderUploadRequest = { board: string; file: string };
type BootloaderUploadResponse = { percentage: number; success: boolean };

type BootloaderDownloadRequest = { board: string };
type BootloaderDownloadResponse =
    | { success: false }
    | { success: true; file: string };

export type BrokerStructure = {
    "podData/update": {
        request: never;
        response: Record<string, PacketUpdate>;
    };
    "order/send": {
        request: Order;
        response: never;
    };
    "connection/update": {
        request: null;
        response: ConnectionsUpdate;
    };
    "message/update": { request: never; response: ProtectionMessageAdapter };
    "logger/enable": { request: boolean; response: boolean };
    "blcu/upload": {
        request: BootloaderUploadRequest;
        response: BootloaderUploadResponse;
    };
    "blcu/download": {
        request: BootloaderDownloadRequest;
        response: BootloaderDownloadResponse;
    };
};

// export type Request<Topic extends keyof MessageTypes> =
//     MessageTypes[Topic]["request"];

// export type Response<Topic extends keyof MessageTypes> =
//     MessageTypes[Topic]["response"];
