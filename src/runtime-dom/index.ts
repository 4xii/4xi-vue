import { createRenderer } from "../runtime-core";
function createElement(type) {
  return document.createElement(type);
}

export function patchProp(el, key, val) {
  // 具体的click  -》 通用
  const isOn = (key: string) => /^on[A-Z]/.test(key);
  if (isOn(key)) {
    const event = key.slice(2).toLowerCase();
    el.addEventListener(event, val);
  } else {
    el.setAttribute(key, val);
  }
}

export function insert(el, parent) {
  parent.append(el);
}

const renderer: any = createRenderer({
  hostCreateElement: createElement,
  hostPatchProp: patchProp,
  hostInsert: insert,
});

export function createApp(...args) {
  return renderer.createApp(...args);
}

export * from "../runtime-core";
