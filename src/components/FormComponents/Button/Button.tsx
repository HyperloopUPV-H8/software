import styles from "components/FormComponents/Button/Button.module.scss";

type Props = {
    label: string;
    onClick: () => void;
    disabled?: boolean;
};

export const Button = ({ label, onClick, disabled }: Props) => {
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
        >
            {label}
        </div>
    );
};
