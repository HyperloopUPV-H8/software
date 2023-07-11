import { ReactNode, createContext, useEffect, useState } from "react";

type SuspenseContextType = {
    add: (v: Promise<any>) => void;
};

export const SuspenseContext = createContext<SuspenseContextType>({
    add: () => {},
});

type Props = {
    loading: ReactNode;
    failure: ReactNode;
    children: ReactNode;
};

type State = "pending" | "fulfilled" | "rejected";

export const Suspense = ({ loading, failure, children }: Props) => {
    const [state, setState] = useState<State>("pending");
    const [promises, setPromises] = useState<Promise<any>[]>([]);

    useEffect(() => {
        Promise.all(promises)
            .then(() => setState("fulfilled"))
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
