import styles from "./ValueWithUnits.module.scss";

type Props = {
    value: number;
    units: string;
};

export const ValueWithUnits = ({ value, units }: Props) => {
    return (
        <article className={styles.valueWithUnitsWrapper}>
            <div className={styles.value}>{value.toFixed(2)}</div>
            <div className={styles.units}>{units}</div>
        </article>
    );
};
