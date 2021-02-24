import { useData } from "./useData";
import { useEffect, useState } from "react";
import { Dropdown } from "./Dropdown";
import { Textbox } from "./Textbox";
import { Barchart } from "./Barchart";

export const Chart = ({ data }) => {
  const ranges = ["month", "week", "day"];
  const text = null;
  const [bin, setBin] = useState("month");
  return (
    <div id="datavis">
      <div id="chart"></div>
      <Dropdown
        id="selectButton"
        values={ranges}
        parentCallback={(d) => setBin(d)}
      />
      <Barchart data={data} bin={bin} />
      <Textbox text={text} />
    </div>
  );
};
