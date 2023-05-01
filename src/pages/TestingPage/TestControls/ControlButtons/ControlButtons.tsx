import { ToggleButton } from "components/ToggleButton/ToggleButton";
import { ReactComponent as BreakIcon } from "assets/svg/breakIcon.svg";
import { ReactComponent as PropulseIcon } from "assets/svg/propulseIcon.svg";
import { ReactComponent as LevitateIcon } from "assets/svg/levitateIcon.svg";
import style from "./ControlButtons.module.scss";

export const ControlButtons = () => {
    return (
        <div className={style.controlsWrapper}>
            <ToggleButton label="levitation" icon={<LevitateIcon />} />
            <ToggleButton label="propulsion" icon={<PropulseIcon />} />
            <ToggleButton label="brake" icon={<BreakIcon />} />
        </div>
    );
};
