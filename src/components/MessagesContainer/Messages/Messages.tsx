import { Message } from "common";
import styles from "./Messages.module.scss";
import { MessageView } from "./MessageView/MessageView";
import { useAutoScroll } from "./useAutoScroll";
import { Button } from "components/FormComponents/Button/Button";
import { useDispatch } from "react-redux";
import { clearMessages } from "slices/messagesSlice";

type Props = {
    messages: Array<Message>;
};

export const Messages = ({ messages }: Props) => {
    const { ref, handleScroll } = useAutoScroll(messages);
    const dispatch = useDispatch();

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
                    onClick={() => dispatch(clearMessages())}
                />
            </div>
        </section>
    );
};
