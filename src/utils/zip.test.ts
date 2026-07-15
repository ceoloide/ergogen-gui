import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { createZip, downloadAllConfigs } from './zip';

jest.mock('jszip');
jest.mock('file-saver');
jest.mock('../workers/workerFactory', () => ({
  createErgogenWorker: () => null,
  createJscadWorker: () => null,
}));

// Mock Blob since it might not be available in the test environment as expected
if (typeof Blob === 'undefined') {
  (global as any).Blob = class MockBlob {
    constructor(public parts: any[]) {}
  };
}

describe('createZip', () => {
  let mockZip: any;
  let mockFolders: Record<string, any>;

  const createMockFolder = () => {
    const folder: any = {
      file: jest.fn().mockReturnThis(),
      folder: jest.fn(),
    };
    folder.folder.mockImplementation((name: string) => {
      if (!mockFolders[name]) {
        mockFolders[name] = createMockFolder();
      }
      return mockFolders[name];
    });
    return folder;
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockFolders = {};

    mockZip = {
      file: jest.fn().mockReturnThis(),
      folder: jest.fn().mockImplementation((name: string) => {
        if (!mockFolders[name]) {
          mockFolders[name] = createMockFolder();
        }
        return mockFolders[name];
      }),
      generateAsync: jest
        .fn()
        .mockResolvedValue(new Blob(['mock zip content'])),
    };

    (JSZip as unknown as jest.Mock).mockImplementation(() => mockZip);
  });

  it('should include root files: config.yaml and demo.svg', async () => {
    const results = {
      demo: { svg: '<svg>demo</svg>' },
    };
    const config = 'points: {}';

    await createZip(results as any, config, undefined, false, false);

    expect(mockZip.file).toHaveBeenCalledWith('config.yaml', config);
    expect(mockFolders['outputs'].file).toHaveBeenCalledWith(
      'demo.svg',
      '<svg>demo</svg>'
    );
  });

  it('should include outlines and filter "_" prefixed files when debug is false', async () => {
    const results = {
      outlines: {
        visible: { dxf: 'visible-dxf', svg: 'visible-svg' },
        _hidden: { dxf: 'hidden-dxf' },
      },
    };

    await createZip(results as any, '', undefined, false, false);

    const outlinesFolder = mockFolders['outlines'];
    expect(mockZip.folder).toHaveBeenCalledWith('outputs');
    expect(mockFolders['outputs'].folder).toHaveBeenCalledWith('outlines');
    expect(outlinesFolder.file).toHaveBeenCalledWith(
      'visible.dxf',
      'visible-dxf'
    );
    expect(outlinesFolder.file).toHaveBeenCalledWith(
      'visible.svg',
      'visible-svg'
    );
    expect(outlinesFolder.file).not.toHaveBeenCalledWith(
      '_hidden.dxf',
      'hidden-dxf'
    );
  });

  it('should include all outlines (including "_") when debug is true', async () => {
    const results = {
      outlines: {
        visible: { dxf: 'visible-dxf' },
        _hidden: { dxf: 'hidden-dxf' },
      },
    };

    await createZip(results as any, '', undefined, true, false);

    const outlinesFolder = mockFolders['outlines'];
    expect(mockZip.folder).toHaveBeenCalledWith('outputs');
    expect(mockFolders['outputs'].folder).toHaveBeenCalledWith('outlines');
    expect(outlinesFolder.file).toHaveBeenCalledWith(
      'visible.dxf',
      'visible-dxf'
    );
    expect(outlinesFolder.file).toHaveBeenCalledWith(
      '_hidden.dxf',
      'hidden-dxf'
    );
  });

  it('should include PCBs and ensure they have the .kicad_pcb extension', async () => {
    const results = {
      pcbs: {
        'main.kicad_pcb': 'pcb-content',
        board: 'board-pcb-content',
      },
    };

    await createZip(results as any, '', undefined, false, false);

    const pcbsFolder = mockFolders['pcbs'];
    expect(mockZip.folder).toHaveBeenCalledWith('outputs');
    expect(mockFolders['outputs'].folder).toHaveBeenCalledWith('pcbs');
    expect(pcbsFolder.file).toHaveBeenCalledWith(
      'main.kicad_pcb',
      'pcb-content'
    );
    expect(pcbsFolder.file).toHaveBeenCalledWith(
      'board.kicad_pcb',
      'board-pcb-content'
    );
  });

  it('should include cases and respect stlPreview', async () => {
    const results = {
      cases: {
        case1: { jscad: 'jscad-content', stl: 'stl-content' },
      },
    };

    // stlPreview = false
    await createZip(results as any, '', undefined, false, false);
    let casesFolder = mockFolders['cases'];
    expect(mockZip.folder).toHaveBeenCalledWith('outputs');
    expect(mockFolders['outputs'].folder).toHaveBeenCalledWith('cases');
    expect(casesFolder.file).toHaveBeenCalledWith(
      'case1.jscad',
      'jscad-content'
    );
    expect(casesFolder.file).not.toHaveBeenCalledWith(
      'case1.stl',
      'stl-content'
    );

    // Reset mocks for next run
    jest.clearAllMocks();
    mockFolders = {};

    // stlPreview = true
    await createZip(results as any, '', undefined, false, true);
    casesFolder = mockFolders['cases'];
    expect(mockZip.folder).toHaveBeenCalledWith('outputs');
    expect(mockFolders['outputs'].folder).toHaveBeenCalledWith('cases');
    expect(casesFolder.file).toHaveBeenCalledWith(
      'case1.jscad',
      'jscad-content'
    );
    expect(casesFolder.file).toHaveBeenCalledWith('case1.stl', 'stl-content');
  });

  it('should include debug folder when debug is true', async () => {
    const results = {
      canonical: { can: 1 },
      points: { pts: 2 },
      units: { u: 3 },
      other: { ignored: true },
    };
    const config = 'raw-config';

    await createZip(results as any, config, undefined, true, false);

    const debugFolder = mockFolders['debug'];
    expect(mockZip.folder).toHaveBeenCalledWith('outputs');
    expect(mockFolders['outputs'].folder).toHaveBeenCalledWith('debug');
    expect(debugFolder.file).toHaveBeenCalledWith('raw.txt', config);
    expect(debugFolder.file).toHaveBeenCalledWith(
      'canonical.yaml',
      JSON.stringify(results.canonical, null, 2)
    );
    expect(debugFolder.file).toHaveBeenCalledWith(
      'points.yaml',
      JSON.stringify(results.points, null, 2)
    );
    expect(debugFolder.file).toHaveBeenCalledWith(
      'units.yaml',
      JSON.stringify(results.units, null, 2)
    );
    expect(debugFolder.file).not.toHaveBeenCalledWith(
      'other.yaml',
      expect.anything()
    );
  });

  it('should include footprints with nested folders', async () => {
    const injections = [
      ['footprint', 'simple', 'simple-content'],
      ['footprint', 'nested/deep/foot', 'deep-content'],
    ];

    await createZip({} as any, '', injections, false, false);

    const footprintsFolder = mockFolders['footprints'];
    expect(mockZip.folder).toHaveBeenCalledWith('footprints');

    // simple.js
    expect(footprintsFolder.file).toHaveBeenCalledWith(
      'simple.js',
      'simple-content'
    );

    // nested/deep/foot.js
    const nestedFolder = mockFolders['nested'];
    const deepFolder = mockFolders['deep'];
    expect(footprintsFolder.folder).toHaveBeenCalledWith('nested');
    expect(nestedFolder.folder).toHaveBeenCalledWith('deep');
    expect(deepFolder.file).toHaveBeenCalledWith('foot.js', 'deep-content');
  });

  it('should call generateAsync with correct options and trigger download', async () => {
    const results = {};
    const config = '';

    await createZip(results as any, config, undefined, false, false);

    expect(mockZip.generateAsync).toHaveBeenCalledWith({
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 9 },
    });

    expect(saveAs).toHaveBeenCalledWith(
      expect.anything(),
      expect.stringMatching(/^ergogen-\d{4}-\d{2}-\d{2}\.zip$/)
    );
  });
});

