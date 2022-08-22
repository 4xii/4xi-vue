import { h } from "../../lib/guide-4xi-vue.esm.js";
import ArrayToText from "./ArrayToText.js";
import TextToText from "./TextToText.js";
import TextToArray from "./TextToArray.js";
export const App = {
  name: "App",
  render() {
    return h(
      "div",
      {
        tId: 1,
      },
      [
        h("p", {}, "主页"),
        //  老的是 array 新的是text
        // h(ArrayToText),
        //  老的是 text 新的是text
        //h(TextToText),
        //  老的是 text 新的是array
        h(TextToArray),
        //  老的是 array 新的是array
        //  h(ArrayToArray),
      ]
    );
  },

  setup() {
    //composition api
    return {
      msg: "4xi-vue-1",
    };
  },
};
