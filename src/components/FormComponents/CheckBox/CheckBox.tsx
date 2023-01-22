import styles from "components/FormComponents/CheckBox/CheckBox.module.scss";
import { ChangeEvent } from "react";

type Props = {
    isRequired: boolean;
    onChange: (value: boolean) => void;
};

export const CheckBox = ({ onChange, isRequired }: Props) => {
    return (
        <input
            type="checkbox"
            required={isRequired}
            onChange={(ev: ChangeEvent<HTMLInputElement>) => {
                onChange(Boolean(ev.target.checked));
            }}
            id={styles.checkBox}
        />
    );
};
