// plotly.js-dist ships no type declarations. It exposes the same API surface
// as "plotly.js", so reuse @types/plotly.js for it.
declare module "plotly.js-dist" {
  import Plotly = require("plotly.js");
  export = Plotly;
}
