import styles from "./LinesChart.module.scss";
import { useLines } from "./useLines";
import { VerticalAxis } from "./VerticalAxis/VerticalAxis";
import { LinesWithGrid } from "./LinesWithGrid/LinesWithGrid";
import { LineDescription } from "./types";

type Props = {
    items: Array<LineDescription>;
    divisions: number;
    grid: boolean;
    length: number;
    width?: string;
    height?: string;
};

const viewBoxWidth = 1000;
const viewBoxHeight = 1000;

export const LinesChart = ({
    items,
    divisions,
    length,
    width,
    height,
}: Props) => {
    const { ref, range } = useLines(viewBoxWidth, viewBoxHeight, length, items);

    return (
        <div className={styles.imperativeChartWrapper}>
            <VerticalAxis
                divisions={divisions}
                min={range[0]}
                max={range[1]}
            />
            <LinesWithGrid
                chartRef={ref}
                height={height}
                width={width}
                grid={false}
                viewBoxHeight={viewBoxHeight}
                viewBoxWidth={viewBoxWidth}
                gridDivisions={divisions}
            ></LinesWithGrid>
        </div>
    );
};
