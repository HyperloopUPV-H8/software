import styles from "./BrokerLoader.module.scss";
import { Broker } from "common";
import { BrokerProvider } from "common";
import { createBroker } from "common";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setWebSocketConnection } from "slices/connectionsSlice";
import { clamp } from "utils/math";

type LoadingState = Loading | Success | Failure;

type Loading = { state: "loading" };
type Success = { state: "success"; broker: Broker };
type Failure = { state: "failure" };

const MAX_TITLE_TIME = 1100;

type Props = {
    url: string;
    LoadingView: React.ReactNode;
    children: React.ReactNode;
};

export const BrokerLoader = ({ url, LoadingView, children }: Props) => {
    const [state, setState] = useState<LoadingState>({ state: "loading" });
    const dispatch = useDispatch();

    useEffect(() => {
        const startTime = performance.now();
        createBroker(
            url,
            () => dispatch(setWebSocketConnection(true)),
            () => dispatch(setWebSocketConnection(false))
        )
            .then((broker) => {
                const elapsedTime = performance.now() - startTime;
                setTimeout(() => {
                    setState({ state: "success", broker });
                }, clamp(MAX_TITLE_TIME - elapsedTime, 0, MAX_TITLE_TIME));
            })
            .catch(() => {
                setState({ state: "failure" });
            });
    }, []);

    if (state.state == "loading") {
        return <>{LoadingView}</>;
    } else if (state.state == "success") {
        return (
            <BrokerProvider broker={state.broker}>{children}</BrokerProvider>
        );
    } else {
        return (
            <div className={styles.failure}>
                Failure connecting to the backend
            </div>
        );
    }
};
