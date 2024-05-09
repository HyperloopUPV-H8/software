import { useMeasurementsStore } from "common";
import styles from "./VehiclePage.module.scss";

import { Pagination } from "components/Pagination/Pagination";
import { PageWrapper } from "pages/PageWrapper/PageWrapper";
import { Outlet } from "react-router-dom";
import { useOrders } from "useOrders";
import { fetchFromBackend } from "services/HTTPHandler";
import { useEffect, useState } from "react";

export const VehiclePage = () => {
    
    const [podData, setPodData] = useState(null);
    const measurements = useMeasurementsStore(state => state.measurements);
    const initMeasurements = useMeasurementsStore(state => state.initMeasurements);

    useEffect(() => {
        const fetchPodDataAsync = async () => {
            const data = await fetchPodData();
            setPodData(data);
        };
        fetchPodDataAsync();
    }, []);

    useEffect(() => {
        if (podData) {
            initMeasurements(podData);
        }
    }, [podData, initMeasurements]);

    useOrders();

    return (
        <PageWrapper title="Vehicle">
            <div className={styles.contentWrapper}>
                <Outlet />
                <Pagination routes={["first", "second"]} />
            </div>
        </PageWrapper>
    );
};

async function fetchPodData() {
    const response = await fetchFromBackend(
        import.meta.env.VITE_POD_DATA_DESCRIPTION_PATH
    );
    return response.json();
}