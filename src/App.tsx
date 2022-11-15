import { useState } from "react";
import "./App.css";
import { TestComponent } from "@components/TestComponent/TestComponent";
import * as dotenv from "dotenv";
dotenv.config();

function App() {
  const [count, setCount] = useState(0);

  return <div className="App"></div>;
}

export default App;
