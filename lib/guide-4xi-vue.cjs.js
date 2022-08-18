'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const extend = Object.assign;
const isObject = (val) => {
    return val !== null && typeof val === 'object';
};
const hasOwn = (val, key) => Object.prototype.hasOwnProperty.call(val, key);
const camelize = (str) => {
    return str.replace(/-(\w)/g, (_, c) => {
        return c ? c.toUpperCase() : '';
    });
};
// add -> Add
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
const toHandlerkey = (str) => str ? "on" + capitalize(str) : "";

const publicPropertiesMap = {
    $el: (i) => i.vnode.el,
    $slots: (i) => i.slots
};
const PublicInstanceProxyHandlers = {
    get({ _: instance }, key) {
        // setupSate
        const { setupState, props } = instance;
        /* if (key in setupState) {
            return setupState[key]
        } */
        if (hasOwn(setupState, key)) {
            return setupState[key];
        }
        else if (hasOwn(props, key)) {
            return props[key];
        }
        const publicGetter = publicPropertiesMap[key];
        if (publicGetter) {
            return publicGetter(instance);
        }
    }
};

function emit(instance, event, ...args) {
    console.log("emit", event);
    const { props } = instance;
    // TPP
    // 先写一个特定行为 -》 重构称通用的行为
    const handlerName = toHandlerkey(camelize(event));
    const handler = props[handlerName];
    handler && handler(...args);
}

function initProps(instance, rawProps) {
    instance.props = rawProps || {};
}

const targetMap = new Map();
function trigger(target, key) {
    let depsMap = targetMap.get(target);
    let dep = depsMap.get(key);
    triggerEffects(dep);
}
function triggerEffects(dep) {
    for (const effect of dep) {
        if (effect.scheduler) {
            effect.scheduler();
        }
        else {
            effect.run();
        }
    }
}

const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);
const shallowReadonlyGet = createGetter(true, true);
function createGetter(isReadonly = false, shallow = false) {
    return function get(target, key) {
        if (key === "__v_isReactive" /* ReactiveFlags.IS_REACTIVE */) {
            return !isReadonly;
        }
        else if (key === "__v_isReadonly" /* ReactiveFlags.IS_READONLY */) {
            return isReadonly;
        }
        const res = Reflect.get(target, key);
        if (shallow) {
            return res;
        }
        //判断res 是不是obj
        if (isObject(res)) {
            return isReadonly ? readonly(res) : reactive(res);
        }
        return res;
    };
}
function createSetter() {
    return function set(target, key, value) {
        const res = Reflect.set(target, key, value);
        trigger(target, key);
        return res;
    };
}
const mutableHandlers = {
    get,
    set
};
const readonlyHandlers = {
    get: readonlyGet,
    set(target, key, value) {
        console.warn(`由于${target}是readonly,key:${key} set 失败 `);
        return true;
    }
};
const shallowReadonlyHandlers = extend({}, readonlyHandlers, {
    get: shallowReadonlyGet,
});

function reactive(raw) {
    return createReactiveObject(raw, mutableHandlers);
}
function readonly(raw) {
    return createReactiveObject(raw, readonlyHandlers);
}
function shallowReadonly(raw) {
    return createReactiveObject(raw, shallowReadonlyHandlers);
}
function createReactiveObject(target, baseHandler) {
    if (!isObject(target)) {
        console.warn(`target ${target} is not object`);
        return target;
    }
    return new Proxy(target, baseHandler);
}

function initSlots(instance, children) {
    // slots
    const { vnode } = instance;
    if (vnode.shapeFlag & 16 /* shapeFlags.SLOTS_CHILDREN */) {
        normalizeObjectSlot(children, instance.slots);
    }
}
function normalizeObjectSlot(children, slots) {
    for (const key in children) {
        const value = children[key];
        // slot
        slots[key] = (props) => normalizeSlotValue(value(props));
    }
}
function normalizeSlotValue(value) {
    return Array.isArray(value) ? value : [value];
}

function createComponentInstance(vnode, parent) {
    const component = {
        vnode,
        type: vnode.type,
        setupState: {},
        props: {},
        slots: {},
        provides: parent ? parent.provides : {},
        parent,
        emit: () => { },
    };
    component.emit = emit.bind(null, component);
    return component;
}
function setupComponent(instance) {
    //todo
    initProps(instance, instance.vnode.props);
    initSlots(instance, instance.vnode.children);
    setupStatefulComponent(instance);
}
function setupStatefulComponent(instance) {
    const Component = instance.type;
    // ctx
    instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandlers);
    const { setup } = Component;
    if (setup) {
        setCurrentInstance(instance);
        // function Object
        const setupResult = setup(shallowReadonly(instance.props), {
            emit: instance.emit,
        });
        setCurrentInstance(null);
        handleSetupResult(instance, setupResult);
    }
}
function handleSetupResult(instance, setupResult) {
    if (typeof setupResult === "object") {
        instance.setupState = setupResult;
    }
    finishComponentSetup(instance);
}
function finishComponentSetup(instance) {
    const Component = instance.type;
    instance.render = Component.render;
}
let currentInstance = null;
function getCurrentInstance() {
    return currentInstance;
}
function setCurrentInstance(instance) {
    currentInstance = instance;
}

