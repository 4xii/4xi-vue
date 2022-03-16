import { hasChanged, isObject } from "../shared";
import { isTracking, trackEffects, triggerEffects } from "./effect";
import { reactive } from "./reactive";

// 1 true '1'
// get set 
// proxy -> object 
// {} -> value get set
class RefImpl {
    private _value: any;
    private _rawValue: any;
    public dep;
    public __v_isRef = true;
    constructor(value) {
        this._rawValue = value
        this._value = convert(value);

        // value -> reactive
        // 1.看看value是不是对象

        this.dep = new Set();
    }

    get value() {
        trackRefValue(this)
        return this._value
    }

    set value(newValue) {
        // 一定先去修改了value的值

        // newValue -> this._value
        // 对比的时候 object对比
        if (hasChanged(newValue, this._rawValue)) {
            this._rawValue = newValue
            this._value = convert(newValue)
            triggerEffects(this.dep);
        };
    }

}
function convert(value) {
    return isObject(value) ? reactive(value) : value;
}

function trackRefValue(ref) {
    if (isTracking()) {
        trackEffects(ref.dep)
    }
}

export function ref(value) {
    return new RefImpl(value);
}

export function isRef(ref) {
    return !!ref.__v_isRef
}

export function unRef(ref) {
    // 是不是ref -> ref.value
    // 反之ref
    return isRef(ref) ? ref.value : ref
}

export function proxyRefs(objectWithRef) {
    //get set 
    return new Proxy(objectWithRef, {
        get(target, key) {
            return unRef(Reflect.get(target, key))
        },

        set(target, key, value) {
            // set -> ref .value
            if (isRef(target[key]) && !isRef(value)) {
                return target[key].value = value
            } else {
                return Reflect.set(target, key, value)
            }
        }
    })
}