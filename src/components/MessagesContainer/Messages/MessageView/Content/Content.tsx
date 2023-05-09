import { Message } from "common";
import { ProtectionView } from "./ProtectionView/ProtectionView";

type Props = {
    message: Message;
    className: string;
};

export const Content = ({ message, className }: Props) => {
    if (message.kind == "fault" || message.kind == "warning") {
        return (
            <ProtectionView
                className={`${className}`}
                protection={message.protection}
            />
        );
    } else {
        return <div>{message.msg}</div>;
    }
};
