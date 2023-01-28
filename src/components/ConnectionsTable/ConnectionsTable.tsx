import styles from "components/ConnectionsTable/ConnectionsTable.module.scss";
import { ConnectionList } from "components/ConnectionsTable/ConnectionList/ConnectionList";
import { useConnections } from "components/ConnectionsTable/useConnections";

export const ConnectionsTable = () => {
    const connections = useConnections();
    const isConnectionWSOpen = true;

    return (
        <div className={styles.wrapper}>
            <ConnectionList
                title="WebSocket"
                connections={connections.websocket}
            />
            <ConnectionList
                title="Boards"
                connections={connections.board}
                enabled={isConnectionWSOpen}
            />
        </div>
    );
};
