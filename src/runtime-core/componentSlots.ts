import { shapeFlags } from "../shared/ShapeFlags";
export function initSlots(instance, children) {
  // slots
  const { vnode } = instance;
  if (vnode.shapeFlag & shapeFlags.SLOTS_CHILDREN) {
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