const Fragment = Symbol("Fragment");
const Text = Symbol("Text");
function createVNode(type, props, children) {
    const vnode = {
        type,
        props,
        children,
        shapeFlag: getShapeFlag(type),
        el: null,
    };
    //children
    if (typeof children === "string") {
        vnode.shapeFlag |= 4 /* shapeFlags.TEXT_CHILDREN */;
    }
    else if (Array.isArray(children)) {
        vnode.shapeFlag |= 8 /* shapeFlags.ARRAY_CHILDREN */;
    }
    // 组件 + children object
    if (vnode.shapeFlag & 2 /* shapeFlags.STATEFULE_COMPONENT */) {
        if (typeof children === "object") {
            vnode.shapeFlag |= 16 /* shapeFlags.SLOTS_CHILDREN */;
        }
    }
    return vnode;
}
function createTextVnode(text) {
    return createVNode(Text, {}, text);
}
function getShapeFlag(type) {
    return typeof type === "string"
        ? 1 /* shapeFlags.ELEMENT */
        : 2 /* shapeFlags.STATEFULE_COMPONENT */;
}

function render(vnode, container) {
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
            if (shapeFlag & 1 /* shapeFlags.ELEMENT */) {
                processElement(vnode, container, parentComponent);
            }
            else if (shapeFlag & 2 /* shapeFlags.STATEFULE_COMPONENT */) {
                processComponent(vnode, container, parentComponent);
            }
            break;
    }
}
function processText(vnode, container) {
    const { children } = vnode;
    const textNode = (vnode.el = document.createTextNode(children));
    container.append(textNode);
}
function processFragment(vnode, container, parentComponent) {
    mountChildren(vnode, container, parentComponent);
}
function processElement(vnode, container, parentComponent) {
    mountElement(vnode, container, parentComponent);
}
function processComponent(vnode, container, parentComponent) {
    mountComponent(vnode, container, parentComponent);
}
function mountElement(vnode, container, parentComponent) {
    const el = (vnode.el = document.createElement(vnode.type));
    // string array
    const { children, shapeFlag } = vnode;
    if (shapeFlag & 4 /* shapeFlags.TEXT_CHILDREN */) {
        el.textContent = children;
    }
    else if (shapeFlag & 8 /* shapeFlags.ARRAY_CHILDREN */) {
        // vnode
        mountChildren(vnode, el, parentComponent);
    }
    // props
    const { props } = vnode;
    for (const key in props) {
        const val = props[key];
        // 具体的click  -》 通用
        const isOn = (key) => /^on[A-Z]/.test(key);
        if (isOn(key)) {
            const event = key.slice(2).toLowerCase();
            el.addEventListener(event, val);
        }
        else {
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
function mountComponent(initialVNode, container, parentComponent) {
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

function createApp(rootComponent) {
    return {
        mount(rootContainer) {
            // 先 vnode
            // component -> vnode
            // 所有的逻辑操作 都会基于 vnode做处理
            const vnode = createVNode(rootComponent);
            render(vnode, rootContainer);
        },
    };
}

function h(type, props, children) {
    return createVNode(type, props, children);
}

function renderSlots(slots, name, props) {
    const slot = slots[name];
    if (slot) {
        // function
        if (typeof slot === "function") {
            // children 是不可以有 array
            // 只需要把 children
            return createVNode(Fragment, {}, slot(props));
        }
    }
}

function provide(key, value) {
    const currentInstance = getCurrentInstance();
    if (currentInstance) {
        let { provides } = currentInstance;
        const parentProvides = currentInstance.parent.provides;
        // init
        if (provides === parentProvides) {
            provides = currentInstance.provides = Object.create(parentProvides);
        }
        provides[key] = value;
    }
    // 存
}
function inject(key, defaultValue) {
    // 取
    const currentInstance = getCurrentInstance();
    if (currentInstance) {
        const parentProvides = currentInstance.parent.provides;
        if (key in parentProvides) {
            return parentProvides[key];
        }
        else if ( /** 无值且给了默认值 */defaultValue) {
            if (typeof defaultValue === "function") {
                return defaultValue();
            }
            return defaultValue;
        }
    }
}

exports.createApp = createApp;
exports.createTextVnode = createTextVnode;
exports.getCurrentInstance = getCurrentInstance;
exports.h = h;
exports.inject = inject;
exports.provide = provide;
exports.renderSlots = renderSlots;
