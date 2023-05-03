import { Broker, BrokerProvider, createBroker } from "common";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

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

    useEffect(() => {
        const startTime = performance.now();
        createBroker(url)
            .then((broker) => {
                setState({ state: "success", broker });
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
        return <div>Failure connecting to the backend</div>;
    }
};
