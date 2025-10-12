import { generateArchive } from './archiveDownload';

// Mock JSZip and saveAs
const mockFile = jest.fn();
const mockFolder = jest.fn();
const mockGenerateAsync = jest.fn();

const createMockZip = () => {
  const mockZip = {
    file: mockFile,
    folder: mockFolder,
    generateAsync: mockGenerateAsync,
  };
  mockFolder.mockReturnValue(mockZip);
  mockFile.mockReturnValue(mockZip);
  return mockZip;
};

global.JSZip = jest
  .fn()
  .mockImplementation(() => createMockZip()) as unknown as typeof JSZip;

global.saveAs = jest.fn();

describe('archiveDownload', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset mocks for each test
    mockFolder.mockClear();
    mockFile.mockClear();
    mockGenerateAsync.mockClear();
    (global.JSZip as jest.Mock).mockImplementation(() => createMockZip());
    (global.saveAs as jest.Mock).mockClear();
  });

  describe('generateArchive', () => {
    it('should not generate archive when configInput is undefined', async () => {
      // Arrange
      const configInput = undefined;
      const injectionInput: string[][] = [];
      const results = { demo: { svg: 'test' } };
      const debug = false;
      const stlPreview = false;

      // Act
      await generateArchive(
        configInput,
        injectionInput,
        results,
        debug,
        stlPreview
      );

      // Assert
      expect(global.JSZip).not.toHaveBeenCalled();
    });

    it('should not generate archive when results is null', async () => {
      // Arrange
      const configInput = 'test: config';
      const injectionInput: string[][] = [];
      const results = null;
      const debug = false;
      const stlPreview = false;

      // Act
      await generateArchive(
        configInput,
        injectionInput,
        results,
        debug,
        stlPreview
      );

      // Assert
      expect(global.JSZip).not.toHaveBeenCalled();
    });

    it('should add config.yaml and demo.svg to root', async () => {
      // Arrange
      const configInput = 'test: config';
      const injectionInput: string[][] = [];
      const results = {
        demo: { svg: '<svg>demo</svg>' },
      };
      const debug = false;
      const stlPreview = false;

      mockGenerateAsync.mockResolvedValue(new Blob(['test']));

      // Act
      await generateArchive(
        configInput,
        injectionInput,
        results,
        debug,
        stlPreview
      );

      // Assert
      expect(mockFile).toHaveBeenCalledWith('config.yaml', configInput);
      expect(mockFile).toHaveBeenCalledWith('demo.svg', '<svg>demo</svg>');
    });

    it('should add outlines to outlines folder', async () => {
      // Arrange
      const configInput = 'test: config';
      const injectionInput: string[][] = [];
      const results = {
        demo: { svg: '<svg>demo</svg>' },
        outlines: {
          outline1: { dxf: 'dxf1', svg: 'svg1' },
          outline2: { dxf: 'dxf2', svg: 'svg2' },
        },
      };
      const debug = false;
      const stlPreview = false;

      mockGenerateAsync.mockResolvedValue(new Blob(['test']));

      // Act
      await generateArchive(
        configInput,
        injectionInput,
        results,
        debug,
        stlPreview
      );

      // Assert
      expect(mockFolder).toHaveBeenCalledWith('outlines');
      expect(mockFile).toHaveBeenCalledWith('outline1.dxf', 'dxf1');
      expect(mockFile).toHaveBeenCalledWith('outline1.svg', 'svg1');
      expect(mockFile).toHaveBeenCalledWith('outline2.dxf', 'dxf2');
      expect(mockFile).toHaveBeenCalledWith('outline2.svg', 'svg2');
    });

    it('should skip outlines starting with _ when debug is false', async () => {
      // Arrange
      const configInput = 'test: config';
      const injectionInput: string[][] = [];
      const results = {
        demo: { svg: '<svg>demo</svg>' },
        outlines: {
          outline1: { dxf: 'dxf1', svg: 'svg1' },
          _outline2: { dxf: 'dxf2', svg: 'svg2' },
        },
      };
      const debug = false;
      const stlPreview = false;

      mockGenerateAsync.mockResolvedValue(new Blob(['test']));

      // Act
      await generateArchive(
        configInput,
        injectionInput,
        results,
        debug,
        stlPreview
      );

      // Assert
      expect(mockFile).toHaveBeenCalledWith('outline1.dxf', 'dxf1');
      expect(mockFile).not.toHaveBeenCalledWith('_outline2.dxf', 'dxf2');
    });

    it('should include outlines starting with _ when debug is true', async () => {
      // Arrange
      const configInput = 'test: config';
      const injectionInput: string[][] = [];
      const results = {
        demo: { svg: '<svg>demo</svg>' },
        outlines: {
          outline1: { dxf: 'dxf1', svg: 'svg1' },
          _outline2: { dxf: 'dxf2', svg: 'svg2' },
        },
      };
      const debug = true;
      const stlPreview = false;

      mockGenerateAsync.mockResolvedValue(new Blob(['test']));

      // Act
      await generateArchive(
        configInput,
        injectionInput,
        results,
        debug,
        stlPreview
      );

      // Assert
      expect(mockFile).toHaveBeenCalledWith('outline1.dxf', 'dxf1');
      expect(mockFile).toHaveBeenCalledWith('_outline2.dxf', 'dxf2');
    });

    it('should add pcbs to pcbs folder', async () => {
      // Arrange
      const configInput = 'test: config';
      const injectionInput: string[][] = [];
      const results = {
        demo: { svg: '<svg>demo</svg>' },
        pcbs: {
          pcb1: 'pcb1-content',
          pcb2: 'pcb2-content',
        },
      };
      const debug = false;
      const stlPreview = false;

      mockGenerateAsync.mockResolvedValue(new Blob(['test']));

      // Act
      await generateArchive(
        configInput,
        injectionInput,
        results,
        debug,
        stlPreview
      );

      // Assert
      expect(mockFolder).toHaveBeenCalledWith('pcbs');
      expect(mockFile).toHaveBeenCalledWith('pcb1.kicad_pcb', 'pcb1-content');
      expect(mockFile).toHaveBeenCalledWith('pcb2.kicad_pcb', 'pcb2-content');
    });

    it('should add cases to cases folder with jscad', async () => {
      // Arrange
      const configInput = 'test: config';
      const injectionInput: string[][] = [];
      const results = {
        demo: { svg: '<svg>demo</svg>' },
        cases: {
          case1: { jscad: 'jscad1' },
          case2: { jscad: 'jscad2' },
        },
      };
      const debug = false;
      const stlPreview = false;

      mockGenerateAsync.mockResolvedValue(new Blob(['test']));

      // Act
      await generateArchive(
        configInput,
        injectionInput,
        results,
        debug,
        stlPreview
      );

      // Assert
      expect(mockFolder).toHaveBeenCalledWith('cases');
      expect(mockFile).toHaveBeenCalledWith('case1.jscad', 'jscad1');
      expect(mockFile).toHaveBeenCalledWith('case2.jscad', 'jscad2');
    });

    it('should add STL files when stlPreview is true and STL is available', async () => {
      // Arrange
      const configInput = 'test: config';
      const injectionInput: string[][] = [];
      const results = {
        demo: { svg: '<svg>demo</svg>' },
        cases: {
          case1: { jscad: 'jscad1', stl: 'stl1' },
          case2: { jscad: 'jscad2' }, // No STL
        },
      };
      const debug = false;
      const stlPreview = true;

      mockGenerateAsync.mockResolvedValue(new Blob(['test']));

      // Act
      await generateArchive(
        configInput,
        injectionInput,
        results,
        debug,
        stlPreview
      );

      // Assert
      expect(mockFile).toHaveBeenCalledWith('case1.stl', 'stl1');
      expect(mockFile).not.toHaveBeenCalledWith('case2.stl', expect.anything());
    });

    it('should not add STL files when stlPreview is false', async () => {
      // Arrange
      const configInput = 'test: config';
      const injectionInput: string[][] = [];
      const results = {
        demo: { svg: '<svg>demo</svg>' },
        cases: {
          case1: { jscad: 'jscad1', stl: 'stl1' },
        },
      };
      const debug = false;
      const stlPreview = false;

      mockGenerateAsync.mockResolvedValue(new Blob(['test']));

      // Act
      await generateArchive(
        configInput,
        injectionInput,
        results,
        debug,
        stlPreview
      );

      // Assert
      expect(mockFile).not.toHaveBeenCalledWith('case1.stl', 'stl1');
    });

    it('should add debug files when debug is true', async () => {
      // Arrange
      const configInput = 'test: config';
      const injectionInput: string[][] = [];
      const results = {
        demo: { svg: '<svg>demo</svg>' },
        canonical: { test: 'canonical' },
        points: { test: 'points' },
        units: { test: 'units' },
      };
      const debug = true;
      const stlPreview = false;

      mockGenerateAsync.mockResolvedValue(new Blob(['test']));

      // Act
      await generateArchive(
        configInput,
        injectionInput,
        results,
        debug,
        stlPreview
      );

      // Assert
      expect(mockFolder).toHaveBeenCalledWith('debug');
      expect(mockFile).toHaveBeenCalledWith(
        'canonical.yaml',
        expect.any(String)
      );
      expect(mockFile).toHaveBeenCalledWith('points.yaml', expect.any(String));
      expect(mockFile).toHaveBeenCalledWith('units.yaml', expect.any(String));
      expect(mockFile).toHaveBeenCalledWith('raw.txt', configInput);
    });

    it('should not add debug files when debug is false', async () => {
      // Arrange
      const configInput = 'test: config';
      const injectionInput: string[][] = [];
      const results = {
        demo: { svg: '<svg>demo</svg>' },
        canonical: { test: 'canonical' },
      };
      const debug = false;
      const stlPreview = false;

      mockGenerateAsync.mockResolvedValue(new Blob(['test']));

      // Act
      await generateArchive(
        configInput,
        injectionInput,
        results,
        debug,
        stlPreview
      );

      // Assert
      const debugFolderCalls = mockFolder.mock.calls.filter(
        (call) => call[0] === 'debug'
      );
      expect(debugFolderCalls.length).toBe(0);
    });

    it('should add footprints without nested folders', async () => {
      // Arrange
      const configInput = 'test: config';
      const injectionInput: string[][] = [
        ['footprint', 'simple_footprint', 'content1'],
        ['footprint', 'another_footprint', 'content2'],
      ];
      const results = {
        demo: { svg: '<svg>demo</svg>' },
      };
      const debug = false;
      const stlPreview = false;

      mockGenerateAsync.mockResolvedValue(new Blob(['test']));

      // Act
      await generateArchive(
        configInput,
        injectionInput,
        results,
        debug,
        stlPreview
      );

      // Assert
      expect(mockFolder).toHaveBeenCalledWith('footprints');
      expect(mockFile).toHaveBeenCalledWith('simple_footprint.js', 'content1');
      expect(mockFile).toHaveBeenCalledWith('another_footprint.js', 'content2');
    });

    it('should add footprints with nested folders', async () => {
      // Arrange
      const configInput = 'test: config';
      const injectionInput: string[][] = [
        ['footprint', 'ceoloide/mr_useful_logo', 'content1'],
        ['footprint', 'ceoloide/experimental/choc_v2', 'content2'],
      ];
      const results = {
        demo: { svg: '<svg>demo</svg>' },
      };
      const debug = false;
      const stlPreview = false;

      mockGenerateAsync.mockResolvedValue(new Blob(['test']));

      // Act
      await generateArchive(
        configInput,
        injectionInput,
        results,
        debug,
        stlPreview
      );

      // Assert
      expect(mockFolder).toHaveBeenCalledWith('footprints');
      expect(mockFolder).toHaveBeenCalledWith('ceoloide');
      expect(mockFolder).toHaveBeenCalledWith('experimental');
      expect(mockFile).toHaveBeenCalledWith('mr_useful_logo.js', 'content1');
      expect(mockFile).toHaveBeenCalledWith('choc_v2.js', 'content2');
    });

    it('should skip non-footprint injections', async () => {
      // Arrange
      const configInput = 'test: config';
      const injectionInput: string[][] = [
        ['footprint', 'footprint1', 'content1'],
        ['template', 'template1', 'template-content'],
      ];
      const results = {
        demo: { svg: '<svg>demo</svg>' },
      };
      const debug = false;
      const stlPreview = false;

      mockGenerateAsync.mockResolvedValue(new Blob(['test']));

      // Act
      await generateArchive(
        configInput,
        injectionInput,
        results,
        debug,
        stlPreview
      );

      // Assert
      expect(mockFile).toHaveBeenCalledWith('footprint1.js', 'content1');
      expect(mockFile).not.toHaveBeenCalledWith(
        'template1.js',
        'template-content'
      );
    });

    it('should generate and download the zip file', async () => {
      // Arrange
      const configInput = 'test: config';
      const injectionInput: string[][] = [];
      const results = {
        demo: { svg: '<svg>demo</svg>' },
      };
      const debug = false;
      const stlPreview = false;

      const mockBlob = new Blob(['test-zip']);
      mockGenerateAsync.mockResolvedValue(mockBlob);

      // Act
      await generateArchive(
        configInput,
        injectionInput,
        results,
        debug,
        stlPreview
      );

      // Assert
      expect(mockGenerateAsync).toHaveBeenCalledWith({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 9 },
      });
      expect(global.saveAs).toHaveBeenCalledWith(
        mockBlob,
        expect.stringMatching(/^ergogen-\d{4}-\d{2}-\d{2}\.zip$/)
      );
    });
  });
});
