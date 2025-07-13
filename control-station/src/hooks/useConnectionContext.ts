import { Connection, useConnections } from 'common';

export function useConnectionContext() {
    const connections = useConnections();

    function isDisconnected(connection: Connection): boolean {
        return !connection.isConnected;
    }

    function any<T>(data: T[], condition: (value: T) => boolean): boolean {
        for (const value of data) {
            if (condition(value)) {
                return true;
            }
        }
        return false;
    }

    const lostConnection = any(
        [...connections.boards, connections.backend],
        isDisconnected
    );

    return {
        connections,
        lostConnection
    };
}
