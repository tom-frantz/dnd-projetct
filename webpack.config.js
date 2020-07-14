const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const path = require('path')


module.exports = async function(env, argv) {
  // Override needed because the production one doesn't seem to work very well.
  // env.mode = "development"
  const config = await createExpoWebpackConfigAsync(env, argv);

  // Need this for Kitten UI, optional chaining in use in Kitten doesn't work for web.
  config.module.rules.forEach(r => {
        if (r.oneOf) {
            r.oneOf.forEach(o => {
                if (o.use && o.use.loader && o.use.loader.includes('babel-loader')) {
                    o.include = [
                        path.resolve('.'),
                        path.resolve('node_modules/@ui-kitten/components'),
                    ]
                }
            })
        }
    })

  // Finally return the new config for the CLI to use.
  return config;
};