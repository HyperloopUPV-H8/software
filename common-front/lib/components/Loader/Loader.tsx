import { useEffect, useRef, useState } from "react";
import { clamp } from "../../math";

type AwaitedArray<T extends Promise<any>[]> = {
    [K in keyof T]: Awaited<T[K]>;
};

type Props<T extends Promise<any>[]> = {
    promises: T;
    LoadingView: React.ReactNode;
    FailureView: React.ReactNode;
    children: (values: AwaitedArray<T>) => React.ReactNode;
};

const MAX_TITLE_TIME = 1100;

type PromiseResult<T> =
    | {
          state: "pending";
      }
    | {
          state: "fulfilled";
          result: T;
      }
    | {
          state: "rejected";
      };

export const Loader = <T extends Promise<any>[]>({
    promises,
    LoadingView,
    FailureView,
    children,
}: Props<T>) => {
    const [state, setState] = useState<
        PromiseResult<AwaitedArray<typeof promises>>
    >({ state: "pending" });
    const startTime = useRef(0);

    useEffect(() => {
        startTime.current = performance.now();
        Promise.all(promises)
            .then((values) => {
                const elapsed = performance.now() - startTime.current;
                setTimeout(() => {
                    setState({ state: "fulfilled", result: values });
                }, clamp(MAX_TITLE_TIME - elapsed, 0, MAX_TITLE_TIME));
            })
            .catch(() => setState({ state: "rejected" }));
    }, []);

    if (state.state == "fulfilled") {
        return <>{children(state.result)}</>;
    } else if (state.state == "pending") {
        return <>{LoadingView}</>;
    } else {
        return <>{FailureView}</>;
    }
};
