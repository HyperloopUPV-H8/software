import { useMessages } from ".";
import { Messages } from "./Messages/Messages";

export const MessagesContainer = () => {
    const messages = useMessages();

    return <Messages messages={messages} />;
};
