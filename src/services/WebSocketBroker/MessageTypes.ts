import { Order } from "models/Order";
import { Connection } from "models/Connection";
import { ProtectionMessageAdapter } from "adapters/ProtectionMessage";
import { PacketUpdate } from "adapters/PacketUpdate";

type ConnectionsUpdate = Connection[];

type BootloaderUploadRequest = { board: string; file: File };
type BootloaderUploadResponse = { precentage: number; failure: boolean };
type BootloaderDownloadRequest = string;
type BootloaderDownloadResponse = { file: File | undefined; success: boolean };

export type MessageTypes = {
    "podData/update": {
        request: never;
        response: Record<string, PacketUpdate>;
    };
    "order/send": {
        request: Order;
        response: never;
    };
    "connection/update": {
        request: never;
        response: ConnectionsUpdate;
    };
    "message/update": { request: never; response: ProtectionMessageAdapter };
    "logger/enable": { request: boolean; response: boolean };
    "bootloader/upload": {
        request: BootloaderUploadRequest;
        response: BootloaderUploadResponse;
    };
    "bootloader/download": {
        request: BootloaderDownloadRequest;
        response: BootloaderDownloadResponse;
    };
};

export type Request<Topic extends keyof MessageTypes> =
    MessageTypes[Topic]["request"];

export type Response<Topic extends keyof MessageTypes> =
    MessageTypes[Topic]["response"];
