import styles from "components/ValueData/ValueName/ValueName.module.scss";

type Props = {
    name: string;
};

export const ValueName = ({ name }: Props) => {
    return <span className={styles.name}>{name}</span>;
};
