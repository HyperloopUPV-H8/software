import styles from "./VCU.module.scss";
import { Window } from "components/Window/Window";
import { useMeasurementsStore, VcuMeasurements } from "common";
import { GaugeTag } from "components/GaugeTag/GaugeTag";
import vehicleTrack from "assets/svg/vehicle-track.svg";

export const VCUPositionInfo = () => {

    const getNumericMeasurementInfo = useMeasurementsStore(state => state.getNumericMeasurementInfo);
    const speed = getNumericMeasurementInfo(VcuMeasurements.speed);
    const acceleration = getNumericMeasurementInfo(VcuMeasurements.acceleration);

    return (
        <Window title="VCU">
            <div className={styles.vcuPositionInfo}>
                <div className={styles.row}>
                    <GaugeTag 
                        name={speed.name}
                        units={speed.units}
                        getUpdate={speed.getUpdate}
                        strokeWidth={120}
                        min={speed.range[0] || 0}
                        max={speed.range[1] || 50}
                    />
                    <GaugeTag 
                        name={acceleration.name}
                        units={acceleration.units}
                        getUpdate={acceleration.getUpdate}
                        strokeWidth={120}
                        min={acceleration.range[0] || 0}
                        max={acceleration.range[1] || 50}
                    />
                </div>

                <div className={styles.trackContainer}>
                    <img src={vehicleTrack} alt="Vehicle Track" />
                </div>
            </div>
        </Window>
    );
};
