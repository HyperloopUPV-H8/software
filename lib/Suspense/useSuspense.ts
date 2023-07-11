import { useContext, useEffect, useMemo, useState } from "react";
import { SuspenseContext } from "./Suspense";

export function useSuspense<T>(promiseFn: () => Promise<T>) {
    const suspenseStore = useContext(SuspenseContext);
    const promise = useMemo(promiseFn, []);

    useEffect(() => {
        suspenseStore.add(promise);
    }, []);

    return promise;
}
