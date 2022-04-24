import { h } from "../../lib/guide-4xi-vue.esm.js";
import { Foo } from "./Foo.js";
window.self = null;
export const App = {
  name: "App",
  render() {
    window.self = this;
    // ui
    return h(
      "div",
      {
        id: "root",
        class: ["red", "hard"],
        onClick() {
          console.log("click");
        },
        onMousedown() {
          console.log("mousedown");
        },
      },
      [
        h("div", {}, "hi" + this.msg),
        h(Foo, {
          count: 1,
        }),
      ]
      //setupSate
      //this.$el
      //"hi," + this.msg
      //array
      //[h("p", { class: "red" }, "hi"), h("p", { class: "blue" }, "4xi-vue")]
    );
  },

  setup() {
    //composition api
    return {
      msg: "4xi-vue-1",
    };
  },
};
