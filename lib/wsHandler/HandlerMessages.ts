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
    "connection/update": Subscription<ConnectionsUpdate>;
    "message/update": Subscription<MessageAdapter>;
    "logger/enable": PostRequest<boolean, boolean>;
    "logger/response": Subscription<boolean>;
    "blcu/upload": Exchange<BootloaderUploadRequest, BootloaderUploadResponse>;
    "blcu/download": Exchange<
        BootloaderDownloadRequest,
        BootloaderDownloadResponse
    >;
    "blcu/response": Subscription<
        BootloaderDownloadResponse | BootloaderUploadResponse
    >;
    "vcu/state": Subscription<VcuStateAndOrders>;
};
