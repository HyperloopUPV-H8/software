import styles from "./MessagesContainer.module.scss";
import { Messages } from "./Messages/Messages";
import { useMessages } from "components/MessagesContainer/useMessages";
import { Message } from "common";

export const MessagesContainer = () => {
    const messages = useMessages();

    if (messages.length > 0) {
        return <Messages messages={messages} />;
    } else {
        return (
            <div className={styles.emptyAlert}>
                Messages will be displayed here
            </div>
        );
    }
};
