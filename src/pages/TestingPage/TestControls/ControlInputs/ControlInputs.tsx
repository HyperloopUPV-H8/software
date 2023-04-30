import { ToggleInput } from "components/ToggleInput/ToggleInput";
import style from "./ControlInputs.module.scss";
import { ChangeEnable, ChangeValue, Form } from "../TestAttributes";

type Props = {
    form: Form;
    changeEnable: ChangeEnable;
    changeValue: ChangeValue;
};

export const ControlInputs = ({ form, changeEnable, changeValue }: Props) => {
    return (
        <form className={style.inputWrapper}>
            {Object.entries(form.formData).map(([name, attributes]) => {
                return (
                    <ToggleInput
                        key={name}
                        id={attributes.id}
                        type={attributes.type}
                        disabled={!attributes.enabled}
                        value={attributes.value ? attributes.value : ""}
                        onToggle={(state) => {
                            changeEnable(attributes.id, state);
                        }}
                        onChange={(state) => {
                            changeValue(attributes.id, state);
                        }}
                    />
                );
            })}
        </form>
    );
};
