import { shapeFlags } from "../shared/ShapeFlags";

export const Fragment = Symbol("Fragment");
export const Text = Symbol("Text");

export function createVNode(type, props?, children?) {
  const vnode = {
    type,
    props,
    children,
    shapeFlag: getShapeFlag(type),
    el: null,
  };

  //children
  if (typeof children === "string") {
    vnode.shapeFlag |= shapeFlags.TEXT_CHILDREN;
  } else if (Array.isArray(children)) {
    vnode.shapeFlag |= shapeFlags.ARRAY_CHILDREN;
  }

  // 组件 + children object
  if (vnode.shapeFlag & shapeFlags.STATEFULE_COMPONENT) {
    if (typeof children === "object") {
      vnode.shapeFlag |= shapeFlags.SLOTS_CHILDREN;
    }
  }
  return vnode;
}

export function createTextVnode(text: string) {
  return createVNode(Text, {}, text);
}

function getShapeFlag(type) {
  return typeof type === "string"
    ? shapeFlags.ELEMENT
    : shapeFlags.STATEFULE_COMPONENT;
}
