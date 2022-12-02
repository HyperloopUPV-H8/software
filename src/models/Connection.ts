export type Connection = {
  name: string;
  isConnected: boolean;
};

export function setConnectionState(
  name: string,
  isConnected: boolean
): Connection {
  return {
    name,
    isConnected,
  };
}
