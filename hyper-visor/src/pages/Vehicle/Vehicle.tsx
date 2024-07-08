import { Tabs } from "components/Tabs/Tabs";
import styles from "./Vehicle.module.scss";
import { Outlet } from "react-router-dom";
import { useMeasurementsStore, useSubscribe } from "common";

export const Vehicle = () => {

    const updateMeasurements = useMeasurementsStore(state => state.updateMeasurements)
    
    useSubscribe("podData/update", (update) => {
        updateMeasurements(update)
    })

    return (
        <div className={styles.vehicle}>
            <Tabs
                items={[
                    { label: "Levitation", path: "levitation" },
                    { label: "Propulsion", path: "propulsion" },
                    { label: "Power", path: "power" },
                ]}
            />
            <div className={styles.content}>
                <Outlet />
            </div>
        </div>
    );
};
