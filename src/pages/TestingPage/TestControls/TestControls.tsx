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
import { initialFormDescription } from "./initialFormDataMock";
import { ControlButtons } from "./ControlButtons/ControlButtons";
import { ControlInputs } from "./ControlInputs/ControlInputs";
import {
    SendJsonMessage,
    SendMessage,
} from "react-use-websocket/dist/lib/types";

type Props = {
    sendJsonMessage: SendJsonMessage;
    sendMessage: SendMessage;
    lastMessage: MessageEvent<any> | null;
};

export const TestControls = ({
    sendJsonMessage,
    sendMessage,
    lastMessage,
}: Props) => {
    const [form, ChangeValue, ChangeEnable, SubmitHandler] = useControlForm(
        initialFormDescription
    );

    return (
        <div className={style.testControlsWrapper}>
            <div className={style.playWrapper}>
                <PlayButton
                    variant="play"
                    sendMessage={sendMessage}
                    lastMessage={lastMessage}
                />
                <PlayButton variant="stop" />
                {/*FIXME: Handle the disabled buttons*/}
            </div>
            <div className={style.sectionWrapper}>
                <div className={style.title}>Controls</div>
                <div className={style.body}>
                    <ControlButtons sendJsonMessage={sendJsonMessage} />
                    <ControlInputs
                        form={form}
                        changeEnable={ChangeEnable}
                        changeValue={ChangeValue}
                    />
                    <ButtonTag
                        type="submit"
                        icon={<PerturbationIcon />}
                        onClick={() => {
                            SubmitHandler(sendJsonMessage);
                        }}
                        disabled={!form.isValid}
                    />
                </div>
            </div>
        </div>
    );
};
