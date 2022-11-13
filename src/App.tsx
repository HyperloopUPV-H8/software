
import { FaultsAndWarningList } from "@components/MessageLogger/faultsAndWarningList";
import { useState } from "react";
import "./App.css";
//import {sdfsd} from "@components/MessageLogger"
function App() {
  const [count, setCount] = useState(0);


  return <div className="App">
    <FaultsAndWarningList />
  </div>;
}

export default App;
