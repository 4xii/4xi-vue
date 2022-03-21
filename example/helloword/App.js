import { h } from '../../lib/guide-4xi-vue.esm.js'
export const App = {
    render() {
        // ui
        return h("div", {
            id: "root",
            class: ["red", "hard"]
        }, [h("p", { class: "red" }, "hi"), h("p", { class: "blue" }, "4xi-vue")])
    },

    setup() {
        //composition api
        return {
            masg: "4xi-vue"
        }
    }
}