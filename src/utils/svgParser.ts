export const parseSvgToMakerJsOutline = (svgContent: string): string => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgContent, 'image/svg+xml');
  const pathElements = doc.querySelectorAll('path');

  const modelsCode: string[] = [];
  let index = 0;

  pathElements.forEach((path) => {
    const d = path.getAttribute('d');
    if (d && d.trim()) {
      // Escape quotes and backslashes in path data to prevent breaking the JS string literal
      const escapedD = d.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
      modelsCode.push(
        `      svg_path_${index}: makerjs.importer.fromSVGPathData("${escapedD}")`
      );
      index++;
    }
  });

  if (modelsCode.length === 0) {
    return `const makerjs = require('makerjs');\nmodule.exports = {\n  models: {}\n};`;
  }

  return `const makerjs = require('makerjs');\nmodule.exports = {\n  models: {\n${modelsCode.join(
    ',\n'
  )}\n  }\n};`;
};
