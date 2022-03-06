module.exports = {
    presets: [
        //以当前node版本为基础转化
        ["@babel/preset-env", { targets: { node: "current" } }],
        "@babel/preset-typescript",
    ]
}