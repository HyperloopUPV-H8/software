import { useMemo } from "react";
import styles from "./Kenos.module.scss";

type Props = {
    position: number;
};

const LENGTH_TUBE: number = 100;

function getPorcentagePosition(position: number): string {
    return (position * 100) / LENGTH_TUBE + "%";
}

export const Kenos = ({ position }: Props) => {
    //TODO:create the porcentage with the total, warningRange
    const porcentagePosition = useMemo(
        () => getPorcentagePosition(position),
        [position]
    );

    return (
        <div className={styles.kenos} style={{ left: porcentagePosition }} />
    );
};