describe('downloadAllConfigs', () => {
  let mockZip: any;
  let mockFolders: Record<string, any>;

  const createMockFolder = () => {
    const folder: any = {
      file: jest.fn().mockReturnThis(),
      folder: jest.fn(),
    };
    folder.folder.mockImplementation((name: string) => {
      if (!mockFolders[name]) {
        mockFolders[name] = createMockFolder();
      }
      return mockFolders[name];
    });
    return folder;
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockFolders = {};

    mockZip = {
      file: jest.fn().mockReturnThis(),
      folder: jest.fn().mockImplementation((name: string) => {
        if (!mockFolders[name]) {
          mockFolders[name] = createMockFolder();
        }
        return mockFolders[name];
      }),
      generateAsync: jest
        .fn()
        .mockResolvedValue(new Blob(['mock config zip content'])),
    };

    (JSZip as unknown as jest.Mock).mockImplementation(() => mockZip);
  });

  it('should include configs in root and package injections', async () => {
    const configs = [
      { name: 'Ergonomic Board', config: 'points: {}' },
      { name: 'Keyboard/Alpha', config: 'points: { alpha: true }' },
    ];
    const injections = [
      ['footprint', 'deep/foot', 'foot-content'],
      ['outline', 'out-1', 'outline-content'],
      ['template', 'temp-1', 'template-content'],
    ];

    await downloadAllConfigs(configs, injections);

    // Assert files in root
    expect(mockZip.file).toHaveBeenCalledWith(
      'Ergonomic Board.yaml',
      'points: {}'
    );
    expect(mockZip.file).toHaveBeenCalledWith(
      'Keyboard_Alpha.yaml',
      'points: { alpha: true }'
    );

    // Assert injections folders structure
    expect(mockZip.folder).toHaveBeenCalledWith('footprints');
    const footprintsFolder = mockFolders['footprints'];
    const deepFolder = mockFolders['deep'];
    expect(footprintsFolder.folder).toHaveBeenCalledWith('deep');
    expect(deepFolder.file).toHaveBeenCalledWith('foot.js', 'foot-content');

    expect(mockZip.folder).toHaveBeenCalledWith('outlines');
    const outlinesFolder = mockFolders['outlines'];
    expect(outlinesFolder.file).toHaveBeenCalledWith(
      'out-1.js',
      'outline-content'
    );

    expect(mockZip.folder).toHaveBeenCalledWith('templates');
    const templatesFolder = mockFolders['templates'];
    expect(templatesFolder.file).toHaveBeenCalledWith(
      'temp-1.js',
      'template-content'
    );

    expect(saveAs).toHaveBeenCalledWith(
      expect.anything(),
      expect.stringMatching(/^ergogen-config-all-\d{4}-\d{2}-\d{2}\.zip$/)
    );
  });
});
