import { createVNode } from "./vnode"
import { render } from './renderer'
export function createApp(rootComponent) {
    return {

        mount(rootContainer) {
            // 先 vnode
            // component -> vnode
            // 所有的逻辑操作 都会基于 vnode做处理

            const vnode = createVNode(rootComponent);

            render(vnode, rootContainer);
        }
    }
}

