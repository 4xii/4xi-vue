import { h } from "../../lib/guide-4xi-vue.esm.js";
import { Foo } from "./Foo.js";
export const App = {
  name: "App",
  render() {
    // ui
    return h("div", {}, [
      h("div", {}, "APP"),
      h(Foo, {
        onAdd(a, b) {
          console.log("on-add", a, b);
        },
        //add-foo -> addFoo
        onAddFoo(a, b) {
          console.log("onAddFoo", a, b);
        },
      }),
    ]);
  },

  setup() {
    return {};
  },
};
