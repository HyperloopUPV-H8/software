import "App.css";
import { ControlSections } from "components/ControlSections/ControlSections";
import { useInterval } from "hooks/useInterval";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { initializePodData } from "slices/podDataSlice";
import { podDataAdapterMock } from "mocks/podDataAdapterMock";
import { Outlet } from "react-router-dom";

export const App = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(initializePodData(podDataAdapterMock));
    }, []);

    return <Outlet />;
};
