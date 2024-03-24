import React from "react";
import ReactDOM from "react-dom/client";
import "common/dist/style.css";
import App from "./App";
import "styles/fonts.scss";
import "./index.scss";
import { ConfigProvider, GlobalTicker } from "common";
import { AppLayout } from "layouts/AppLayout/AppLayout";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { LoggerPage } from "pages/LoggerPage/LoggerPage";

const router = createBrowserRouter([
    {
        path: "/",
        element: <AppLayout />,
        children: [
            {
                index: true,
                element: <App />,
            },
            {
                path: "/logger",
                element: <LoggerPage />,
            }
        ]
    },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <ConfigProvider
            devIp="127.0.0.1"
            prodIp="127.0.0.1"
        >
            <GlobalTicker fps={100}>
                <RouterProvider router={router} />
            </GlobalTicker>
        </ConfigProvider>
    </React.StrictMode>
);