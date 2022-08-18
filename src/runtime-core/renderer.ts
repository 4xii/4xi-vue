import { isObject } from "../shared/index";
import { shapeFlags } from "../shared/ShapeFlags";
import { createComponentInstance, setupComponent } from "./component";
import { Fragment, Text } from "./vnode";

export function render(vnode, container) {
  // patch
  //
  patch(vnode, container, null);
}

function patch(vnode, container, parentComponent) {
  const { type, shapeFlag } = vnode;

  // Fragement -> 只渲染 children
  switch (type) {
    case Fragment:
      processFragment(vnode, container, parentComponent);
      break;
    case Text:
      processText(vnode, container);
      break;
    default:
      //processElement()
      if (shapeFlag & shapeFlags.ELEMENT) {
        processElement(vnode, container, parentComponent);
      } else if (shapeFlag & shapeFlags.STATEFULE_COMPONENT) {
        processComponent(vnode, container, parentComponent);
      }
      break;
  }
}

function processText(vnode: any, container: any) {
  const { children } = vnode;
  const textNode = (vnode.el = document.createTextNode(children));
  container.append(textNode);
}

function processFragment(vnode: any, container: any, parentComponent) {
  mountChildren(vnode, container, parentComponent);
}

function processElement(vnode: any, container: any, parentComponent) {
  mountElement(vnode, container, parentComponent);
}
function processComponent(vnode: any, container: any, parentComponent) {
  mountComponent(vnode, container, parentComponent);
}

function mountElement(vnode: any, container: any, parentComponent) {
  const el: Element = (vnode.el = document.createElement(vnode.type));
  // string array
  const { children, shapeFlag } = vnode;

  if (shapeFlag & shapeFlags.TEXT_CHILDREN) {
    el.textContent = children;
  } else if (shapeFlag & shapeFlags.ARRAY_CHILDREN) {
    // vnode
    mountChildren(vnode, el, parentComponent);
  }

  // props
  const { props } = vnode;
  for (const key in props) {
    const val = props[key];
    // 具体的click  -》 通用
    const isOn = (key: string) => /^on[A-Z]/.test(key);
    if (isOn(key)) {
      const event = key.slice(2).toLowerCase();
      el.addEventListener(event, val);
    } else {
      el.setAttribute(key, val);
    }
  }

  container.append(el);
}

function mountChildren(vnode, container, parentComponent) {
  vnode.children.forEach((v) => {
    patch(v, container, parentComponent);
  });
}

function mountComponent(initialVNode: any, container: any, parentComponent) {
  const instance = createComponentInstance(initialVNode, parentComponent);
  setupComponent(instance);
  setupRenderEffect(instance, initialVNode, container);
}

function setupRenderEffect(instance, initialVNode, container) {
  const { proxy } = instance;
  const subTree = instance.render.call(proxy);

  // vnode -> patch
  // vnode -> element -> mountElement

  patch(subTree, container, instance);

  //element -> mount
  initialVNode.el = subTree.el;
}
