import { useLineData } from "components/Charts/useLineData";
import { Measurement } from "models/PodData/Measurement";
import { Figure } from "components/Charts/Figure/Figure";
import { Line } from "components/Charts/Line/Line";

type Props = {
    measurement: Measurement;
    useMeasurementLimits: boolean;
};

export const SingleLineChart = ({
    measurement,
    useMeasurementLimits,
}: Props) => {
    const [data, minY, maxY] = useLineData(measurement);

    return (
        <Figure
            minY={useMeasurementLimits ? measurement.warningRange[0] : minY}
            maxY={useMeasurementLimits ? measurement.warningRange[1] : maxY}
        >
            <Line
                data={data}
                strokeWidth={3}
                strokeColor={"#358AEE"}
                fillColor={"#358AEE30"}
            />
        </Figure>
    );
};
