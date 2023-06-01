import {
    RequestState,
    useFetchPodData,
} from "pages/HomePage/ReceiveColumn/useFetchPodData";
import styles from "./BrokerLoader.module.scss";
import { WsHandler, WsHandlerProvider, createWsHandler } from "common";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setWebSocketConnection } from "slices/connectionsSlice";
import { clamp } from "utils/math";

type LoadingState = Loading | Success | Failure;

type Loading = { state: "loading" };
type Success = { state: "success"; handler: WsHandler };
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
        createWsHandler(
            url,
            () => dispatch(setWebSocketConnection(true)),
            () => dispatch(setWebSocketConnection(false))
        )
            .then((handler) => {
                const elapsedTime = performance.now() - startTime;
                setTimeout(() => {
                    setState({ state: "success", handler });
                }, clamp(MAX_TITLE_TIME - elapsedTime, 0, MAX_TITLE_TIME));
            })
            .catch(() => {
                setState({ state: "failure" });
            });
    }, []);

    const requestState = useFetchPodData();

    if (state.state == "loading") {
        return <>{LoadingView}</>;
    } else if (
        state.state == "success" &&
        requestState == RequestState.FULFILLED
    ) {
        return (
            <WsHandlerProvider handler={state.handler}>
                {children}
            </WsHandlerProvider>
        );
    } else {
        return (
            <div className={styles.failure}>
                Failure connecting to the backend
            </div>
        );
    }
};
