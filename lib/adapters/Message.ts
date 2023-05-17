import { Message } from "models/Message";

type DistributeOmit<T, K extends string> = T extends T ? Omit<T, K> : never;

export type MessageAdapter = DistributeOmit<Message, "id" | "count">;
