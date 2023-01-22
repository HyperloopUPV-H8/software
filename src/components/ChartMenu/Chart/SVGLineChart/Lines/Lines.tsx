import { LineFigure } from "components/ChartMenu/Chart/SVGLineChart/LineFigure/LineFigure";
import { LineFigure as LineFigureElement } from "components/ChartMenu/ChartElement";
import { useId } from "hooks/useId";
type Props = {
    lineFigures: Map<string, LineFigureElement>;
    maxOfLines: number;
    minOfLines: number;
    viewBoxWidth: number;
    viewBoxHeight: number;
};
export const Lines = ({
    lineFigures,
    maxOfLines,
    minOfLines,
    viewBoxWidth,
    viewBoxHeight,
}: Props) => {
    const symbolId = useId();

    return (
        <>
            <symbol
                id={symbolId}
                width="100%"
                height="100%"
                viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
                preserveAspectRatio="none"
            >
                {Array.from(lineFigures.entries()).map(([key, lineFigure]) => {
                    return (
                        <LineFigure
                            key={key}
                            lineFigure={lineFigure}
                            max={maxOfLines}
                            min={minOfLines}
                            viewBoxWidth={viewBoxWidth}
                            viewBoxHeight={viewBoxHeight}
                        ></LineFigure>
                    );
                })}
            </symbol>
            <use href={`#${symbolId}`} x="0" y="0" />
        </>
    );
};
