import "./App.css";
import * as dotenv from "dotenv";
import { useSelector } from "react-redux";
import type { RootState } from "./store";
import { DataService } from "@services/DataService";
import { HomePage } from "@pages/HomePage";
import { SplitLayout, Direction } from "@layouts/SplitLayout/SplitLayout";
import { podDataMock } from "./mocks/PodDataMock";

function App() {
  let podData = useSelector((state: RootState) => state.podData);
  return (
    <div className="App">
      <DataService>
        <HomePage>
          <SplitLayout
            direction={Direction.HORIZONTAL}
            components={[
              <div style={{ backgroundColor: "red" }}>Hello</div>,
              <div style={{ backgroundColor: "blue" }}>Hello2</div>,
              <div style={{ backgroundColor: "green" }}>Hello3</div>,
            ]}
          ></SplitLayout>
        </HomePage>
      </DataService>
    </div>
  );
}

export default App;
