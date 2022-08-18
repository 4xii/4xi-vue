import { h, getCurrentInstance } from "../../lib/guide-4xi-vue.esm.js";

export const Foo = {
  name: "Foo",
  setup() {
    const instance = getCurrentInstance();
    console.log("instance2 :>> ", instance);
  },
  render() {
    return h("div", {}, "foo");
  },
};
