import { ToggleButton } from "components/ToggleButton/ToggleButton";
import { ToggleInput } from "components/ToggleInput/ToggleInput";
import { ReactComponent as BreakIcon } from "assets/svg/breakIcon.svg";
import { ReactComponent as PropulseIcon } from "assets/svg/propulseIcon.svg";
import { ReactComponent as LevitateIcon } from "assets/svg/levitateIcon.svg";
import { ReactComponent as PerturbationIcon } from "assets/svg/perturbationIcon.svg";
import { PlayButton } from "components/PlayButton/PlayButton";
import { ButtonTag } from "components/ButtonTag/ButtonTag";
import style from "./TestControls.module.scss";
import { useControlForm } from "./useControlForm";
import { initialFormData } from "./initialFormDataMock";
import { ControlButtons } from "./ControlButtons/ControlButtons";
import { ControlInputs } from "./ControlInputs/ControlInputs";

export const TestControls = () => {
    const [form, ChangeValue, ChangeEnable, SubmitHandler] =
        useControlForm(initialFormData);

    return (
        <div className={style.testControlsWrapper}>
            <div className={style.playWrapper}>
                <PlayButton variant="play" />
                <PlayButton variant="disabled" />
            </div>
            <div className={style.sectionWrapper}>
                <div className={style.title}>Controls</div>
                <div className={style.body}>
                    <ControlButtons />
                    <ControlInputs
                        form={form}
                        changeEnable={ChangeEnable}
                        changeValue={ChangeValue}
                    />
                    <ButtonTag
                        type="submit"
                        icon={<PerturbationIcon />}
                        onClick={() => {
                            SubmitHandler();
                        }}
                        disabled={!form.isValid}
                    />
                </div>
            </div>
        </div>
    );
};
