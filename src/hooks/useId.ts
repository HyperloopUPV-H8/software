import { useRef } from "react";

export function useId(): string {
    return useRef(crypto.randomUUID()).current;
}
