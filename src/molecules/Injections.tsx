import InjectionRow from '../atoms/InjectionRow';
import { Injection } from '../atoms/InjectionRow';
import styled from 'styled-components';
import { theme } from '../theme/theme';
import { useConfigContext } from '../context/ConfigContext';
import { Dispatch, SetStateAction, useRef, useState } from 'react';
import GrowButton from '../atoms/GrowButton';
import { useInjectionConflictResolution } from '../hooks/useInjectionConflictResolution';
import ConflictResolutionDialog from './ConflictResolutionDialog';
import Title from '../atoms/Title';
import { trackEvent } from '../utils/analytics';
import { isFeatureEnabled } from '../utils/featureFlags';

const ActionsContainer = styled.div`
  display: flex;
  margin-left: 0.5rem;
  margin-left: 0.5rem;
  gap: 8px;
  margin-top: 0.5rem;
`;

const IconButton = styled(GrowButton)`
  flex-grow: 0;
  width: 34px;
  padding: 0;
`;

/**
 * A styled container for the injections list.
 */
const InjectionsContainer = styled.div`
  display: flex;
  margin-left: 0.5rem;
  flex-direction: column;
  flex-grow: 1;
  gap: 0.5rem;
`;
const TabsContainer = styled.div`
  display: flex;
  margin-left: 0.5rem;
  border-bottom: 1px solid ${theme.colors.border};
  margin-left: 0.5rem;
  gap: 16px;
`;

const TabButton = styled.button<{ $active: boolean }>`
  background: none;
  border: none;
  color: ${(props) =>
    props.$active ? theme.colors.text : theme.colors.textDark};
  padding: 0.75rem 0;
  cursor: pointer;
  font-size: ${theme.fontSizes.bodySmall};
  font-weight: ${theme.fontWeights.semiBold};
  border-bottom: 2px solid
    ${(props) => (props.$active ? theme.colors.accent : 'transparent')};
  transition: all 0.2s ease-in-out;

  &:hover {
    color: ${theme.colors.text};
  }
`;

// Use the shared Title component from atoms

/**
 * Props for the Injections component.
 * @typedef {object} Props
 * @property {Dispatch<SetStateAction<Injection>>} setInjectionToEdit - Function to set the injection to be edited.
 * @property {(injection: Injection) => void} deleteInjection - Function to delete an injection.
 * @property {() => void} [onInjectionSelect] - Optional callback when an injection is selected (for mobile).
 */
type Props = {
  setInjectionToEdit: Dispatch<SetStateAction<Injection>>;
  deleteInjection: (injection: Injection) => void;
  injectionToEdit: Injection;
  onInjectionSelect?: () => void;
  'data-testid'?: string;
};

/**
 * An array of Injection objects.
 * @typedef {Injection[]} InjectionArr
 */
type InjectionArr = Array<Injection>;

/**
 * A component that displays and manages lists of custom footprints and templates.
 * It reads injection data from the ConfigContext and provides functionality to add new injections.
 *
 * @param {Props} props - The props for the component.
 * @returns {JSX.Element | null} The rendered component or null if context is not available.
 */
