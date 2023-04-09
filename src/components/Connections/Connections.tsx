import { ConnectionView } from "./ConnectionView/ConnectionView";
import styles from "./Connections.module.scss";

import { useConnections } from "./useConnections";

export const Connections = () => {
    const connections = useConnections();

    return (
        <div className={styles.connectionsWrapper}>
            <ConnectionView connection={connections.websocket} />
            <div className={styles.boards}>
                {connections.boards.map((conn) => {
                    return (
                        <ConnectionView
                            key={conn.name}
                            connection={conn}
                        />
                    );
                })}
            </div>
        </div>
    );
};
