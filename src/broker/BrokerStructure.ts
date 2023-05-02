import { Order } from "../models/Order";
import { Connection } from "../models/Connection";
import { MessageAdapter } from "../adapters/Message";
import { PacketUpdate } from "../adapters/PacketUpdate";

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
    "message/update": { request: never; response: MessageAdapter };
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
