// https://github.com/tailwindlabs/tailwindcss.com/blob/master/src/components/ClassTable.js

const normalizeProperties = function (input) {
  if (typeof input !== "object") {
    return input;
  }
  if (Array.isArray(input)) {
    return input.map(normalizeProperties);
  }
  return Object.keys(input).reduce((newObj, key) => {
    let val = input[key];
    let newVal = typeof val === "object" ? normalizeProperties(val) : val;
    newObj[
      key.replace(/([a-z])([A-Z])/g, (m, p1, p2) => `${p1}-${p2.toLowerCase()}`)
    ] = newVal;
    return newObj;
  }, {});
};

export default normalizeProperties;
