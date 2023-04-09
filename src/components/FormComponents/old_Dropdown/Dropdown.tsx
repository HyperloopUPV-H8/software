import styles from "components/FormComponents/Dropdown/Dropdown.module.scss";

type Props = {
    options: string[];
    onChange: (newValue: string) => void;
    defaultValue?: string;
};

export const Dropdown = ({ options, onChange, defaultValue = "" }: Props) => {
    return (
        <select
            name=""
            className={styles.select}
            onChange={(ev) => onChange(ev.target.value)}
        >
            {options.map((option, index) => {
                return (
                    <option
                        defaultValue={defaultValue} //FIXME: no funciona
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
