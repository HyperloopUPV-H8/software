import { Order } from "../models/Order";
import { MessageAdapter } from "../adapters/Message";
import { PacketUpdate } from "../adapters/PacketUpdate";
import { ConnectionsUpdate } from "../adapters/ConnectionUpdate";
import { VcuStateAndOrders } from "../adapters/VcuState";

import {
    BootloaderDownloadRequest,
    BootloaderDownloadResponse,
    BootloaderUploadRequest,
    BootloaderUploadResponse,
} from "../adapters/Bootloader";

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
    "vcu/state": {
        request: never;
        response: VcuStateAndOrders;
    };
};
