import { createContext } from "react";
import styles from "./Figure.module.scss";
type FigureConfig = {
    width: number;
    height: number;
    minY: number;
    maxY: number;
};

type Props = {
    minY: number;
    maxY: number;
    children: React.ReactNode;
};

const viewBoxWidth = 1000;
const viewBoxHeight = 1000;

export const FigureContext = createContext<FigureConfig | null>(null);

export const Figure = ({ minY, maxY, children }: Props) => {
    return (
        <FigureContext.Provider
            value={{ width: viewBoxWidth, height: viewBoxHeight, minY, maxY }}
        >
            {/* This div allows the contained svg to resize appropriately */}
            <div className={styles.figureWrapper}>
                <svg
                    className={styles.svg}
                    width="100%"
                    height="100%"
                    viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
                    preserveAspectRatio="none"
                    fill="none"
                >
                    {children}
                </svg>
            </div>
        </FigureContext.Provider>
    );
};
