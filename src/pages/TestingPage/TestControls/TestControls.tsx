import { ToggleButton } from "components/ToggleButton/ToggleButton";
import { ToggleInput } from "components/ToggleInput/ToggleInput";
import { ReactComponent as BreakIcon } from "assets/svg/breakIcon.svg";
import { ReactComponent as PropulseIcon } from "assets/svg/propulseIcon.svg";
import { ReactComponent as LevitateIcon } from "assets/svg/levitateIcon.svg";
import { ReactComponent as PerturbationIcon } from "assets/svg/perturbationIcon.svg";
import { PlayButton } from "components/PlayButton/PlayButton";
import { ButtonTag } from "components/ButtonTag/ButtonTag";
import style from "./TestControls.module.scss";

export const TestControls = () => {
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
                    <div className={style.inputWrapper}>
                        <ToggleInput
                            label="unit 0"
                            type="number"
                            min={-10.0}
                            max={10.0}
                            step={0.01}
                        />
                        <ToggleInput
                            label="unit 1"
                            type="number"
                            min={-10.0}
                            max={10.0}
                            step={0.01}
                        />
                        <ToggleInput
                            label="unit 2"
                            type="number"
                            min={-10.0}
                            max={10.0}
                            step={0.01}
                        />
                        <ToggleInput
                            label="unit 3"
                            type="number"
                            min={-10.0}
                            max={10.0}
                            step={0.01}
                        />
                        <ToggleInput
                            label="unit 4"
                            type="number"
                            min={-10.0}
                            max={10.0}
                            step={0.01}
                        />
                        <ToggleInput
                            label="unit 5"
                            type="number"
                            min={-10.0}
                            max={10.0}
                            step={0.01}
                        />
                        <ToggleInput
                            label="unit 6"
                            type="number"
                            min={-10.0}
                            max={10.0}
                            step={0.01}
                        />
                        <ToggleInput
                            label="unit 7"
                            type="number"
                            min={-10.0}
                            max={10.0}
                            step={0.01}
                        />
                        <ToggleInput
                            label="force x"
                            type="number"
                            min={-10.0}
                            max={10.0}
                            step={0.01}
                        />
                    </div>
                    <ButtonTag icon={<PerturbationIcon />} />
                </div>
            </div>
        </div>
    );
};
//label=""
