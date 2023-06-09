import { Outlet } from "react-router-dom";
import "styles/global.scss";
import "styles/scrollbars.scss";
import styles from "./App.module.scss";
import { Sidebar } from "components/Sidebar/Sidebar";
import { ReactComponent as Wheel } from "assets/svg/wheel.svg";
import { ReactComponent as Tube } from "assets/svg/tube.svg";
import { ReactComponent as Testing } from "assets/svg/testing.svg";
import { ReactComponent as Cameras } from "assets/svg/cameras.svg";
import {
    Loader,
    WsHandlerProvider,
    config,
    createWsHandler,
    fetchBack,
} from "common";
import { useDispatch } from "react-redux";
import { initPodData } from "slices/podDataSlice";
import { initMeasurements } from "slices/measurementsSlice";

const SERVER_URL = `${config.server.ip}:${config.server.port}/${config.paths.websocket}`;

export const App = () => {
    const dispatch = useDispatch();

    return (
        <div className={styles.appWrapper}>
            <Loader
                promises={[
                    createWsHandler(SERVER_URL),
                    fetchBack(config.paths.podDataDescription).then(
                        (adapter) => {
                            dispatch(initPodData(adapter));
                            dispatch(initMeasurements(adapter));
                        }
                    ),
                ]}
                LoadingView={<div>Loading</div>}
            >
                {([handler]) => (
                    <WsHandlerProvider handler={handler}>
                        <Sidebar
                            items={[
                                { path: "/vehicle", icon: <Wheel /> },
                                { path: "/tube", icon: <Tube /> },
                                { path: "/cameras", icon: <Cameras /> },
                            ]}
                        />
                        <Outlet />
                    </WsHandlerProvider>
                )}
            </Loader>
        </div>
    );
};
