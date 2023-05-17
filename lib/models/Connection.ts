export type Connection = {
  name: string;
  isConnected: boolean;
};

export function createConnection(
  name: string,
  isConnected: boolean
): Connection {
  return {
    name,
    isConnected,
  };
}
