import styles from "./Kenos.module.scss";

type Props = {
    position: number;
};

const LENGTH_TUBE: number = 100;

export const Kenos = ({ position }: Props) => {
    //TODO:create the porcentage with the total, warningRange
    //TODO: useMemo
    function porcentagePosition(): string {
        return (position * 100) / LENGTH_TUBE + "%";
    }

    return (
        <div
            className={styles.kenos}
            style={{ left: porcentagePosition() }}
            onClick={porcentagePosition}
        />
    );
};
