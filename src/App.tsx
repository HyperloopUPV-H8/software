import "./App.css";
import {
    WsHandlerProvider,
    createWsHandler,
    useConfig,
    useFetchBack,
    Loader,
} from "common";
import { HomePage } from "pages/HomePage/HomePage";
import { useDispatch } from "react-redux";
import { initMeasurements } from "slices/measurementsSlice";
import { initPodData } from "slices/podDataSlice";
import { SplashScreen } from "components/SplashScreen/SplashScreen";
import { setWebSocketConnection } from "slices/connectionsSlice";

function App() {
    const dispatch = useDispatch();
    const config = useConfig();
    const podDataDescriptionPromise = useFetchBack(
        import.meta.env.PROD,
        config.paths.podDataDescription
    );

    const SERVER_URL = import.meta.env.PROD
        ? `${config.prodServer.ip}:${config.prodServer.port}/${config.paths.websocket}`
        : `${config.devServer.ip}:${config.devServer.port}/${config.paths.websocket}`;

    return (
        <div className="App">
            <Loader
                promises={[
                    createWsHandler(
                        SERVER_URL,
                        true,
                        () => dispatch(setWebSocketConnection(true)),
                        () => dispatch(setWebSocketConnection(false))
                    ),
                    podDataDescriptionPromise.then((adapter) => {
                        dispatch(initPodData(adapter));
                        dispatch(initMeasurements(adapter));
                    }),
                ]}
                LoadingView={<SplashScreen />}
                FailureView={<div>Failure</div>}
            >
                {([handler]) => (
                    <WsHandlerProvider handler={handler}>
                        <HomePage />
                    </WsHandlerProvider>
                )}
            </Loader>
        </div>
    );
}

export default App;
