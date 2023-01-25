import styles from "components/ConnectionsTable/ConnectionList/ConnectionList.module.scss";
import { ConnectionItem } from "components/ConnectionsTable/ConnectionItem/ConnectionItem";
import { Connection } from "models/Connection";

interface Props {
    title: string;
    connections: Connection[];
    enabled?: boolean;
}
export const ConnectionList = ({
    title,
    connections,
    enabled = true,
}: Props) => {
    return (
        <div className={`${styles.connectionsWrapper} island`}>
            <div className={styles.title}>{title}</div>
            <ul className={styles.connectionsList}>
                {connections.map((item, index) => {
                    return (
                        <ConnectionItem
                            key={index}
                            connection={item}
                            enabled={enabled}
                        />
                    );
                })}
            </ul>
        </div>
    );
};
