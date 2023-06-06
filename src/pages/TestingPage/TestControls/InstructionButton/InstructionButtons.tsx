import { SendJsonMessage } from "react-use-websocket/dist/lib/types";
import style from "./InstructionButtons.module.scss";
import { ReactComponent as PerturbationIcon } from "assets/svg/perturbationIcon.svg";
import { InstructionButton } from "components/InstructionButton/InstructionButton";

type Props = {
    sendJsonMessage: SendJsonMessage;
};

export const InstructionButtons = ({ sendJsonMessage }: Props) => {
    return (
        <div className={style.instructionsWrapper}>
            <InstructionButton
                id={3}
                icon={<PerturbationIcon />}
                sendJsonMessage={sendJsonMessage}
            />
            <InstructionButton
                id={4}
                icon={<PerturbationIcon />}
                sendJsonMessage={sendJsonMessage}
            />
            <InstructionButton
                id={5}
                icon={<PerturbationIcon />}
                sendJsonMessage={sendJsonMessage}
            />
            <InstructionButton
                id={6}
                icon={<PerturbationIcon />}
                sendJsonMessage={sendJsonMessage}
            />
        </div>
    );
};
