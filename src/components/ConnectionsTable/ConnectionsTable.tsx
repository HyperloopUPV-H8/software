import React, { useEffect, useState } from "react";
import { ConnectionsMock } from "@components/ConnectionsTable/structs/ConnectionsMock";
import { ConnectionsList } from "@components/ConnectionsTable/ConnectionsList";
import { Connection } from "@models/Connection";
import { RootState } from "store";
import { useDispatch, useSelector } from "react-redux";
import { initializeMockConnections } from "@slices/connectionsSlice";

export const ConnectionsTable = () => {
  //Mock with state
  //const [Connections, setConnections] = useState<Connection[]>(ConnectionsMock);

  const connections = useSelector((state: RootState) => state.connections);

  //mock with Redux
  mockConnections();

  return (
    <>
      <ConnectionsList connectionsList={connections} />
    </>
  );
};

//mocks with dispatch
const mockConnections = (): void => {
  const dispatch = useDispatch();

  useEffect(() => {
    let connectionsMocks = ConnectionsMock;
    dispatch(initializeMockConnections(connectionsMocks));
    console.log(connectionsMocks);
  }, []);
};
