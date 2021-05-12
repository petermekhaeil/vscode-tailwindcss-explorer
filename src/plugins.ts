import * as glob from 'glob';
import * as path from 'path';

// https://github.com/tailwindlabs/tailwindcss.com/blob/master/src/utils/corePluginsWithExamples.js

const getPlugins = (workspaceRoot: string) => {
  const plugins = [
    ...glob
      .sync(
        path.join(
          workspaceRoot,
          'node_modules',
          'tailwindcss',
          'lib',
          'plugins',
          '*.js'
        )
      )
      .map((filename: string) => path.basename(filename, '.js'))
      .filter((name) => name !== 'index'),
  ].filter((x, i, a) => a.indexOf(x) === i);

  return plugins;
};

export default getPlugins;
