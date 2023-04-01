import styles from "components/FormComponents/Button/Button.module.scss";

type Props = {
    label: string;
    onClick: () => void;
    disabled?: boolean;
    color?: string;
};

export const Button = ({ label, color = "", onClick, disabled }: Props) => {
    return (
        <div
            className={`${styles.buttonWrapper} ${
                disabled ? styles.disabled : styles.enabled
            }`}
            onClick={() => {
                if (!disabled) {
                    onClick();
                }
            }}
            style={{ backgroundColor: color }}
        >
            {label}
        </div>
    );
};
