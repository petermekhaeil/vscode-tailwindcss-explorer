import * as glob from 'glob';
import * as path from 'path';

// https://github.com/tailwindlabs/tailwindcss.com/blob/master/src/utils/corePluginsWithExamples.js

const getPlugins = (workspaceRoot: string) => {
  let plugins = require(path.join(
    workspaceRoot,
    'node_modules',
    'tailwindcss',
    'lib',
    'corePluginList.js'
  )).default;

  return plugins;
};

export default getPlugins;
