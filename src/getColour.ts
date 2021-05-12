// Nothing like a nice hack to get this across the line...

const getColour = (name, css, nonce) => {
  const classStr = name.split(/[\s:<]/)[0];

  const showColour =
    classStr.indexOf('.bg-') === 0 ||
    classStr.indexOf('.border-') === 0 ||
    classStr.indexOf('.divide-') === 0 ||
    classStr.indexOf('.placeholder-') === 0 ||
    classStr.indexOf('.text-') === 0;

  const property = (str) => {
    return str === 'color' ? 'background-color' : str;
  };

  const toCssStr = (css) => {
    return `${Object.entries(css)
      .map((line) => {
        const [k, v] = line;
        if (Array.isArray(v)) {
          return v.map((v) => `${property(k)}:${v};`).join('\n');
        } else {
          return `${property(k)}:${v}`;
        }
      })
      .join(';\n')}`;
  };

  if (showColour) {
    const styleName = `color-box-${classStr.substring(1)}`;
    return `
      <style nonce="${nonce}">
          .${styleName} {
              ${toCssStr(css)}
          }
      </style>
      <div class="colour-box ${styleName}"></div>
    `;
  }

  return ``;
};

export default getColour;
