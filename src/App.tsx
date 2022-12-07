import "./App.css";
import { DataService } from "@services/DataService";
import { OrderService } from "@services/OrderService";
import { HomePage } from "@pages/HomePage/HomePage";
import { Chart } from "@components/Chart/Chart";
import { Axis } from "@components/Chart/Axis";
import { useState, useEffect } from "react";
import { FaultsAndWarningList } from "@components/MessageLogger/FaultsAndWarningList";

let index = 0;
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
