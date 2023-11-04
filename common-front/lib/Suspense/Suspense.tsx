import { ReactNode, createContext, useEffect, useRef, useState } from "react";
import { clamp } from "../math";

type SuspenseContextType = {
    add: (v: Promise<any>) => void;
};

export const SuspenseContext = createContext<SuspenseContextType>({
    add: () => {},
});

type State = "pending" | "fulfilled" | "rejected";
const MAX_LOADING_TIME = 1100;

type Props = {
    loading: ReactNode;
    failure: ReactNode;
    children: ReactNode;
};

export const Suspense = ({ loading, failure, children }: Props) => {
    const [state, setState] = useState<State>("pending");
    const [promises, setPromises] = useState<Promise<any>[]>([]);
    const startTime = useRef(0);

    useEffect(() => {
        startTime.current = performance.now();
        Promise.all(promises)
            .then(() => {
                const elapsed = performance.now() - startTime.current;
                setTimeout(() => {
                    setState("fulfilled");
                }, clamp(MAX_LOADING_TIME - elapsed, 0, MAX_LOADING_TIME));
            })
            .catch(() => setState("rejected"));
    }, []);

    return (
        <SuspenseContext.Provider
            value={{ add: (v) => setPromises((prev) => [...prev, v]) }}
        >
            {state == "pending" && loading}
            {state == "fulfilled" && children}
            {state == "rejected" && failure}
        </SuspenseContext.Provider>
    );
};
