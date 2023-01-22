import styles from "components/ConnectionsTable/ConnectionsTable.module.scss";
import { ConnectionList } from "components/ConnectionsTable/ConnectionList/ConnectionList";
import { useSelector } from "react-redux";
import { RootState } from "store";
export const ConnectionsTable = () => {
    const connections = useSelector((state: RootState) => state.connections);
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
