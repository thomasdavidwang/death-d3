import React from "react";
import ReactDOM from "react-dom";

import { useData } from "./useData";
import { Chart } from "./Chart";

const App = () => {
  const data = useData();

  if (!data) {
    return <pre>Loading...</pre>;
  }

  return (
    <Chart data={data} />
  );
};

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
