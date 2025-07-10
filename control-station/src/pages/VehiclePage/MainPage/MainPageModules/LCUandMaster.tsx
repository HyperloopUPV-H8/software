import { VcuMeasurements } from "common";
import { StateIndicator } from "components/StateIndicator/StateIndicator";
import { Window } from "components/Window/Window";
import teamLogo from "assets/svg/team_logo.svg"
import { LCU } from "pages/VehiclePage/Boards/LCU/LCU";
import styles from "../MainPage.module.scss"
import { EnumIndicator } from "components/EnumIndicator/EnumIndicator";

export const LCUandMaster = () => {

    return (
        <div className={styles.LCUandMaster}>
        <LCU/>
        <Window title="Vehicle State">
            <EnumIndicator measurementId={VcuMeasurements.operationalState} icon={teamLogo} />
        </Window>
        </div>
    );
};

