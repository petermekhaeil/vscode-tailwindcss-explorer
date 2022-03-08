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
    const utilities = getUtilities(workspaceRoot, pluginDefs[plugin]);

    return {
      plugin,
      utilities,
    };
  });
};

export default corePlugins;
