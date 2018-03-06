module.exports = {
  presets: [
    ["@babel/preset-env", {
      targets: {
        browsers: ["last 2 versions"]
      },
      modules: false,
      useBuiltIns: "entry"
    }],
    "@babel/preset-stage-2",
  ]
};