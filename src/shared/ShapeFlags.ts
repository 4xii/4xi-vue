export const enum shapeFlags {
    ELEMENT = 1,// 01  0001
    STATEFULE_COMPONENT = 1 << 1,// 10  0010
    TEXT_CHILDREN = 1 << 2,// 100  0100
    ARRAY_CHILDREN = 1 << 3,// 1000 1000
}