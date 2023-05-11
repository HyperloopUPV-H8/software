import { Message } from "common";
import { ProtectionView } from "./ProtectionView/ProtectionView";

type Props = {
    message: Message;
    className: string;
};

export const Content = ({ message, className }: Props) => {
    return (
        <ProtectionView
            className={`${className}`}
            protection={message.protection}
        />
    );
};
