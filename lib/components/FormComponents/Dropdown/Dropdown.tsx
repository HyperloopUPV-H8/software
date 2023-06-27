import { EnumInputData } from "../../..";
import styles from "./Dropdown.module.scss";

type Props = EnumInputData & {
    onChange?: (v: string) => void;
};

export const Dropdown = ({ value, options, onChange = () => {} }: Props) => {
    return (
        <select
            name=""
            className={styles.select}
            value={value}
            onChange={(ev) => onChange(ev.target.value)}
        >
            {options.map((option, index) => {
                return (
                    <option
                        key={index}
                        value={option}
                    >
                        {option}
                    </option>
                );
            })}
        </select>
    );
};
