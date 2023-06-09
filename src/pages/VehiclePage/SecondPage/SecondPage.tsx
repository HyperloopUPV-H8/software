import styles from "./SecondPage.module.scss";
import { MessagesContainer } from "components/MessagesContainer/MessagesContainer";
import { StateOrders } from "components/StateOrders/StateOrders";
import { EmergencyOrders } from "components/EmergencyOrders/EmergencyOrders";
import { LevitationSection } from "components/ControlSections/LevitationSection/LevitationSection";
import { extractLevitationData } from "common";
import { useMeasurements } from "../useMeasurements";

export const SecondPage = () => {
    const measurements = useMeasurements();

    return (
        <div className={styles.secondPageWrapper}>
            <LevitationSection data={extractLevitationData(measurements)} />
            {import.meta.env.MODE != "jury" && (
                <>
                    <MessagesContainer />
                    <div className={styles.ordersColumn}>
                        <StateOrders />
                        <EmergencyOrders />
                    </div>
                </>
            )}
        </div>
    );
};
