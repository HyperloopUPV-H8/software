import styles from "./SecondPage.module.scss";
import { MessagesContainer } from "components/MessagesContainer/MessagesContainer";
import { StateOrders } from "components/StateOrders/StateOrders";
import { EmergencyOrders } from "components/EmergencyOrders/EmergencyOrders";
import { LevitationSection } from "components/ControlSections/LevitationSection/LevitationSection";
import { extractLevitationData } from "components/ControlSections/LevitationSection/extractLevitationData";

export const SecondPage = () => {
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
