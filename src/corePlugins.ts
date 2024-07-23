import * as path from 'path';
import { getUtilities } from './getUtilities';

// https://github.com/tailwindlabs/tailwindcss.com/blob/master/src/utils/corePluginsWithExamples.js

const corePlugins = (plugins, workspaceRoot: string) => {
  const pluginDefs = require(path.join(
    workspaceRoot,
    'node_modules',
    'tailwindcss',
    'lib',
    'corePlugins.js'
  )).corePlugins;

  return plugins.map((plugin) => {
    let utilities = {};
    try {
      utilities = getUtilities(workspaceRoot, pluginDefs[plugin]);
    } catch(error) {
      console.log(error);
    }

    return {
      plugin,
      utilities,
    };
  });
};

export default corePlugins;
