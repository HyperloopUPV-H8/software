import styles from "@components/FormComponents/CheckBox.module.scss";
import { ChangeEvent } from "react";

type Props = {
  onChange: (value: boolean) => void;
};

export const CheckBox = ({ onChange }: Props) => {
  return (
    <input
      type="checkbox"
      onChange={(ev: ChangeEvent<HTMLInputElement>) => {
        onChange(Boolean(ev.target.value));
      }}
      id={styles.checkBox}
    />
  );
};
