import { BooleanInputData } from "../../..";
import styles from "./CheckBox.module.scss";
import { ChangeEvent, useState } from "react";

type Props = BooleanInputData & {
    isRequired?: boolean;
    onChange?: (value: boolean) => void;
    disabled?: boolean;
    color?: string;
};

export const CheckBox = ({
    value,
    onChange = () => {},
    disabled = false,
    isRequired = true,
    color = "blue",
}: Props) => {
    const [checked, setChecked] = useState(value);

    return (
        <input
            className={styles.checkbox}
            type="checkbox"
            disabled={disabled}
            style={{ accentColor: color }}
            required={isRequired}
            onChange={(ev: ChangeEvent<HTMLInputElement>) => {
                onChange(Boolean(ev.target.checked));
                setChecked(Boolean(ev.target.checked));
            }}
            id={styles.checkBox}
            checked={checked}
        />
    );
};
