import styles from "@components/FormComponents/Button.module.scss";

type Props = {
  onClick: () => void;
};

export const Button = ({ onClick }: Props) => {
  return (
    <div id={styles.button} onClick={onClick}>
      Send
    </div>
  );
};
