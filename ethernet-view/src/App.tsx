import "./App.css";
import {
    WsHandlerProvider,
    createWsHandler,
    useConfig,
    useFetchBack,
    Loader,
    useMeasurementsStore,
    usePodDataStore,
    useConnectionsStore
} from "common";
import { TestingPage } from "pages/TestingPage/TestingPage";
import { SplashScreen } from "components/SplashScreen/SplashScreen";

function App() {
    const config = useConfig();
    const podDataDescriptionPromise = useFetchBack(
        import.meta.env.PROD,
        config.paths.podDataDescription
    );

    const initMeasurements = useMeasurementsStore((state) => state.initMeasurements);
    const initPodData = usePodDataStore((state) => state.initPodData);
    const setBackendConnection = useConnectionsStore((state) => state.setBackendConnection);

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
                        () => setBackendConnection(true),
                        () => setBackendConnection(false),
                    ),
                    podDataDescriptionPromise.then((adapter) => {
                        initPodData(adapter);
                        initMeasurements(adapter);
                    }),
                ]}
                LoadingView={<SplashScreen />}
                FailureView={<div>Failure</div>}
            >
                {([handler]) => (
                    <WsHandlerProvider handler={handler}>
                        <TestingPage />
                    </WsHandlerProvider>
                )}
            </Loader>
        </div>
    );
}

export default App;
