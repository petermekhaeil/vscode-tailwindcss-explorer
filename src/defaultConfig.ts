import * as path from "path";

// https://github.com/tailwindlabs/tailwindcss.com/blob/master/src/utils/defaultConfig.js

const defaultConfig = (workspaceRoot: string) => {
  const defaultTheme = require(path.join(
    workspaceRoot,
    "node_modules",
    "tailwindcss",
    "defaultTheme"
  ));
  const resolveConfig = require(path.join(
    workspaceRoot,
    "node_modules",
    "tailwindcss",
    "resolveConfig"
  ));

  return resolveConfig({ theme: defaultTheme });
};

export default defaultConfig;
