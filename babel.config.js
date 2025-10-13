module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    // plugins: ["nativewind/babel"], // 일시적으로 비활성화
  };
};
