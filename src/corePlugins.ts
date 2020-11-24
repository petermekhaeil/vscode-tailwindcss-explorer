import * as dlv from "dlv";
import * as path from "path";
import normalizeProperties from "./normalizeProperties";
import defaultConfig from "./defaultConfig";

// https://github.com/tailwindlabs/tailwindcss.com/blob/master/src/utils/corePluginsWithExamples.js

const corePlugins = (plugins, workspaceRoot: string) => {
  return plugins.map((plugin) => {
    const utilities = {};

    const mod = require(path.join(
      workspaceRoot,
      "node_modules",
      "tailwindcss",
      "lib",
      "plugins",
      plugin
    ));

    (mod.default || mod)()({
      addUtilities: (utils) => {
        utils = Array.isArray(utils) ? utils : [utils];
        for (let i = 0; i < utils.length; i++) {
          for (let prop in utils[i]) {
            utilities[prop] = normalizeProperties(utils[i][prop]);
          }
        }
      },
      addComponents: () => {},
      addBase: () => {},
      config: () => ({ future: "all" }),
      theme: (path, defaultValue) =>
        dlv(defaultConfig(workspaceRoot).theme, path, defaultValue),
      variants: () => [],
      e: (x) => x.replace(/([:.])/g, "\\$1"),
      target: () => "modern",
      corePlugins: () => true,
      prefix: (x) => x,
    });

    return {
      plugin,
      utilities: utilities,
    };
  });
};

export default corePlugins;
