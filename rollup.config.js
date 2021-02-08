import buble from "@rollup/plugin-buble";

export default {
  input: "src/index.js",
  external: ["react", "react-dom", "d3"],
  output: {
    file: "bundle.js",
    format: "iife",
  	globals: {"react": "React", "react-dom": "ReactDOM", "d3": "d3"},
  },
  plugins: [buble()]
};