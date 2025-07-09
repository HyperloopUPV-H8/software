import { VcuMeasurements } from "common";
import { StateIndicator } from "components/StateIndicator/StateIndicator";
import { Window } from "components/Window/Window";
import { LCU } from "pages/VehiclePage/Boards/LCU/LCU";
import styles from "../MainPage.module.scss"

export const LCUandMaster = () => {

    return (
        <div className={styles.LCUandMaster}>
        <LCU/>
        <Window title="Vehicle State">
            <StateIndicator measurementId={VcuMeasurements.operationalState} icon={""} />
        </Window>
        </div>
    );
};

