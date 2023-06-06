import { ToggleButton } from "components/ToggleButton/ToggleButton";
import { ReactComponent as BreakIcon } from "assets/svg/breakIcon.svg";
import { ReactComponent as PropulseIcon } from "assets/svg/propulseIcon.svg";
import { ReactComponent as LevitateIcon } from "assets/svg/levitateIcon.svg";
import style from "./ControlButtons.module.scss";
import { SendJsonMessage } from "react-use-websocket/dist/lib/types";

type Props = {
    sendJsonMessage: SendJsonMessage;
};

export const ControlButtons = ({ sendJsonMessage }: Props) => {
    return (
        <div className={style.controlsWrapper}>
            <ToggleButton
                id={0}
                label="levitation"
                icon={<LevitateIcon />}
                sendJsonMessage={sendJsonMessage}
            />
            <ToggleButton
                id={1}
                label="propulsion"
                icon={<PropulseIcon />}
                sendJsonMessage={sendJsonMessage}
            />
            <ToggleButton
                id={2}
                label="brake"
                icon={<BreakIcon />}
                sendJsonMessage={sendJsonMessage}
            />
        </div>
    );
};
