import { BarIndicator } from "components/BarIndicator/BarIndicator"
import { Window } from "components/Window/Window";
import pressure from 'assets/svg/pressure-filled.svg'
import thermometer from 'assets/svg/thermometer-field.svg'
import { useMeasurementsStore, VcuMeasurements } from "common";
import styles from '../MainPage.module.scss'

export const Pneumatic = () => {
    const getNumericMeasurementInfo = useMeasurementsStore((state) => state.getNumericMeasurementInfo);

    const HighPressure = getNumericMeasurementInfo(VcuMeasurements.pressureHigh);
    const BrakesPressure = getNumericMeasurementInfo(VcuMeasurements.pressureBrakes);
    const CapsulePressure = getNumericMeasurementInfo(VcuMeasurements.pressureCapsule);
    const CoolingEM = getNumericMeasurementInfo('');
    const CoolingPCB = getNumericMeasurementInfo('');

    return (
    <Window title='Pneumatic and Cooling'>
        <div className={styles.pneumatic}>
        <BarIndicator
            name="High Pressure"
            icon={pressure}
            getValue={HighPressure.getUpdate}
            safeRangeMin={HighPressure.range[0]!!}
            safeRangeMax= {HighPressure.range[1]!!}
            warningRangeMin={HighPressure.warningRange[0]!!}
            warningRangeMax={HighPressure.warningRange[1]!!}
            units={HighPressure.units}
        />
        <BarIndicator
            name="Brakes Pressure"
            icon={pressure}
            getValue={BrakesPressure.getUpdate}
            safeRangeMin={BrakesPressure.range[0]!!}
            safeRangeMax={BrakesPressure.range[1]!!}
            warningRangeMin={BrakesPressure.warningRange[0]!!}
            warningRangeMax={BrakesPressure.warningRange[1]!!}
            units={BrakesPressure.units}
        />
        <BarIndicator
            name="Capsule Pressure"
            icon={pressure}
            getValue={CapsulePressure.getUpdate}
            safeRangeMin={CapsulePressure.range[0]!!}
            safeRangeMax={CapsulePressure.range[1]!!}
            warningRangeMin={CapsulePressure.warningRange[0]!!}
            warningRangeMax={CapsulePressure.warningRange[1]!!}
            units={CapsulePressure.units}
        />
        <BarIndicator
            name="Cooling EM"
            icon={thermometer}
            getValue={CoolingEM.getUpdate}
            safeRangeMin={CoolingEM.range[0]!!}
            safeRangeMax={CoolingEM.range[1]!!}
            warningRangeMin={CoolingEM.warningRange[0]!!}
            warningRangeMax={CoolingEM.warningRange[1]!!}
            units={CoolingEM.units}
        />
        <BarIndicator
            name="Cooling PCB"
            icon={thermometer}
            getValue={CoolingPCB.getUpdate}
            safeRangeMin={CoolingPCB.range[0]!!}
            safeRangeMax={CoolingPCB.range[1]!!}
            warningRangeMin={CoolingPCB.warningRange[0]!!}
            warningRangeMax={CoolingPCB.warningRange[1]!!}
            units={CoolingPCB.units}
        />
        </div>
    </Window>
    )
}