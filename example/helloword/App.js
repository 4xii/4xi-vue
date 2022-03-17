import { h } from '../../lib/guide-4xi-vue.esm.js'
export const App = {
    render() {
        // ui
        return h("div", "hi" + this.msg)
    },

    setup() {
        //composition api
        return {
            masg: "4xi-vue"
        }
    }
}