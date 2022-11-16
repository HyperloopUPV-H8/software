import "./App.css";
import * as dotenv from "dotenv";
import { useSelector } from "react-redux";
import type { RootState } from "./store";
import { DataService } from "@services/DataService";
import { podDataMock } from "./mocks/PodDataMock";

function App() {
  let podData = useSelector((state: RootState) => state.podData);
  return (
    <div className="App">
      <DataService>{JSON.stringify({ podData })}</DataService>
    </div>
  );
}

export default App;
