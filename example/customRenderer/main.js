import { createRenderer } from "../../lib/guide-4xi-vue.esm.js";
import { App } from "./App.js";

const game = new PIXI.Application({
  width: 500,
  height: 500,
});

document.body.append(game.view);
const renderer = createRenderer({
  hostCreateElement(type) {
    if (type === "rect") {
      const rect = new PIXI.Graphics();
      rect.beginFill(0x00ffff);
      rect.drawRect(0, 0, 100, 100);
      rect.endFill();

      return rect;
    }
  },
  hostPatchProp(el, key, val) {
    el[key] = val;
  },
  hostInsert(el, parent) {
    parent.addChild(el);
  },
});

renderer.createApp(App).mount(game.stage);
// const rootContainer = document.querySelector("#app");
// console.log("App", App);
// createApp(App).mount(rootContainer);
