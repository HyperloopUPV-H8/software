import styles from "./BooleanBar.module.scss";

type Props = { isOn: boolean };

export const BooleanBar = ({ isOn }: Props) => {
    return <div className={`${styles.bar} ${isOn ? styles.active : ""}`}></div>;
};
