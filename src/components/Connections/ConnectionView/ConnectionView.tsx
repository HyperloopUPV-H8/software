import styles from "./ConnectionView.module.scss";
import { Connection } from "models/Connection";
import { TbPlugConnectedX, TbPlugConnected } from "react-icons/tb";

type Props = {
    connection: Connection;
};

export const ConnectionView = ({ connection }: Props) => {
    return (
        <div
            className={`${styles.connectionViewWrapper} ${
                connection.isConnected ? styles.connected : styles.disconnected
            }`}
        >
            {connection.isConnected ? (
                <TbPlugConnected className={styles.icon} />
            ) : (
                <TbPlugConnectedX className={styles.icon} />
            )}
            <div className={styles.label}>{connection.name}</div>
        </div>
    );
};
