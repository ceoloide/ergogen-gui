import InjectionRow from '../atoms/InjectionRow';
import { Injection } from '../atoms/InjectionRow';
import styled from 'styled-components';
import { useConfigContext } from '../context/ConfigContext';
import { Dispatch, SetStateAction, useRef, useState } from 'react';
import GrowButton from '../atoms/GrowButton';
import { useInjectionConflictResolution } from '../hooks/useInjectionConflictResolution';
import ConflictResolutionDialog from './ConflictResolutionDialog';
import { theme } from '../theme/theme';

const ActionsContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
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
  flex-direction: column;
  flex-grow: 1;
`;

const TabContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid ${theme.colors.backgroundLight};
`;

const Tab = styled.button<{ $active: boolean }>`
  background: none;
  border: none;
  color: ${(props) => (props.$active ? theme.colors.accent : theme.colors.white)};
  font-size: ${theme.fontSizes.bodySmall};
  font-weight: ${(props) => (props.$active ? 'bold' : 'normal')};
  padding: 0.5rem 0;
  cursor: pointer;
  border-bottom: 2px solid
    ${(props) => (props.$active ? theme.colors.accent : 'transparent')};

  &:hover {
    color: ${theme.colors.accent};
  }
`;

/**
 * Props for the Injections component.
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
 */
type InjectionArr = Array<Injection>;

/**
 * A component that displays and manages lists of custom footprints and outlines.
 */
const Injections = ({
  setInjectionToEdit,
  deleteInjection,
  injectionToEdit,
  onInjectionSelect,
  'data-testid': dataTestId,
}: Props) => {
  const [activeTab, setActiveTab] = useState<'footprints' | 'outlines'>('footprints');
  const footprints: InjectionArr = [];
  const outlines: InjectionArr = [];

  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const configContext = useConfigContext();

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
        const item = {
          key: i,
          type: injection[0],
          name: injection[1],
          content: injection[2],
        };
        if (injection[0] === 'footprint') {
          footprints.push(item);
        } else if (injection[0] === 'outline') {
          outlines.push(item);
        }
      }
    }
  }

  const handleNewInjection = () => {
    const nextKey = configContext?.injectionInput?.length || 0;
    let newInjection: Injection;

    if (activeTab === 'footprints') {
      newInjection = {
        key: nextKey,
        type: 'footprint',
        name: `custom_footprint_${nextKey + 1}`,
        content: "module.exports = {\n  params: {\n    designator: '',\n  },\n  body: p => ``\n}",
      };
    } else {
      newInjection = {
        key: nextKey,
        type: 'outline',
        name: `custom_outline_${nextKey + 1}`,
        content: "const u = require('../utils')\nmodule.exports = u.outlineFromSvg(``)",
      };
    }

    setInjectionToEdit(newInjection);
    if (onInjectionSelect) {
      onInjectionSelect();
    }
  };

  const handleLoadFiles = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const type = activeTab === 'footprints' ? 'footprint' : 'outline';
    const newInjections: string[][] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.name.endsWith('.js')) {
        const content = await file.text();
        const name = file.name.replace(/\.js$/, '');
        newInjections.push([type, name, content]);
      }
    }

    if (newInjections.length > 0) {
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

    const type = activeTab === 'footprints' ? 'footprint' : 'outline';
    const newInjections: string[][] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.name.endsWith('.js')) {
        const content = await file.text();
        const pathParts = file.webkitRelativePath.split('/');
        pathParts.shift(); // Remove the top-level folder
        const name = pathParts.join('/').replace(/\.js$/, '');
        newInjections.push([type, name, content]);
      }
    }

    if (newInjections.length > 0) {
      await processInjectionsWithConflictResolution(
        newInjections,
        configContext.configInput || ''
      );
    }
    // Reset input
    event.target.value = '';
  };

  const currentList = activeTab === 'footprints' ? footprints : outlines;
  const itemLabel = activeTab === 'footprints' ? 'footprint' : 'outline';

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

      <TabContainer>
        <Tab
          $active={activeTab === 'footprints'}
          onClick={() => setActiveTab('footprints')}
          data-testid="tab-footprints"
        >
          Footprints
        </Tab>
        <Tab
          $active={activeTab === 'outlines'}
          onClick={() => setActiveTab('outlines')}
          data-testid="tab-outlines"
        >
          Outlines
        </Tab>
      </TabContainer>

      {currentList.map((injection) => {
        return (
          <InjectionRow
            key={injection.key}
            injection={injection}
            setInjectionToEdit={(inj) => {
              setInjectionToEdit(inj);
              if (onInjectionSelect) {
                onInjectionSelect();
              }
            }}
            deleteInjection={deleteInjection}
            previewKey={injectionToEdit.name}
            data-testid={dataTestId && `${dataTestId}-${injection.name}`}
          />
        );
      })}

      <ActionsContainer>
        <GrowButton
          onClick={handleNewInjection}
          data-testid={`add-${itemLabel}`}
          aria-label={`Add new custom ${itemLabel}`}
          title={`Add new custom ${itemLabel}`}
        >
          <span className="material-symbols-outlined">add</span>
        </GrowButton>
        <IconButton
          onClick={() => fileInputRef.current?.click()}
          data-testid={`load-${itemLabel}-files`}
          aria-label={`Load custom ${itemLabel} files`}
          title={`Load ${itemLabel} files`}
        >
          <span className="material-symbols-outlined">upload_file</span>
        </IconButton>
        <IconButton
          onClick={() => folderInputRef.current?.click()}
          data-testid={`load-${itemLabel}-folder`}
          aria-label={`Load custom ${itemLabel} folder`}
          title={`Load ${itemLabel} folder`}
        >
          <span className="material-symbols-outlined">drive_folder_upload</span>
        </IconButton>
      </ActionsContainer>

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
