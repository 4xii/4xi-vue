export const extend = Object.assign;

export const EMPTY_OBJ = {};

export const isObject = (val) => {
  return val !== null && typeof val === "object";
};

export const hasChanged = (val, newValue) => {
  return !Object.is(val, newValue);
};

export const hasOwn = (val, key) =>
  Object.prototype.hasOwnProperty.call(val, key);

export const camelize = (str: string) => {
  return str.replace(/-(\w)/g, (_, c: string) => {
    return c ? c.toUpperCase() : "";
  });
};
// add -> Add
export const capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);

export const toHandlerkey = (str: string) =>
  str ? "on" + capitalize(str) : "";
