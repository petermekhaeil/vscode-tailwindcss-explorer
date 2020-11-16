// https://github.com/tailwindlabs/tailwindcss.com/blob/master/src/utils/castArray.js

export function castArray(value) {
  return Array.isArray(value) ? value : [value];
}
