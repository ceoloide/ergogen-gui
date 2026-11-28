import JSZip from 'jszip';
import { addResultsToZip, getUniqueName, writeInjections } from './zip';

// JSZip lists each folder as an entry of its own, with a trailing slash, so an
// empty folder shows up in these entries as it does in the unpacked download.

const entries = (zip: JSZip) => Object.keys(zip.files).sort();

describe('archive entries', () => {
  it('writes no outlines folder when no outline has a DXF or an SVG', () => {
    // Arrange
    const zip = new JSZip();

    // Act
    addResultsToZip(zip, '', { outlines: { plate: {} } }, false, false);

    // Assert
    expect(entries(zip)).toEqual([]);
  });

  it('writes only the formats that each outline has', () => {
    // Arrange
    const zip = new JSZip();
    const outlines = {
      plate: { dxf: 'plate dxf' },
      preview: { svg: '<svg/>' },
    };

    // Act
    addResultsToZip(zip, '', { outlines }, false, false);

    // Assert
    expect(entries(zip)).toEqual([
      'outlines/',
      'outlines/plate.dxf',
      'outlines/preview.svg',
    ]);
  });

  it('writes no pcbs folder when the results have no PCB', () => {
    // Arrange
    const zip = new JSZip();

    // Act
    addResultsToZip(zip, '', { pcbs: {} }, false, false);

    // Assert
    expect(entries(zip)).toEqual([]);
  });

  it('writes no cases folder for a case that has only an STL when STL export is off', () => {
    // Arrange
    const zip = new JSZip();

    // Act
    addResultsToZip(
      zip,
      '',
      { cases: { tray: { stl: 'solid' } } },
      false,
      false
    );

    // Assert
    expect(entries(zip)).toEqual([]);
  });

  it('writes no JSCAD file for a case that has only an STL', () => {
    // Arrange
    const zip = new JSZip();

    // Act
    addResultsToZip(
      zip,
      '',
      { cases: { tray: { stl: 'solid' } } },
      false,
      true
    );

    // Assert
    expect(entries(zip)).toEqual(['cases/', 'cases/tray.stl']);
  });

  it('writes no file for an injection whose name ends in a slash', () => {
    // Arrange
    const zip = new JSZip();

    // Act
    writeInjections(zip, [['footprint', 'switches/', 'module.exports = {}']]);

    // Assert
    expect(entries(zip)).toEqual(['footprints/', 'footprints/switches/']);
  });
});

describe('archive names', () => {
  it('numbers each repeated name from 1 up', () => {
    // Arrange
    const usedNames = new Set<string>();

    // Act
    const names = ['corne', 'corne', 'corne'].map((name) =>
      getUniqueName(usedNames, name)
    );

    // Assert
    expect(names).toEqual(['corne', 'corne_1', 'corne_2']);
  });

  it('names a folder Untitled when the configuration has no name', () => {
    // Act
    const name = getUniqueName(new Set(), '');

    // Assert
    expect(name).toBe('Untitled');
  });
});
