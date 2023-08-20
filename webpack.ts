import webpack from "webpack";

const config: webpack.Configuration = {
  optimization: {
    splitChunks: {
      cacheGroups: {
        starterThreeGroup: {
          test(module) {
            debugger;
          },
        },
      },
    },
  },
};

export default config;
