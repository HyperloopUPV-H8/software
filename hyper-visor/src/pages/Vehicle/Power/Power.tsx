import { PcuMeasurements, useMeasurementsStore } from "common";
import { BatterySection } from "./components/BatterySection";
import { BatteryTag } from "./components/BatteryTag";
import { LevitationSection } from "./components/LevitationSection";
import { LevitationUnitTag } from "./components/LevitationUnitTag";
import { PowerSection } from "./components/PowerSection";
import "./Power.scss";
import { TagType } from "./models/TagType";

export const Power = () => {

    const getNumericMeasurementInfo = useMeasurementsStore((state) => state.getNumericMeasurementInfo);
    const accel = getNumericMeasurementInfo(PcuMeasurements.accel);

    return (
        <div className={"power-section"}>
            <PowerSection />
            <BatterySection
                tags={[
                    <BatteryTag
                        name={"High voltage pack - 75 V"}
                        getUpdate={accel.getUpdate}
                    />,
                    <BatteryTag
                        name={"Low voltage pack - 24 V"}
                        getUpdate={accel.getUpdate}
                    />,
                ]}
            />
            {/* <MotorSection /> */}
            <LevitationSection
                tags={[
                    <LevitationUnitTag
                        getUpdate={accel.getUpdate}
                        name={"HEMS 1"}
                        type={TagType.HEMS}
                    />,
                    <LevitationUnitTag
                        getUpdate={accel.getUpdate}
                        name={"HEMS 2"}
                        type={TagType.HEMS}
                    />,
                    <LevitationUnitTag
                        getUpdate={accel.getUpdate}
                        name={"HEMS 3"}
                        type={TagType.HEMS}
                    />,
                    <LevitationUnitTag
                        getUpdate={accel.getUpdate}
                        name={"HEMS 4"}
                        type={TagType.HEMS}
                    />,
                    <LevitationUnitTag
                        getUpdate={accel.getUpdate}
                        name={"EMS 1"}
                        type={TagType.EMS}
                    />,
                    <LevitationUnitTag
                        getUpdate={accel.getUpdate}
                        name={"EMS 2"}
                        type={TagType.EMS}
                    />,
                    <LevitationUnitTag
                        getUpdate={accel.getUpdate}
                        name={"EMS 3"}
                        type={TagType.EMS}
                    />,
                    <LevitationUnitTag
                        getUpdate={accel.getUpdate}
                        name={"EMS 4"}
                        type={TagType.EMS}
                    />,
                ]}
            />
        </div>
    );
};
