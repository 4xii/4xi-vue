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
        header: ({ age }) => h("p", {}, "123slots" + age),
        footer: () => h("p", {}, "456slots"),
      }
    );
    console.log("this.$slots", app, foo);
    return h("div", {}, [app, foo]);
  },

  setup() {
    return {};
  },
};
