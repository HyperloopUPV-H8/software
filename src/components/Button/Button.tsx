import styles from "./Button.module.scss";

type Props = {
    label: string;
    onClick: (ev: React.MouseEvent) => void;
};

export const Button = ({ label, onClick }: Props) => {
    return (
        <span
            className={styles.buttonWrapper}
            onClick={onClick}
        >
            {label}
        </span>
    );
};
