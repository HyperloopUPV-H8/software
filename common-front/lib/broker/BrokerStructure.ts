import { Order } from "../models";
import {
    MessageAdapter,
    PacketUpdate,
    ConnectionsUpdate,
    VcuStateAndOrders,
    BootloaderDownloadRequest,
    BootloaderDownloadResponse,
    BootloaderUploadRequest,
    BootloaderUploadResponse,
} from "../adapters";

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
    "logger/variables": { request: string[]; response: boolean };
    "blcu/upload": {
        request: BootloaderUploadRequest;
        response: BootloaderUploadResponse;
    };
    "blcu/download": {
        request: BootloaderDownloadRequest;
        response: BootloaderDownloadResponse;
    };
    "vcu/state": {
        request: never;
        response: VcuStateAndOrders;
    };
};
