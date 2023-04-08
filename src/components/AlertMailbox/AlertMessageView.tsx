import { AlertMessage } from "models/AlertMessage";
import { FaultMessageView } from "./FaultMessageView/FaultMessageView";
import { WarningMessageView } from "./WarningMessageView/WarningMessageView";

type Props = {
    message: AlertMessage;
};
export const AlertMessageView = ({ message }: Props) => {
    if (message.kind == "fault") {
        return <FaultMessageView message={message} />;
    } else {
        return <WarningMessageView message={message} />;
    }
};
