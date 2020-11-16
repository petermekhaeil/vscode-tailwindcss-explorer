// https://github.com/tailwindlabs/tailwindcss.com/blob/master/src/utils/kebabToTitleCase.js

export function kebabToTitleCase(str) {
  return str
    .replace(/(?:^|-)([a-z])/gi, (m, p1) => ` ${p1.toUpperCase()}`)
    .trim();
}