const Injections = ({
  setInjectionToEdit,
  deleteInjection,
  injectionToEdit,
  onInjectionSelect,
  'data-testid': dataTestId,
}: Props) => {
  const footprints: InjectionArr = [];
  const outlines: InjectionArr = [];
  const templates: InjectionArr = [];
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const configContext = useConfigContext();
  const [activeUploadType, setActiveUploadType] = useState<
    'footprint' | 'outline' | 'template'
  >('footprint');
  const [activeTab, setActiveTab] = useState<
    'footprints' | 'outlines' | 'templates'
  >('footprints');

  // Use the injection conflict resolution hook
  const {
    currentConflict,
    processInjectionsWithConflictResolution,
    handleConflictResolution,
    handleConflictCancel,
  } = useInjectionConflictResolution({
    setInjectionInput: (injections) =>
      configContext?.setInjectionInput(injections),
    setConfigInput: (config) => configContext?.setConfigInput(config),
    generateNow: async (config, injections, options) => {
      await configContext?.generateNow(config, injections, options);
    },
    getCurrentInjections: () => configContext?.injectionInput || [],
    setError: (error) => configContext?.setError(error),
  });

  if (!configContext) return null;

  const { injectionInput } = configContext;
  if (
    injectionInput &&
    Array.isArray(injectionInput) &&
    injectionInput.length > 0
  ) {
    for (let i = 0; i < injectionInput.length; i++) {
      const injection = injectionInput[i];
      if (injection.length === 3) {
        let collection = templates;
        if (injection[0] === 'footprint') {
          collection = footprints;
        } else if (injection[0] === 'outline') {
          collection = outlines;
        } else if (injection[0] === 'template') {
          collection = templates;
        }
        collection.push({
          key: i,
          type: injection[0],
          name: injection[1],
          content: injection[2],
        });
      }
    }
  }

  /**
   * Handles the creation of a new footprint.
   * It creates a new injection object with a default template and calls `setInjectionToEdit`
   * to open it in the editor.
   */
  const handleNewFootprint = () => {
    const nextKey = configContext?.injectionInput?.length || 0;
    const newInjection = {
      key: nextKey,
      type: 'footprint',
      name: `custom_footprint_${nextKey + 1}`,
      content:
        "module.exports = {\n  params: {\n    designator: '',\n  },\n  body: p => ``\n}",
    };
    trackEvent('injection_created', { injection_type: 'footprint' });
    setInjectionToEdit(newInjection);
    // Show editor on mobile when new injection is created
    if (onInjectionSelect) {
      onInjectionSelect();
    }
  };

  const handleNewOutline = () => {
    const nextKey = configContext?.injectionInput?.length || 0;
    const newInjection = {
      key: nextKey,
      type: 'outline',
      name: `custom_outline_${nextKey + 1}`,
      content:
        'const u = require(\'../utils\');\n\nmodule.exports = (config, name, points, outlines, units) => {\n    const paths = [\n        ""  // Add your SVG path(s) here\n    ];\n    return u.svg_paths_to_outline(paths, config, name, points, outlines, units);\n};',
    };
    trackEvent('injection_created', { injection_type: 'outline' });
    setInjectionToEdit(newInjection);
    // Show editor on mobile when new injection is created
    if (onInjectionSelect) {
      onInjectionSelect();
    }
  };

  const handleNewTemplate = () => {
    const nextKey = configContext?.injectionInput?.length || 0;
    const newInjection = {
      key: nextKey,
      type: 'template',
      name: `custom_template_${nextKey + 1}`,
      content:
        "const m = require('makerjs')\nconst version = require('../../package.json').version\n\nmodule.exports = {\n    convert_outline: (model, layer) => {\n        return ``;  // Return your converted outlines\n    },\n    body: params => {\n        return ``;  // Add your template text here\n    }\n}",
    };
    trackEvent('injection_created', { injection_type: 'template' });
    setInjectionToEdit(newInjection);
    // Show editor on mobile when new injection is created
    if (onInjectionSelect) {
      onInjectionSelect();
    }
  };

  const handleLoadFiles = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const newInjections: string[][] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.name.endsWith('.js')) {
        const content = await file.text();
        const name = file.name.replace(/\.js$/, '');
        newInjections.push([activeUploadType, name, content]);
      }
    }

    if (newInjections.length > 0) {
      trackEvent('injection_uploaded', {
        injection_type: activeUploadType,
        source: 'file',
        file_count: newInjections.length,
      });
      await processInjectionsWithConflictResolution(
        newInjections,
        configContext.configInput || ''
      );
    }
    // Reset input
    event.target.value = '';
  };

  const handleLoadFolder = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const newInjections: string[][] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.name.endsWith('.js')) {
        const content = await file.text();
        // webkitRelativePath looks like "foldername/subfolder/file.js"
        // The requirement is to exclude the selected folder name itself.
        const pathParts = file.webkitRelativePath.split('/');
        pathParts.shift(); // Remove the top-level folder
        const name = pathParts.join('/').replace(/\.js$/, '');
        newInjections.push([activeUploadType, name, content]);
      }
    }

    if (newInjections.length > 0) {
      trackEvent('injection_uploaded', {
        injection_type: activeUploadType,
        source: 'folder',
        file_count: newInjections.length,
      });
      await processInjectionsWithConflictResolution(
        newInjections,
        configContext.configInput || ''
      );
    }
    // Reset input
    event.target.value = '';
  };

  return (
    <InjectionsContainer data-testid={dataTestId}>
      {currentConflict && (
        <ConflictResolutionDialog
          injectionName={currentConflict.name}
          injectionType={currentConflict.type}
          onResolve={handleConflictResolution}
          onCancel={handleConflictCancel}
          data-testid="conflict-resolution-dialog"
        />
      )}
      <Title>Custom Libraries</Title>
      <TabsContainer>
        <TabButton
          $active={activeTab === 'footprints'}
          onClick={() => {
            setActiveTab('footprints');
            setActiveUploadType('footprint');
          }}
          data-testid="tab-footprints"
        >
          Footprints
        </TabButton>
        {isFeatureEnabled('outlines') && (
          <TabButton
            $active={activeTab === 'outlines'}
            onClick={() => {
              setActiveTab('outlines');
              setActiveUploadType('outline');
            }}
            data-testid="tab-outlines"
          >
            Outlines
          </TabButton>
        )}
        {isFeatureEnabled('templates') && (
          <TabButton
            $active={activeTab === 'templates'}
            onClick={() => {
              setActiveTab('templates');
              setActiveUploadType('template');
            }}
            data-testid="tab-templates"
          >
            Templates
          </TabButton>
        )}
      </TabsContainer>

      {activeTab === 'footprints' && (
        <>
          {footprints.map((footprint) => {
            return (
              <InjectionRow
                key={footprint.key}
                injection={footprint}
                setInjectionToEdit={(injection) => {
                  trackEvent('injection_editor_opened', {
                    injection_type: injection.type,
                  });
                  setInjectionToEdit(injection);
                  // Show editor on mobile when injection is selected
                  if (onInjectionSelect) {
                    onInjectionSelect();
                  }
                }}
                deleteInjection={deleteInjection}
                previewKey={injectionToEdit.name}
                data-testid={dataTestId && `${dataTestId}-${footprint.name}`}
              />
            );
          })}

          <ActionsContainer>
            <GrowButton
              onClick={handleNewFootprint}
              data-testid="add-footprint"
              aria-label="Add new custom footprint"
              title="Add footprint"
            >
              <span className="material-symbols-outlined">add</span>
            </GrowButton>
            <IconButton
              onClick={() => {
                setActiveUploadType('footprint');
                setTimeout(() => fileInputRef.current?.click(), 0);
              }}
              data-testid="load-footprint-files"
              aria-label="Load custom footprint files"
              title="Load footprint files"
            >
              <span className="material-symbols-outlined">upload_file</span>
            </IconButton>
            <IconButton
              onClick={() => {
                setActiveUploadType('footprint');
                setTimeout(() => folderInputRef.current?.click(), 0);
              }}
              data-testid="load-footprint-folder"
              aria-label="Load custom footprint folder"
              title="Load footprint folder"
            >
              <span className="material-symbols-outlined">
                drive_folder_upload
              </span>
            </IconButton>
          </ActionsContainer>
        </>
      )}

      {activeTab === 'outlines' && isFeatureEnabled('outlines') && (
        <>
          {outlines.map((outline) => {
            return (
              <InjectionRow
                key={outline.key}
                injection={outline}
                setInjectionToEdit={(injection) => {
                  trackEvent('injection_editor_opened', {
                    injection_type: injection.type,
                  });
                  setInjectionToEdit(injection);
                  // Show editor on mobile when injection is selected
                  if (onInjectionSelect) {
                    onInjectionSelect();
                  }
                }}
                deleteInjection={deleteInjection}
                previewKey={injectionToEdit.name}
                data-testid={dataTestId && `${dataTestId}-${outline.name}`}
              />
            );
          })}

          <ActionsContainer>
            <GrowButton
              onClick={handleNewOutline}
              data-testid="add-outline"
              aria-label="Add new custom outline"
              title="Add outline"
            >
              <span className="material-symbols-outlined">add</span>
            </GrowButton>
            <IconButton
              onClick={() => {
                setActiveUploadType('outline');
                setTimeout(() => fileInputRef.current?.click(), 0);
              }}
              data-testid="load-outline-files"
              aria-label="Load custom outline files"
              title="Load outline files"
            >
              <span className="material-symbols-outlined">upload_file</span>
            </IconButton>
            <IconButton
              onClick={() => {
                setActiveUploadType('outline');
                setTimeout(() => folderInputRef.current?.click(), 0);
              }}
              data-testid="load-outline-folder"
              aria-label="Load custom outline folder"
              title="Load outline folder"
            >
              <span className="material-symbols-outlined">
                drive_folder_upload
              </span>
            </IconButton>
          </ActionsContainer>
        </>
      )}

      {activeTab === 'templates' && isFeatureEnabled('templates') && (
        <>
          {templates.map((template) => {
            return (
              <InjectionRow
                key={template.key}
                injection={template}
                setInjectionToEdit={(injection) => {
                  trackEvent('injection_editor_opened', {
                    injection_type: injection.type,
                  });
                  setInjectionToEdit(injection);
                  // Show editor on mobile when injection is selected
                  if (onInjectionSelect) {
                    onInjectionSelect();
                  }
                }}
                deleteInjection={deleteInjection}
                previewKey={injectionToEdit.name}
                data-testid={dataTestId && `${dataTestId}-${template.name}`}
              />
            );
          })}

          <ActionsContainer>
            <GrowButton
              onClick={handleNewTemplate}
              data-testid="add-template"
              aria-label="Add new custom template"
              title="Add template"
            >
              <span className="material-symbols-outlined">add</span>
            </GrowButton>
            <IconButton
              onClick={() => {
                setActiveUploadType('template');
                setTimeout(() => fileInputRef.current?.click(), 0);
              }}
              data-testid="load-template-files"
              aria-label="Load custom template files"
              title="Load template files"
            >
              <span className="material-symbols-outlined">upload_file</span>
            </IconButton>
            <IconButton
              onClick={() => {
                setActiveUploadType('template');
                setTimeout(() => folderInputRef.current?.click(), 0);
              }}
              data-testid="load-template-folder"
              aria-label="Load custom template folder"
              title="Load template folder"
            >
              <span className="material-symbols-outlined">
                drive_folder_upload
              </span>
            </IconButton>
          </ActionsContainer>
        </>
      )}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleLoadFiles}
        accept=".js"
        multiple
        style={{ display: 'none' }}
      />
      <input
        type="file"
        ref={folderInputRef}
        onChange={handleLoadFolder}
        accept=".js"
        style={{ display: 'none' }}
        /* eslint-disable-next-line */
        {...({ webkitdirectory: '', directory: '' } as any)}
      />
    </InjectionsContainer>
  );
};

export default Injections;
