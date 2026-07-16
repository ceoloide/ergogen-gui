import { parseSvgToMakerJsOutline } from './svgParser';

describe('svgParser', () => {
  it('should parse an SVG with a single path element', () => {
    const svgContent = `
      <svg viewBox="0 0 100 100">
        <path d="M 10 10 L 90 90" />
      </svg>
    `;
    const result = parseSvgToMakerJsOutline(svgContent);
    expect(result).toContain("const u = require('../utils');");
    expect(result).toContain(
      'module.exports = (config, name, points, outlines, units) => {'
    );
    expect(result).toContain('        "M 10 10 L 90 90"');
    expect(result).toContain(
      '    return u.svg_paths_to_outline(paths, config, name, points, outlines, units);'
    );
  });

  it('should parse an SVG with multiple path elements and escape quotes', () => {
    const svgContent = `
      <svg viewBox="0 0 100 100">
        <path d="M 10 10 L 90 90" />
        <path d="M 50 50 &quot;test&quot;" />
      </svg>
    `;
    const result = parseSvgToMakerJsOutline(svgContent);
    expect(result).toContain('        "M 10 10 L 90 90",');
    expect(result).toContain('        "M 50 50 \\"test\\""');
  });

  it('should return empty paths if no paths are present', () => {
    const svgContent = `
      <svg viewBox="0 0 100 100">
        <rect x="10" y="10" width="80" height="80" />
      </svg>
    `;
    const result = parseSvgToMakerJsOutline(svgContent);
    expect(result).toContain('    const paths = [\n\n    ];');
  });

  it('should ignore empty paths or paths without d attribute', () => {
    const svgContent = `
      <svg viewBox="0 0 100 100">
        <path />
        <path d="" />
        <path d="M 10 10" />
      </svg>
    `;
    const result = parseSvgToMakerJsOutline(svgContent);
    expect(result).toContain('        "M 10 10"');
  });
});
