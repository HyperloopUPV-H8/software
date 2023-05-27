import { useEffect, useRef, useState } from "react";
import { clamp } from "../../math";

type AwaitedArray<T extends Promise<any>[]> = {
    [K in keyof T]: Awaited<T[K]>;
};

type Props<T extends Promise<any>[]> = {
    promises: T;
    LoadingView: React.ReactNode;
    children: (values: AwaitedArray<T>) => React.ReactNode;
};

const MAX_TITLE_TIME = 1100;

export const Loader = <T extends Promise<any>[]>({
    promises,
    LoadingView,
    children,
}: Props<T>) => {
    const [values, setValues] = useState<AwaitedArray<typeof promises>>();
    const startTime = useRef(0);

    useEffect(() => {
        startTime.current = performance.now();
        Promise.all(promises).then((values) => {
            const elapsed = performance.now() - startTime.current;
            setTimeout(() => {
                setValues(values);
            }, clamp(MAX_TITLE_TIME - elapsed, 0, MAX_TITLE_TIME));
        });
    }, []);

    if (values) {
        return <>{children(values)}</>;
    } else {
        return <>{LoadingView}</>;
    }
};
