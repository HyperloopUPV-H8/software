import { useEffect, useState } from "react";
import { useSuspense } from ".";

export function useValueSuspense<T>(promiseFn: () => Promise<T>) {
    const promise = useSuspense(() => promiseFn());

    const [value, setValue] = useState<T>();

    useEffect(() => {
        promise.then((v) => setValue(v));
    }, []);

    return value;
}
