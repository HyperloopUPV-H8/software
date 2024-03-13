import "./App.css";
import { TestingPage } from "pages/TestingPage/TestingPage";
import { SplashScreen } from "components/SplashScreen/SplashScreen";
import { WsHandlerProvider, useLoadBackend } from "common";

function App() {

    const isProduction = import.meta.env.PROD;
    const loadBackend = useLoadBackend(isProduction);

    return (
        <div className="App">
            {loadBackend.state === "fulfilled" && 
                <WsHandlerProvider handler={loadBackend.wsHandler}>
                    <TestingPage />
                </WsHandlerProvider>}
            {loadBackend.state === "pending" && <SplashScreen />}
            {loadBackend.state === "rejected" && <div>{`${loadBackend.error}`}</div>}
        </div>
    );
}

export default App;