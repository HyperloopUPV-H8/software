import { Button, Message, useMessagesStore } from "../../..";
import styles from "./Messages.module.scss";
import { MessageView } from "./MessageView/MessageView";
import { useAutoScroll } from "./useAutoScroll";

type Props = {
    messages: Message[];
};

export const Messages = ({ messages }: Props) => {
    const { ref, handleScroll } = useAutoScroll(messages);
    
    const clearMessages = useMessagesStore((state) => state.clearMessages);

    return (
        <section className={styles.messagesWrapper}>
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
            <div className={styles.buttons}>
                <Button
                    className={styles.clearBtn}
                    label="To bottom"
                    color="#adadad"
                    onClick={() =>
                        ref.current?.scrollTo({ top: ref.current.scrollHeight })
                    }
                />
                <Button
                    className={styles.clearBtn}
                    label="Clear"
                    onClick={() =>
                        clearMessages()
                    }
                />
            </div>
        </section>
    );
};
