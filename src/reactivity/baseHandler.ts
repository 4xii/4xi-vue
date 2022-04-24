import { extend, isObject } from "../shared/index";
import { track, trigger } from "./effect";
import { reactive, ReactiveFlags, readonly } from "./reactive";

const get = createGetter()
const set = createSetter()
const readonlyGet = createGetter(true)
const shallowReadonlyGet = createGetter(true, true)

function createGetter(isReadonly = false, shallow = false) {
    return function get(target, key) {
        if (key === ReactiveFlags.IS_REACTIVE) {
            return !isReadonly
        } else if (key === ReactiveFlags.IS_READONLY) {
            return isReadonly
        }

        const res = Reflect.get(target, key);

        if (shallow) {
            return res
        }
        //判断res 是不是obj
        if (isObject(res)) {
            return isReadonly ? readonly(res) : reactive(res)
        }

        if (!isReadonly) {
            track(target, key)
        }
        return res;
    }
}

function createSetter() {
    return function set(target, key, value) {
        const res = Reflect.set(target, key, value);

        trigger(target, key)
        return res
    }
}
export const mutableHandlers = {
    get,
    set
}

export const readonlyHandlers = {
    get: readonlyGet,
    set(target, key, value) {
        console.warn(`由于${target}是readonly,key:${key} set 失败 `);

        return true
    }
}

export const shallowReadonlyHandlers = extend({}, readonlyHandlers, {
    get: shallowReadonlyGet,
})