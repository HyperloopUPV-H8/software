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
    const realtimeMode = useMessagesStore((state) => state.realtimeMode);
    const toggleRealtimeMode = useMessagesStore((state) => state.toggleRealtimeMode);

    // In realtime mode, sort messages by timestamp (most recent first)
    const displayMessages = realtimeMode 
        ? [...messages].sort((a, b) => {
            // Compare timestamps - assuming higher counter means more recent
            const timestampA = a.timestamp.year * 10000000000 + 
                              a.timestamp.month * 100000000 + 
                              a.timestamp.day * 1000000 + 
                              a.timestamp.hour * 10000 + 
                              a.timestamp.minute * 100 + 
                              a.timestamp.second + 
                              a.timestamp.counter / 1000000;
            const timestampB = b.timestamp.year * 10000000000 + 
                              b.timestamp.month * 100000000 + 
                              b.timestamp.day * 1000000 + 
                              b.timestamp.hour * 10000 + 
                              b.timestamp.minute * 100 + 
                              b.timestamp.second + 
                              b.timestamp.counter / 1000000;
            return timestampB - timestampA;
        })
        : messages;

    return (
        <section className={styles.messagesWrapper}>
            <section
                ref={ref}
                onScroll={handleScroll}
                className={styles.messages}
            >
                {displayMessages.map((message) => {
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
                    label={realtimeMode ? "Realtime Mode" : "Historical Mode"}
                    color={realtimeMode ? "#4CAF50" : "#FF9800"}
                    onClick={() => toggleRealtimeMode()}
                />
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
