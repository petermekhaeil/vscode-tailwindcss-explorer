// https://github.com/tailwindlabs/tailwindcss.com/blob/master/src/utils/isObject.js

export function isObject(value) {
  return Object.prototype.toString.call(value) === '[object Object]';
}
