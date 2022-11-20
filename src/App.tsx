import "./App.css";
import * as dotenv from "dotenv";
import { DataService } from "@services/DataService";
import { OrderService } from "@services/OrderService";
import { ReceiveTable } from "@components/PacketTable/ReceiveTable/ReceiveTable";

function App() {
  return (
    <div className="App">
      <DataService>
        <OrderService>
          <ReceiveTable></ReceiveTable>
        </OrderService>
      </DataService>
    </div>
  );
}

export default App;
