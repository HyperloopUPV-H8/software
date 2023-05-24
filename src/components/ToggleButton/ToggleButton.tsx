import { useToggle } from "hooks/useToggle";
import {
    ButtonHTMLAttributes,
    DetailedHTMLProps,
    ReactNode,
    useEffect,
} from "react";
import style from "./ToggleButton.module.scss";
import { SendJsonMessage } from "react-use-websocket/dist/lib/types";

type ControlOrder = {
    variable: string;
    state: boolean;
};

type Props = {
    label: string;
    icon: ReactNode;
    sendJsonMessage: SendJsonMessage;
    onToggle?: (state: boolean) => void;
} & Omit<
    DetailedHTMLProps<
        ButtonHTMLAttributes<HTMLButtonElement>,
        HTMLButtonElement
    >,
    "onClick"
>;

export function ToggleButton({
    label,
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
                    sendOrder(!isOn, label, sendJsonMessage); //FIXME, the actualization of flip hasn't effect here yet
                }}
                {...buttonProps}
            >
                {icon}
            </button>
            <p>{label}</p>
        </label>
    );
}

function sendOrder(
    isOn: boolean,
    label: string,
    sendJsonMessage: SendJsonMessage
) {
    if (isOn) {
        console.log("Sending Control Order");
        switch (label) {
            case "levitation":
        }
    }
    const controlOrder: ControlOrder = { variable: label, state: isOn };
    sendJsonMessage(controlOrder); //FIXME
    console.log("Form Data sent!");
}
