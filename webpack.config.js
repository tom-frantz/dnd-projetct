const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function(env, argv) {
  // Override needed because the production one doesn't seem to work very well.
  env.mode = "development"
  const config = await createExpoWebpackConfigAsync(env, argv);

  // Finally return the new config for the CLI to use.
  return config;
};