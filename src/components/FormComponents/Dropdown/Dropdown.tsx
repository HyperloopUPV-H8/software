import styles from "components/FormComponents/Dropdown/Dropdown.module.scss";

type Props = {
    options: string[];
    onChange: (newValue: string) => void;
};

export const Dropdown = ({ options, onChange }: Props) => {
    return (
        <select
            name=""
            className={styles.select}
            onChange={(ev) => {
                onChange(ev.target.value);
            }}
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
