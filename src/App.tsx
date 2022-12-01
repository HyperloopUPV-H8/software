import "./App.css";
import { DataService } from "@services/DataService";
import { OrderService } from "@services/OrderService";
import { HomePage } from "@pages/HomePage/HomePage";

function App() {
  return (
    <div className="App">
      <DataService>
        <OrderService>
          <HomePage />
        </OrderService>
      </DataService>
    </div>
  );
}

export default App;
