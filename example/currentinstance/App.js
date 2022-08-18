import { h, getCurrentInstance } from "../../lib/guide-4xi-vue.esm.js";
import { Foo } from "./Foo.js";
export const App = {
  name: "App",
  render() {
    return h("div", {}, [h("p", {}, "currentInstance demo"), h(Foo)]);
  },

  setup() {
    const instance = getCurrentInstance();
    console.log("instance :>> ", instance);
  },
};
