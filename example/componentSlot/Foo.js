import { h, renderSlots } from "../../lib/guide-4xi-vue.esm.js";

export const Foo = {
  setup() {
    return {};
  },
  render() {
    const foo = h("p", {}, "foo");

    console.log(this.$slots);

    // renderSlots
    // 1.获取要渲染的元素
    // 2.获取要渲染的位置
    return h("div", {}, [foo, renderSlots(this.$slots)]);
  },
};
