import { ToggleButton } from "components/ToggleButton/ToggleButton";
import { ToggleInput } from "components/ToggleInput/ToggleInput";
import { ReactComponent as BreakIcon } from "assets/svg/breakIcon.svg";
import { ReactComponent as PropulseIcon } from "assets/svg/propulseIcon.svg";
import { ReactComponent as LevitateIcon } from "assets/svg/levitateIcon.svg";
import { ReactComponent as PerturbationIcon } from "assets/svg/perturbationIcon.svg";
import { PlayButton } from "components/PlayButton/PlayButton";
import { ButtonTag } from "components/ButtonTag/ButtonTag";
import style from "./TestControls.module.scss";
import { useEffect } from "react";
import { useControlForm, FormData } from "./useControlForm";

const initialFormData = [
    {
        id: "unit0",
        type: "number",
        value: null,
        enabled: false,
        validity: { isValid: false, msg: "xxx" },
    },
    {
        id: "unit1",
        type: "number",
        value: null,
        enabled: false,
        validity: { isValid: false, msg: "xxx" },
    },
    {
        id: "unit2",
        type: "number",
        value: null,
        enabled: false,
        validity: { isValid: false, msg: "xxx" },
    },
    {
        id: "unit3",
        type: "number",
        value: null,
        enabled: false,
        validity: { isValid: true, msg: "xxx" },
    },
    {
        id: "unit4",
        type: "number",
        value: null,
        enabled: false,
        validity: { isValid: false, msg: "xxx" },
    },
    {
        id: "unit5",
        type: "number",
        value: null,
        enabled: false,
        validity: { isValid: false, msg: "xxx" },
    },
    {
        id: "unit6",
        type: "number",
        value: null,
        enabled: true,
        validity: { isValid: false, msg: "xxx" },
    },
    {
        id: "unit7",
        type: "number",
        value: 10,
        enabled: true,
        validity: { isValid: true, msg: "xxx" },
    },
    {
        id: "unit8",
        type: "number",
        value: null,
        enabled: false,
        validity: { isValid: false, msg: "xxx" },
    },
    {
        id: "unit9",
        type: "number",
        value: null,
        enabled: false,
        validity: { isValid: false, msg: "xxx" },
    },
    {
        id: "unit10",
        type: "number",
        value: null,
        enabled: false,
        validity: { isValid: false, msg: "xxx" },
    },
];

export const TestControls = () => {
    const [FormData, isValid, ChangeValue, ChangeEnable, SubmitHandler] =
        useControlForm(initialFormData);

    useEffect(() => {
        console.log(FormData);
        console.log("isValid: " + isValid);
    }, [FormData]);

    return (
        <div className={style.testControlsWrapper}>
            <div className={style.playWrapper}>
                <PlayButton variant="play" />
                <PlayButton variant="disabled" />
            </div>
            <div className={style.sectionWrapper}>
                <div className={style.title}>Controls</div>
                <div className={style.body}>
                    <div className={style.controlsWrapper}>
                        <ToggleButton
                            label="levitation"
                            icon={<LevitateIcon />}
                        />
                        <ToggleButton
                            label="propulsion"
                            icon={<PropulseIcon />}
                        />
                        <ToggleButton label="brake" icon={<BreakIcon />} />
                    </div>
                    <form className={style.inputWrapper}>
                        {Object.entries(FormData).map((testAttribute) => {
                            return (
                                <ToggleInput
                                    key={testAttribute[0]}
                                    id={testAttribute[1].id}
                                    type={testAttribute[1].type}
                                    disabled={!testAttribute[1].enabled}
                                    value={
                                        testAttribute[1].value
                                            ? testAttribute[1].value
                                            : ""
                                    }
                                    onToggle={(state) => {
                                        ChangeEnable(
                                            testAttribute[1].id,
                                            state
                                        );
                                    }}
                                    onChange={(state) => {
                                        ChangeValue(testAttribute[1].id, state);
                                    }}
                                />
                            );
                        })}
                    </form>
                    <ButtonTag
                        type="submit"
                        icon={<PerturbationIcon />}
                        onClick={() => {
                            SubmitHandler();
                        }}
                        disabled={!isValid}
                    />
                </div>
            </div>
        </div>
    );
};
