import styles from "./SecondPage.module.scss";
import { MessagesContainer } from "components/MessagesContainer/MessagesContainer";
import { StateOrders } from "components/StateOrders/StateOrders";
import { EmergencyOrders } from "components/EmergencyOrders/EmergencyOrders";
import { useMeasurements } from "../useMeasurements";
import { extractLevitationData } from "components/ControlSections/LevitationSection/extractLevitationData";
import { LevitationSection } from "components/ControlSections/LevitationSection/LevitationSection";

export const SecondPage = () => {
    const measurements = useMeasurements();

    return (
        <div className={styles.secondPageWrapper}>
            <LevitationSection data={extractLevitationData(measurements)} />
            <MessagesContainer />
            <div className={styles.ordersColumn}>
                <StateOrders />
                <EmergencyOrders />
            </div>
        </div>
    );
};
