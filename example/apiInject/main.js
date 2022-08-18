import { createApp } from "../../lib/guide-4xi-vue.esm.js";
import App from "./App.js";

const rootContainer = document.querySelector("#app");
console.log("App", App);
createApp(App).mount(rootContainer);
