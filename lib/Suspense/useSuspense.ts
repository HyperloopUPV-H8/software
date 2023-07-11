import { useContext, useEffect } from "react";
import { SuspenseContext } from "./Suspense";

export function useSuspense(promiseFn: () => Promise<any>) {
    const suspenseStore = useContext(SuspenseContext);

    useEffect(() => {
        suspenseStore.add(promiseFn());
    }, []);
}
