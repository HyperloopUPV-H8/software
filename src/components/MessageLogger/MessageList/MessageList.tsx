import { LineMessage } from "@components/MessageLogger/LineMessage/LineMessage";
import styles from "@components/MessageLogger/MessageList/MessageList.module.scss";
import { MessageCounter } from "@adapters/Message";
import { HSLColor } from "@utils/color";

interface Props {
  messages: MessageCounter[];
  color: HSLColor;
}

export const MessageList = ({ messages, color }: Props) => {
  return (
    <ul className={styles.messagesList}>
      {messages.map((item) => {
        return (
          <LineMessage
            key={item.id}
            message={item.msg}
            count={item.count}
            color={color}
          />
        );
      })}
    </ul>
  );
};
