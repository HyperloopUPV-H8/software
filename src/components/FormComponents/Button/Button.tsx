import styles from "@components/FormComponents/Button/Button.module.scss";

type Props = {
  disabled: boolean;
  onClick: () => void;
};

export const Button = ({ disabled, onClick }: Props) => {
  return (
    <div
      className={`${styles.button} ${
        disabled ? styles.disabled : styles.enabled
      }`}
      onClick={() => {
        if (!disabled) {
          onClick();
        }
      }}
    >
      Send
    </div>
  );
};
