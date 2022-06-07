import { h } from "../../lib/guide-4xi-vue.esm.js";
import { Foo } from "./Foo.js";
export const App = {
  name: "App",
  render() {
    const app = h("div", {}, "App");
    const foo = h(
      Foo,
      {},
      {
        header: h("p", {}, "123slots"),
        footer: h("p", {}, "456slots"),
      }
    );
    return h("div", {}, [app, foo]);
  },

  setup() {
    return {};
  },
};
