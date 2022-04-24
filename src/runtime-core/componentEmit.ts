import { toHandlerkey, camelize } from "../shared/index";

export function emit(instance, event, ...args) {
    console.log("emit", event);

    const { props } = instance;

    // TPP
    // 先写一个特定行为 -》 重构称通用的行为


    const handlerName = toHandlerkey(camelize(event))
    const handler = props[handlerName];
    handler && handler(...args)
}