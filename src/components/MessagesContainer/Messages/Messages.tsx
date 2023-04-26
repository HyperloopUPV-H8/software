import styles from "./Messages.module.scss";
import { ProtectionMessage } from "common";
import { MessageView } from "./MessageView/MessageView";
import { useAutoScroll } from "./useAutoScroll";

type Props = {
    messages: Array<ProtectionMessage>;
};

export const Messages = ({ messages }: Props) => {
    const { ref, handleScroll } = useAutoScroll(messages);

    return (
        <section
            ref={ref}
            onScroll={handleScroll}
            className={styles.messages}
        >
            {messages.map((message) => {
                return (
                    <MessageView
                        key={message.id}
                        message={message}
                    />
                );
            })}
        </section>
    );
};
