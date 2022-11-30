import "./App.css";
import { DataService } from "@services/DataService";
import { OrderService } from "@services/OrderService";
//import { HomePage } from "@pages/HomePage/HomePage";
// import { Chart } from "@components/Chart/Chart";
// import { Axis } from "@components/Chart/Axis";
import { useState, useEffect } from "react";
import { ConnectionsTable } from "@components/ConnectionsTable/ConnectionsTable";

type Point = [number, number];
let index = 0;
function App() {
  // let [points, setPoints] = useState([] as Point[]);
  // useEffect(() => {
  //   let intervalId = setInterval(() => {
  //     setPoints((prevPoints) => {
  //       let newPoints = [
  //         ...prevPoints,
  //         [index, Math.floor(Math.random() * 100)],
  //       ] as Point[];

  //       if (newPoints.length > 100) {
  //         newPoints.shift();
  //       }

  //       return newPoints;
  //     });
  //     index++;
  //   }, 1000 / 60);
  //   return () => {
  //     clearInterval(intervalId);
  //   };
  // }, []);
  return (
    <div className="App">
      {/* <Axis maxY={10 / 10} minY={-5 / 10} /> */}
      {/* <Chart points={points} /> */}

      {/* //descomentar
      <DataService>
        <OrderService>
          <HomePage />
        </OrderService>
      </DataService> */}
      <ConnectionsTable/>
    </div>
  );
}

export default App;
