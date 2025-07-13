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
import { PostRequest, Subscription, Exchange } from "./types";

export type HandlerMessages = {
    "podData/update": Subscription<Record<string, PacketUpdate>>;
    "order/send": PostRequest<Order, never>;
    "order/stateOrders": Subscription<Record<string, number[]>>;
    "connection/update": Subscription<ConnectionsUpdate>;
    "message/update": Subscription<MessageAdapter>;
    "logger/enable": PostRequest<boolean, boolean>;
    "logger/response": Subscription<boolean>;
    "logger/variables": PostRequest<string[], boolean>;
    "blcu/upload": Exchange<BootloaderUploadRequest, BootloaderUploadResponse>;
    "blcu/download": Exchange<
        BootloaderDownloadRequest,
        BootloaderDownloadResponse
    >;
    "blcu/response": Subscription<
        BootloaderDownloadResponse | BootloaderUploadResponse
    >;
    "vcu/state": Subscription<VcuStateAndOrders>;
    "lifecycle/shutdown": PostRequest<ShutdownRequest, never>;
    "lifecycle/shutdownResponse": Subscription<ShutdownResponse>;
};

export interface ShutdownRequest {
    reason: string;
}

export interface ShutdownResponse {
    acknowledged: boolean;
    message: string;
}
