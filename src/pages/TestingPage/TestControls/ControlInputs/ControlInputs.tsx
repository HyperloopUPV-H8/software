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
            {Object.entries(form.formData).map((testAttribute) => {
                return (
                    <ToggleInput
                        key={testAttribute[0]}
                        id={testAttribute[1].id}
                        type={testAttribute[1].type}
                        disabled={!testAttribute[1].enabled}
                        value={
                            testAttribute[1].value ? testAttribute[1].value : ""
                        }
                        onToggle={(state) => {
                            changeEnable(testAttribute[1].id, state);
                        }}
                        onChange={(state) => {
                            changeValue(testAttribute[1].id, state);
                        }}
                    />
                );
            })}
        </form>
    );
};
