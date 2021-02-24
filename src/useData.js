import React, { useState, useEffect } from 'react';
import { csv } from 'd3';

// const dataURL = './src/data/deaths2020.csv';

export const parseDate = d3.timeParse("%m/%d/%Y");
export const formatDate = d3.timeFormat("%b");
export const formatDay = d3.timeFormat("%b %d");

export const useData = (dataURL) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    csv(dataURL).then((d) => setData(d));
  });

  return data;
};
