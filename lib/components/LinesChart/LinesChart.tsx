import styles from "./LinesChart.module.scss";
import { useLines } from "./useLines";
import { VerticalAxis } from "./VerticalAxis/VerticalAxis";
import { LinesWithGrid } from "./LinesWithGrid/LinesWithGrid";
import { LineDescription } from "./types";

type Props = {
    items: Array<LineDescription>;
    divisions: number;
    showGrid?: boolean;
    length: number;
    width?: string;
    height?: string;
    className?: string;
};

const viewBoxWidth = 1000;
const viewBoxHeight = 1000;

export const LinesChart = ({
    items,
    divisions,
    length,
    showGrid = true,
    width = "100%",
    height = "100%",
    className = "",
}: Props) => {
    const { ref, range } = useLines(viewBoxWidth, viewBoxHeight, length, items);

    return (
        <div className={`${styles.imperativeChartWrapper} ${className}`}>
            <VerticalAxis divisions={divisions} min={range[0]} max={range[1]} />
            <LinesWithGrid
                chartRef={ref}
                height={height}
                width={width}
                showGrid={showGrid}
                viewBoxHeight={viewBoxHeight}
                viewBoxWidth={viewBoxWidth}
                gridDivisions={divisions}
            ></LinesWithGrid>
        </div>
    );
};
