import "./App.css";
import {
    WsHandler,
    WsHandlerProvider,
    createWsHandler,
    fetchBack,
} from "common";
import { HomePage } from "pages/HomePage/HomePage";
import { useDispatch } from "react-redux";
import { initMeasurements } from "slices/measurementsSlice";
import { initPodData } from "slices/podDataSlice";
import { config, Loader } from "common";
import { SplashScreen } from "components/SplashScreen/SplashScreen";
import { setWebSocketConnection } from "slices/connectionsSlice";

const SERVER_URL = `${config.server.ip}:${config.server.port}/${config.paths.websocket}`;

function App() {
    const dispatch = useDispatch();

    return (
        <div className="App">
            <Loader
                promises={[
                    createWsHandler(
                        SERVER_URL,
                        () => dispatch(setWebSocketConnection(true)),
                        () => dispatch(setWebSocketConnection(false))
                    ),
                    fetchBack(config.paths.podDataDescription).then(
                        (adapter) => {
                            dispatch(initPodData(adapter));
                            dispatch(initMeasurements(adapter));
                        }
                    ),
                ]}
                LoadingView={<SplashScreen />}
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
