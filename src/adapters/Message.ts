import { Message } from "../models/Message";

export type MessageAdapter = Omit<Message, "id" | "count">;
