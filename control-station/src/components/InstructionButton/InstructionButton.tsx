import { useToggle } from "hooks/useToggle";
import {
    ButtonHTMLAttributes,
    DetailedHTMLProps,
    ReactNode,
    useEffect,
} from "react";
import { SendJsonMessage } from "react-use-websocket/dist/lib/types";
import style from "./InstructionButton.module.scss";

type ControlOrder = {
    id: number;
    state: boolean;
};

type Props = {
    id: number;
    icon: ReactNode;
    sendJsonMessage: SendJsonMessage;
    onToggle?: (state: boolean) => void;
} & Omit<
    DetailedHTMLProps<
        ButtonHTMLAttributes<HTMLButtonElement>,
        HTMLButtonElement
    >,
    "onClick" | "id"
>;

export function InstructionButton({
    id,
    icon,
    sendJsonMessage,
    onToggle,
    ...buttonProps
}: Props) {
    const [isOn, flip] = useToggle(false);

    useEffect(() => {
        onToggle?.(isOn);
    }, [isOn]);

    const labelClass = `${style.toggleButtonWrapper} ${
        isOn ? style.on : style.off
    }`;
    return (
        <label className={labelClass}>
            <button
                onClick={() => {
                    flip();
                    sendOrder(!isOn, id, sendJsonMessage);
                }}
                {...buttonProps}
            >
                {icon}
                <p>Custom {id}</p>
            </button>
        </label>
    );
}

function sendOrder(
    isOn: boolean,
    id: number,
    sendJsonMessage: SendJsonMessage
) {
    const controlOrder: ControlOrder = { id: id, state: isOn };
    sendJsonMessage(controlOrder);
}
