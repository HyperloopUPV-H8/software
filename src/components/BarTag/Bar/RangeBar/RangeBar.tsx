import styles from "components/BarTag/Bar/RangeBar/RangeBar.module.scss";
type Props = {
    type: "range" | "temp";
    value: number;
    min: number;
    max: number;
};

function clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
}

function normalize(value: number, min: number, max: number) {
    return (value - min) / (max - min);
}

export const RangeBar = ({ type, value, min, max }: Props) => {
    const oppositeHeight =
        (1 - normalize(clamp(value, min, max), min, max)) * 100;
    return (
        <div className={type == "temp" ? styles.tempWrapper : ""}>
            <div
                className={`barWrapper ${styles.rangeBarWrapper} ${
                    type == "range" ? styles.range : styles.temp
                }`}
            >
                <div
                    className={styles.content}
                    style={{
                        height: `${oppositeHeight}%`,
                    }}
                ></div>
            </div>
            {type == "temp" && <div className={styles.bulb}></div>}
        </div>
    );
};
