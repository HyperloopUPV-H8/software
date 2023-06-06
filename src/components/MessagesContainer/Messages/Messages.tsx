import { Message } from "common";
import styles from "./Messages.module.scss";
import { MessageView } from "./MessageView/MessageView";
import { useAutoScroll } from "./useAutoScroll";

type Props = {
    messages: Array<Message>;
};

export const Messages = ({ messages }: Props) => {
    const { ref, handleScroll } = useAutoScroll(messages);

    return (
        <section
            ref={ref}
            onScroll={handleScroll}
            className={styles.wrapper}
        >
            <div className={styles.messages}>
                {messages.map((message) => {
                    return (
                        <MessageView
                            key={message.id}
                            message={message}
                        />
                    );
                })}
            </div>
        </section>
    );
};
