import { isObject } from "../shared/index";
import { createComponentInstance, setupComponent } from "./component";

export function render(vnode, container) {
    // patch
    //
    patch(vnode, container)
}

function patch(vnode, container) {

    // 去处理组件

    // 判断 是不是 element
    // element
    // todo 区分element类型 component类型
    //processElement()
    if (typeof vnode.type === 'string') {
        processElement(vnode, container);
    } else if (isObject(vnode.type)) {
        processComponent(vnode, container);
    }

}

function processElement(vnode: any, container: any) {
    mountElement(vnode, container)
}
function processComponent(vnode: any, container: any) {
    mountComponent(vnode, container)
}

function mountComponent(vnode: any, container: any) {
    const instance = createComponentInstance(vnode);
    setupComponent(instance)
    setupRenderEffect(instance, container)
}

function mountElement(vnode: any, container: any) {
    const el: Element = document.createElement(vnode.type)
    // string array
    const { children } = vnode

    if (typeof children === "string") {
        el.textContent = children;
    } else if (Array.isArray(children)) {
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

function setupRenderEffect(instance, container) {
    const { proxy } = instance
    const subTree = instance.render.call(proxy);

    // vnode -> patch
    // vnode -> element -> mountElement

    patch(subTree, container)

}