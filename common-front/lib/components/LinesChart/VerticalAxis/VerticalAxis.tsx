import { nanoid } from "nanoid";
import { useMemo } from "react";
import styles from "./VerticalAxis.module.scss";

type AxisMark = {
    id: string;
    value: number;
};

type Props = {
    min: number;
    max: number;
    divisions: number;
};

export const VerticalAxis = ({ min, max, divisions }: Props) => {
    if (divisions == 0) {
        return null;
    }

    const marks = useMemo(
        () => getAxisMarks(min, max, divisions),
        [min, max, divisions]
    );

    return (
        <div className={styles.verticalAxisWrapper}>
            {marks.map((mark) => {
                return (
                    <div
                        key={mark.id}
                        className={styles.value}
                    >
                        {mark.value.toFixed(1)}
                    </div>
                );
            })}
        </div>
    );
};

function getAxisMarks(
    min: number,
    max: number,
    divisions: number
): AxisMark[] {
    const marks: AxisMark[] = [];

    for (let i = 0; i < divisions + 1; i++) {
        marks.push({
            id: nanoid(),
            value: (i * (max - min)) / divisions + min,
        });
    }

    return marks;
}
