export const parseSvgToMakerJsOutline = (svgContent: string): string => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgContent, 'image/svg+xml');
  const pathElements = doc.querySelectorAll('path');

  const pathsList: string[] = [];

  pathElements.forEach((path) => {
    const d = path.getAttribute('d');
    if (d && d.trim()) {
      // Escape quotes and backslashes in path data to prevent breaking the JS string literal
      const escapedD = d.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
      pathsList.push(`        "${escapedD}"`);
    }
  });

  return `const u = require('../utils');

module.exports = (config, name, points, outlines, units) => {
    const paths = [
${pathsList.join(',\n')}
    ];
    return u.svg_paths_to_outline(paths, config, name, points, outlines, units);
};`;
};
