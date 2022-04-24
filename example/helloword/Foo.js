import { h } from "../../lib/guide-4xi-vue.esm.js";

export const Foo = {
  setup(props) {
    // props.count
    console.log(props);

    props.count++;
    console.log(props);
  },
  render() {
    return h("div", {}, "foo:" + this.count);
  },
};
