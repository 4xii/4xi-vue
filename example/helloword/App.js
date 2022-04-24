import { h } from "../../lib/guide-4xi-vue.esm.js";

window.self = null;
export const App = {
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
      //setupSate
      //this.$el
      "hi," + this.msg
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
