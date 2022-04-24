import { isObject } from "../shared/index";
import { shapeFlags } from "../shared/ShapeFlags";
import { createComponentInstance, setupComponent } from "./component";

export function render(vnode, container) {
    // patch
    //
    patch(vnode, container)
}

function patch(vnode, container) {

    const { shapeFlag } = vnode;

    //processElement()
    if (shapeFlag & shapeFlags.ELEMENT) {
        processElement(vnode, container);
    } else if (shapeFlag & shapeFlags.STATEFULE_COMPONENT) {
        processComponent(vnode, container);
    }

}

function processElement(vnode: any, container: any) {
    mountElement(vnode, container)
}
function processComponent(vnode: any, container: any) {
    mountComponent(vnode, container)
}



function mountElement(vnode: any, container: any) {
    const el: Element = (vnode.el = document.createElement(vnode.type))
    // string array
    const { children, shapeFlag } = vnode

    if (shapeFlag & shapeFlags.TEXT_CHILDREN) {
        el.textContent = children;
    } else if (shapeFlag & shapeFlags.ARRAY_CHILDREN) {
        // vnode
        mountChildren(vnode, el)
    }

    // props
    const { props } = vnode;
    for (const key in props) {
        const val = props[key];
        el.setAttribute(key, val)
    }

    container.append(el)

}

function mountChildren(vnode, container) {

    vnode.children.forEach(v => {
        patch(v, container)
    })
}

function mountComponent(initialVNode: any, container: any) {
    const instance = createComponentInstance(initialVNode);
    setupComponent(instance)
    setupRenderEffect(instance, initialVNode, container)
}

function setupRenderEffect(instance, initialVNode, container) {
    const { proxy } = instance
    const subTree = instance.render.call(proxy);

    // vnode -> patch
    // vnode -> element -> mountElement

    patch(subTree, container)

    //element -> mount
    initialVNode.el = subTree.el
}