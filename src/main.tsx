import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.scss";
import { store } from "./store";
import { Provider } from "react-redux";
import { BrokerLoader } from "BrokerLoader/BrokerLoader";
import { SplashScreen } from "components/SplashScreen/SplashScreen";

const SERVER_URL = `${import.meta.env.VITE_SERVER_IP}:${
    import.meta.env.VITE_SERVER_PORT
}${import.meta.env.VITE_BACKEND_WEBSOCKET_PATH}`;

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <Provider store={store}>
            <BrokerLoader
                url={SERVER_URL}
                LoadingView={<SplashScreen />}
            >
                <App />
            </BrokerLoader>
        </Provider>
    </React.StrictMode>
);
