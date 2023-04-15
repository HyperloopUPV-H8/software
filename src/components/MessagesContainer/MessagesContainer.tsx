import { Messages } from "./Messages/Messages";
import { useMessages } from "components/MessagesContainer/useMessages";

export const MessagesContainer = () => {
    const messages = useMessages();
    if (messages.length > 0) {
        return <Messages messages={messages} />;
    } else {
        return (
            <div style={{ alignSelf: "center" }}>
                Messages will be displayed here
            </div>
        );
    }
};
