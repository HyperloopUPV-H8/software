import React from "react";
import ReactDOM from "react-dom/client";

import { Provider } from "react-redux";
import { store } from "store";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { App } from "./App";
import { ControlPage } from "pages/ControlPage/ControlPage";

import "./index.css";
import { fetchControlSections } from "components/ControlSections/fetchControlSections";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "/",
                element: <ControlPage />,
                loader: async () => fetchControlSections(),
            },
        ],
    },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <Provider store={store}>
            <RouterProvider router={router}></RouterProvider>
        </Provider>
    </React.StrictMode>
);
