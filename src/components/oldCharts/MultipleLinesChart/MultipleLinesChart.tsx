import { Measurement } from "models/PodData/Measurement";
import { Figure } from "components/Charts/Figure/Figure";
import { Line } from "components/Charts/Line/Line";
import { useMultipleLinesData } from "../useMultipleLinesData";

type Props = {
    measurements: Measurement[];
    useMeasurementLimits: boolean;
};

export const MultipleLinesChart = ({ measurements }: Props) => {
    const { dataArr, minY, maxY } = useMultipleLinesData(measurements);

    return (
        <Figure
            minY={
                measurements[0].warningRange[0]
                    ? measurements[0].warningRange[0]
                    : minY
            }
            maxY={
                measurements[0].warningRange[1]
                    ? measurements[0].warningRange[1]
                    : maxY
            }
        >
            {dataArr.map((lineData, index) => {
                return (
                    <Line
                        key={index}
                        data={lineData}
                        strokeWidth={3}
                        strokeColor={"#358AEE"}
                        fillColor={"#358AEE30"}
                    />
                );
            })}
        </Figure>
    );
};
