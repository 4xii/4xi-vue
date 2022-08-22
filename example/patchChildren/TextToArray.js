import { ref, h } from "../../lib/guide-4xi-vue.esm.js";

const prevChildren = "oldChildren";
const nextChildren = [h("div", {}, "A"), h("div", {}, "B")];

export default {
  name: "TextArray",
  setup() {
    const isChange = ref(false);
    window.isChange = isChange;

    return {
      isChange,
    };
  },
  render() {
    const self = this;
    return self.isChange === true
      ? h("div", {}, nextChildren)
      : h("div", {}, prevChildren);
  },
};
