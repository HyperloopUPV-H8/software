import { ProtectionMessage } from "models/ProtectionMessage";

export type ProtectionMessageAdapter = Omit<ProtectionMessage, "id" | "count">;
