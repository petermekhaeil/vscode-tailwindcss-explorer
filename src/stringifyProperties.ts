// https://github.com/tailwindlabs/tailwindcss.com/blob/master/src/components/ClassTable.js

import { isObject } from "./isObject";
import { castArray } from "./castArray";

export function stringifyProperties(
  properties,
  { filter = () => true, transformValue = (x) => x, indent = 0 } = {}
) {
  let lines = [];
  Object.keys(properties).forEach((property) => {
    if (isObject(properties[property])) {
      lines.push(`${property} {`);
      lines.push(
        stringifyProperties(properties[property], {
          filter,
          transformValue,
          indent: indent + 1,
        })
      );
      lines.push("}");
    } else {
      castArray(properties[property]).forEach((value, i) => {
        //@ts-ignore
        if (!filter(property, value, properties)) {
          return;
        }
        lines.push(
          `${"  ".repeat(indent)}${property}: ${transformValue(value)};`
        );
      });
    }
  });
  return lines.join("\n");
}
