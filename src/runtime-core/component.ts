export function createComponentInstance(vnode) {
    const component = {
        vnode,
        type: vnode.type,
        setupState: {}
    }
    return component
}

export function setupComponent(instance) {
    //todo
    //initProps()
    //initSlots()

    setupStatefulComponent(instance)
}

function setupStatefulComponent(instance) {
    const Component = instance.type;

    // ctx
    instance.proxy = new Proxy({}, {
        get(target, key) {
            // setupSate
            const { setupState } = instance
            if (key in setupState) {
                return setupState[key]
            }
        }
    })

    const { setup } = Component
    if (setup) {
        // function Object
        const setupResult = setup();

        handleSetupResult(instance, setupResult)
    }
}

function handleSetupResult(instance, setupResult) {
    if (typeof setupResult === "object") {
        instance.setupState = setupResult;
    }

    finishComponentSetup(instance)
}

function finishComponentSetup(instance) {
    const Component = instance.type;

    instance.render = Component.render

}