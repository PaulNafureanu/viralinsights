const withBundleAnalyzer = require("@next/bundle-analyzer")({
  // enabled: process.env.ANALYZE === "true",
  enabled: false,
});

const threeRegExp = /[\\/]node_modules[\\/]three[\\/](src|examples)[\\/]/;
const nextRegExp = /[\\/]node_modules[\\/]next[\\/]/;
const othersRegExp = /[\\/]node_modules[\\/](?!next[\\/]|three[\\/])/;

const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization.splitChunks.cacheGroups = {
        threeGroup: {
          test: threeRegExp,
          name: "three",
          chunks: "all",
        },
        nextGroup: {
          test: nextRegExp,
          name: "next",
          chunks: "all",
        },
        otherGroup: {
          test: othersRegExp,
          name: "others",
          chunks: "all",
        },
      };
    }

    return config;
  },
};

// module.exports = withBundleAnalyzer(nextConfig);
module.exports = nextConfig;
