import * as dlv from 'dlv';
import * as path from 'path';
import normalizeProperties from './normalizeProperties';
import defaultConfig from './defaultConfig';

// https://github.com/tailwindlabs/tailwindcss.com/blob/6d6ee63ba619a78955e6e39a46535f80128d839d/next.config.js

export function getUtilities(
  workspaceRoot,
  plugin,
  { includeNegativeValues = false } = {}
) {
  if (!plugin) return {};
  const utilities = {};

  function addUtilities(utils) {
    utils = Array.isArray(utils) ? utils : [utils];
    for (let i = 0; i < utils.length; i++) {
      for (let prop in utils[i]) {
        for (let p in utils[i][prop]) {
          if (p.startsWith('@defaults')) {
            delete utils[i][prop][p];
          }
        }
        utilities[prop] = normalizeProperties(utils[i][prop]);
      }
    }
  }

  plugin({
    addBase: () => {},
    addDefaults: () => {},
    addComponents: () => {},
    corePlugins: () => true,
    prefix: (x) => x,
    addUtilities,
    theme: (key, defaultValue) =>
      dlv(defaultConfig(workspaceRoot).theme, key, defaultValue),
    matchUtilities: (
      matches,
      { values = null, supportsNegativeValues = false } = {}
    ) => {
      if (!values) return;

      let modifierValues = Object.entries(values);

      if (includeNegativeValues && supportsNegativeValues) {
        let negativeValues = [];
        for (let [key, value] of modifierValues) {
          let negatedValue = require(path.join(
            workspaceRoot,
            'node_modules',
            'tailwindcss',
            'lib',
            'util',
            'negateValue'
          )).default(value);
          if (negatedValue) {
            negativeValues.push([`-${key}`, negatedValue]);
          }
        }
        modifierValues.push(...negativeValues);
      }

      let result = Object.entries(matches).flatMap(
        ([name, utilityFunction]) => {
          return modifierValues
            .map(([modifier, value]) => {
              let declarations;
              if (typeof utilityFunction === 'function') {
                declarations = utilityFunction(value, {
                  includeRules(rules) {
                    addUtilities(rules);
                  },
                });

                if (!declarations) {
                  return null;
                }
              }

              return {
                [require(path.join(
                  workspaceRoot,
                  'node_modules',
                  'tailwindcss',
                  'lib',
                  'util',
                  'nameClass'
                )).default(name, modifier)]: declarations,
              };
            })
            .filter(Boolean);
        }
      );

      for (let obj of result) {
        for (let key in obj) {
          let deleteKey = false;
          for (let subkey in obj[key]) {
            if (subkey.startsWith('@defaults')) {
              delete obj[key][subkey];
              continue;
            }
            if (subkey.includes('&')) {
              result.push({
                [subkey.replace(/&/g, key)]: obj[key][subkey],
              });
              deleteKey = true;
            }
          }

          if (deleteKey) delete obj[key];
        }
      }

      addUtilities(result);
    },
  });
  return utilities;
}
