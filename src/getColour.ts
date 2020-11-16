// Nothing like a nice hack to get this across the line...

const getColour = (name, css, nonce) => {
  const classStr = name.split(/[\s:<]/)[0];

  let colour;

  if (classStr.indexOf(".bg-") === 0 && css["background-color"]) {
    colour = css["background-color"][0];
  }

  if (classStr.indexOf(".border-") === 0 && css["border-color"]) {
    colour = css["border-color"][0];
  }

  if (classStr.indexOf(".divide-") === 0 && css["border-color"]) {
    colour = css["border-color"][0];
  }

  if (classStr.indexOf(".placeholder-") === 0 && css["color"]) {
    colour = css["color"][0];
  }

  if (classStr.indexOf(".text-") === 0 && css["color"]) {
    colour = css["color"][0];
  }

  if (colour) {
    const styleName = `color-box-${classStr.substring(1)}`;
    return `
      <style nonce="${nonce}">
          .${styleName} {
              background-color: ${colour}
          }
      </style>
      <div class="colour-box ${styleName}"></div>
    `;
  }

  return ``;
};

export default getColour;
