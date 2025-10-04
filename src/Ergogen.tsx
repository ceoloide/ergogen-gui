import { useEffect, useState, ChangeEvent } from 'react';
import styled from 'styled-components';
import Split from 'react-split';
import yaml from 'js-yaml';
import { useHotkeys } from 'react-hotkeys-hook';

import ConfigEditor from './molecules/ConfigEditor';
import InjectionEditor from './molecules/InjectionEditor';
import Downloads from './molecules/Downloads';
import Injections from './molecules/Injections';
import FilePreview from './molecules/FilePreview';

import { useConfigContext } from './context/ConfigContext';
import { isMacOS } from './utils/platform';
import Input from './atoms/Input';
import { Injection } from './atoms/InjectionRow';
import GenOption from './atoms/GenOption';
import OutlineIconButton from './atoms/OutlineIconButton';
import GrowButton from './atoms/GrowButton';
import Title from './atoms/Title';

// Shortcut key sub-label styled component
const ShortcutKey = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #239923;
  border-radius: 6px;
  padding: 0 0.5em;
  margin-left: 1em;
  font-family: 'Roboto', sans-serif;
  font-size: 13px;
  height: 1.7em;
  min-width: 2.2em;
  color: #fff;
  box-sizing: border-box;
  user-select: none;
`;
// Utility to get the correct shortcut for the user's OS
function getShortcutLabel() {
  return (
    <>
      <span>{isMacOS() ? '⌘' : 'Ctrl'}&nbsp;⏎</span>
    </>
  );
}

/**
 * A container for a sub-header, designed to be displayed on smaller screens.
 */
const SubHeaderContainer = styled.div`
  width: 100%;
  height: 3em;
  display: none;
  align-items: center;
  border-bottom: 1px solid #3f3f3f;
  flex-direction: row;
  gap: 10px;
  padding: 0 1rem;
  flex-shrink: 0;

  @media (max-width: 639px) {
    display: flex;
    padding: 0 0.5rem;
  }
`;

/**
 * A spacer component that grows to fill available space in a flex container.
 */
const Spacer = styled.div`
  flex-grow: 1;
`;

/**
 * A styled button with a green background, used for primary actions on mobile.
 */
const GenerateIconButton = styled.button`
  background-color: #239923;
  transition: background-color 0.15s ease-in-out;
  border: none;
  border-radius: 6px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  cursor: pointer;
  height: 34px;
  font-family: 'Roboto', sans-serif;
  padding: 8px 12px !important;

  .material-symbols-outlined {
    font-size: 16px !important;
  }

  &:hover {
    background-color: #1e8e1e;
  }
`;

/**
 * A container for editor components, ensuring it fills available space.
 */
const EditorContainer = styled.div`
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  width: 100%;
  flex-grow: 1;
`;

/**
 * A container for action buttons, hidden on smaller screens.
 */
const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  align-items: stretch;
  padding: 10px;

  @media (max-width: 639px) {
    display: none;
  }
`;

/**
 * The main wrapper for the entire Ergogen application UI.
 */
const ErgogenWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  height: 100%;
  overflow: hidden;
  padding: 0;
`;

/**
 * A styled version of the FilePreview component.
 */
const StyledFilePreview = styled(FilePreview)`
  height: 100%;
`;

const ScrollablePanelContainer = styled.div`
  height: 100%;
  overflow-y: auto;
`;

/**
 * A styled version of the ConfigEditor component.
 */
const StyledConfigEditor = styled(ConfigEditor)`
  position: relative;
  flex-grow: 1;
`;

/**
 * A container for settings and options.
 */
const OptionContainer = styled.div`
  display: inline-grid;
  justify-content: space-between;
`;

/**
 * A styled version of the `react-split` component, providing resizable panes.
 */
const StyledSplit = styled(Split)`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;

  .gutter {
    background-color: #3f3f3f;
    border-radius: 0.15rem;

    background-repeat: no-repeat;
    background-position: 50%;

    &:hover {
      background-color: #676767;
    }

    &.gutter-horizontal {
      cursor: col-resize;
      background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAIklEQVQoU2M4c+bMfxAGAgYYmwGrIIiDjrELjpo5aiZeMwF+yNnOs5KSvgAAAABJRU5ErkJggg==');
    }
  }
`;

/**
 * A container for the left pane in a split layout.
 */
const LeftSplitPane = styled.div`
  position: relative;
  @media (min-width: 640px) {
    min-width: 300px;
  }
`;

/**
 * A container for the right pane in a split layout.
 */
const RightSplitPane = styled.div`
  position: relative;
`;

/**
 * Recursively finds a nested property within an object using a dot-separated string.
 * @param {string} resultToFind - The dot-separated path to the desired property (e.g., "outlines.top.svg").
 * @param {any} resultsToSearch - The object to search within.
 * @returns {any | undefined} The found property value, or undefined if not found.
 */
const findResult = (
  resultToFind: string,
  resultsToSearch: any
): any | undefined => {
  if (resultsToSearch === null) return null;
  if (resultToFind === '') return resultsToSearch;
  const properties = resultToFind.split('.');
  const currentProperty = properties[0] as keyof typeof resultsToSearch;
  const remainingProperties = properties.slice(1).join('.');
  return resultsToSearch.hasOwnProperty(currentProperty)
    ? findResult(remainingProperties, resultsToSearch[currentProperty])
    : undefined;
};

/**
 * A flex container that allows its children to wrap and grow.
 */
const FlexContainer = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
`;

/**
 * The main component of the Ergogen application.
 * It orchestrates the layout, state management, and interaction between the config editor,
 * previews, download lists, and settings panels.
 *
 * @returns {JSX.Element | null} The rendered Ergogen application UI, or null if the config context is not available.
 */
const Ergogen = () => {
  /**
   * State for the currently displayed file preview.
   * @type {{key: string, extension: string, content: string}}
   */
  const [preview, setPreviewKey] = useState({
    key: 'demo.svg',
    extension: 'svg',
    content: '',
  });

  /**
   * State for the custom injection currently being edited in the settings panel.
   * @type {Injection}
   */
  const [injectionToEdit, setInjectionToEdit] = useState({
    key: -1,
    type: '',
    name: '',
    content: '',
  });

  /**
   * State for the selected example from the dropdown menu.
   * @type {ConfigOption | null}
   */
  const configContext = useConfigContext();

  useHotkeys(
    isMacOS() ? 'meta+enter' : 'ctrl+enter',
    () => {
      if (configContext) {
        configContext.generateNow(
          configContext.configInput,
          configContext.injectionInput,
          { pointsonly: false }
        );
      }
    },
    {
      enableOnFormTags: true,
      preventDefault: true,
    }
  );

  /**
   * Effect to handle changes to the injection being edited.
   * It updates the main injection list in the context when an injection is created or modified.
   */
  useEffect(() => {
    if (injectionToEdit.key === -1) return;
    if (injectionToEdit.name === '') return;
    if (injectionToEdit.content === '') return;
    const editedInjection = [
      injectionToEdit.type,
      injectionToEdit.name,
      injectionToEdit.content,
    ];
    let injections: string[][] = [];
    if (Array.isArray(configContext?.injectionInput)) {
      injections = [...configContext.injectionInput];
    }
    const nextIndex = injections.length;
    if (nextIndex === 0 || nextIndex === injectionToEdit.key) {
      // This is a new injection to add
      injections.push(editedInjection);
      setInjectionToEdit({ ...injectionToEdit, key: nextIndex });
    } else {
      const existingInjection = injections[injectionToEdit.key];
      if (
        existingInjection[0] === injectionToEdit.type &&
        existingInjection[1] === injectionToEdit.name &&
        existingInjection[2] === injectionToEdit.content
      ) {
        // Nothing was changed
        return;
      }
      injections = injections.map((existingInjection, i) => {
        if (i === injectionToEdit.key) {
          return editedInjection;
        } else {
          return existingInjection;
        }
      });
    }
    configContext?.setInjectionInput(injections);
  }, [configContext, injectionToEdit]);

  if (!configContext) return null;
  let result = null;
  if (configContext.results) {
    result = findResult(preview.key, configContext.results);
    // Fallback to the default demo SVG if the current preview key is not found.
    if (result === undefined && preview.key !== 'demo.svg') {
      preview.key = 'demo.svg';
      preview.extension = 'svg';
      result = findResult(preview.key, configContext.results);
    }

    // Process the result based on the file extension to format it for the preview component.
    switch (preview.extension) {
      case 'svg':
      case 'kicad_pcb':
        preview.content = typeof result === 'string' ? result : '';
        break;
      case 'jscad':
        preview.content = typeof result?.jscad === 'string' ? result.jscad : '';
        break;
      case 'yaml':
        preview.content = yaml.dump(result);
        break;
      case 'txt':
        preview.content = configContext.configInput || '';
        break;
      default:
        preview.content = '';
    }
  }

  /**
   * Handles changes to the name input field for the injection being edited.
   * @param {ChangeEvent<HTMLInputElement>} e - The input change event.
   */
  const handleInjectionNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newInjectionToEdit = {
      ...injectionToEdit,
      name: e.target.value,
    };
    setInjectionToEdit(newInjectionToEdit);
  };

  /**
   * Handles the deletion of a custom injection from the list.
   * @param {Injection} injectionToDelete - The injection object to be deleted.
   */
  const handleDeleteInjection = (injectionToDelete: Injection) => {
    if (!Array.isArray(configContext?.injectionInput)) return;
    const injections = [...configContext.injectionInput].filter((e, i) => {
      return i !== injectionToDelete.key;
    });
    configContext.setInjectionInput(injections);
    // Reset or re-index the currently edited injection if it was affected by the deletion.
    if (injectionToEdit.key === injectionToDelete.key) {
      const emptyInjection = { key: -1, type: '', name: '', content: '' };
      setInjectionToEdit(emptyInjection);
    } else if (injectionToEdit.key >= injectionToDelete.key) {
      const reIndexedInjection = {
        ...injectionToEdit,
        key: injectionToEdit.key - 1,
      };
      setInjectionToEdit(reIndexedInjection);
    }
  };

  /**
   * Triggers a browser download of the current configuration as a 'config.yaml' file.
   */
  const handleDownload = () => {
    if (configContext.configInput === undefined) {
      return;
    }
    const element = document.createElement('a');
    const file = new Blob([configContext.configInput], { type: 'text/yaml' });
    element.href = URL.createObjectURL(file);
    element.download = 'config.yaml';
    document.body.appendChild(element);
    element.click();
    URL.revokeObjectURL(element.href);
    document.body.removeChild(element);
  };

  return (
    <ErgogenWrapper>
      {!configContext.showSettings && (
        <SubHeaderContainer>
          <OutlineIconButton
            className={configContext.showConfig ? 'active' : ''}
            onClick={() => configContext.setShowConfig(true)}
          >
            Config
          </OutlineIconButton>
          <OutlineIconButton
            className={!configContext.showConfig ? 'active' : ''}
            onClick={() => configContext.setShowConfig(false)}
          >
            Outputs
          </OutlineIconButton>
          <Spacer />
          {configContext.showConfig && (
            <>
              <GenerateIconButton
                onClick={() =>
                  configContext.generateNow(
                    configContext.configInput,
                    configContext.injectionInput,
                    { pointsonly: false }
                  )
                }
              >
                <span className="material-symbols-outlined">refresh</span>
              </GenerateIconButton>
              <OutlineIconButton onClick={handleDownload}>
                <span className="material-symbols-outlined">download</span>
              </OutlineIconButton>
            </>
          )}
          {!configContext.showConfig && (
            <OutlineIconButton
              onClick={() =>
                configContext.setShowDownloads(!configContext.showDownloads)
              }
            >
              <span className="material-symbols-outlined">
                {configContext.showDownloads
                  ? 'expand_content'
                  : 'collapse_content'}
              </span>
            </OutlineIconButton>
          )}
        </SubHeaderContainer>
      )}
      <FlexContainer>
        {!configContext.showSettings ? (
          <StyledSplit
            direction={'horizontal'}
            sizes={[30, 70]}
            minSize={100}
            gutterSize={5}
            snapOffset={0}
            className={
              configContext.showConfig ? 'show-config' : 'show-outputs'
            }
          >
            <LeftSplitPane>
              <EditorContainer>
                <StyledConfigEditor data-testid="config-editor" />
                <ButtonContainer>
                  <GrowButton
                    onClick={() =>
                      configContext.generateNow(
                        configContext.configInput,
                        configContext.injectionInput,
                        { pointsonly: false }
                      )
                    }
                  >
                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        width: '100%',
                        justifyContent: 'center',
                      }}
                    >
                      <span>Generate</span>
                      <ShortcutKey>{getShortcutLabel()}</ShortcutKey>
                    </span>
                  </GrowButton>
                  <OutlineIconButton onClick={handleDownload}>
                    <span className="material-symbols-outlined">download</span>
                  </OutlineIconButton>
                </ButtonContainer>
              </EditorContainer>
            </LeftSplitPane>

            <RightSplitPane>
              <StyledSplit
                direction={'horizontal'}
                sizes={configContext.showDownloads ? [70, 30] : [100, 0]}
                minSize={configContext.showDownloads ? 100 : 0}
                gutterSize={configContext.showDownloads ? 5 : 0}
                snapOffset={0}
              >
                <LeftSplitPane>
                  <StyledFilePreview
                    data-testid="file-preview"
                    previewExtension={preview.extension}
                    previewKey={`${preview.key}-${configContext.resultsVersion}`}
                    previewContent={preview.content}
                    jscadPreview={configContext.jscadPreview}
                  />
                </LeftSplitPane>
                <RightSplitPane>
                  <ScrollablePanelContainer>
                    <Downloads
                      setPreview={setPreviewKey}
                      previewKey={preview.key}
                    />
                  </ScrollablePanelContainer>
                </RightSplitPane>
              </StyledSplit>
            </RightSplitPane>
          </StyledSplit>
        ) : (
          <StyledSplit
            direction={'horizontal'}
            sizes={[40, 60]}
            minSize={100}
            gutterSize={10}
            snapOffset={0}
          >
            <LeftSplitPane>
              <OptionContainer>
                <Title>Options</Title>
                <GenOption
                  optionId={'autogen'}
                  label={'Auto-generate'}
                  setSelected={configContext.setAutoGen}
                  checked={configContext.autoGen}
                />
                <GenOption
                  optionId={'debug'}
                  label={'Debug'}
                  setSelected={configContext.setDebug}
                  checked={configContext.debug}
                />
                <GenOption
                  optionId={'autogen3d'}
                  label={
                    <>
                      Auto-gen PCB, 3D <small>(slow)</small>
                    </>
                  }
                  setSelected={configContext.setAutoGen3D}
                  checked={configContext.autoGen3D}
                />
                <GenOption
                  optionId={'kicanvasPreview'}
                  label={
                    <>
                      KiCad Preview <small>(experimental)</small>
                    </>
                  }
                  setSelected={configContext.setKicanvasPreview}
                  checked={configContext.kicanvasPreview}
                />
                <GenOption
                  optionId={'jscadPreview'}
                  label={
                    <>
                      JSCAD Preview <small>(experimental)</small>
                    </>
                  }
                  setSelected={configContext.setJscadPreview}
                  checked={configContext.jscadPreview}
                />
              </OptionContainer>
              <Injections
                setInjectionToEdit={setInjectionToEdit}
                deleteInjection={handleDeleteInjection}
                injectionToEdit={injectionToEdit}
              />
            </LeftSplitPane>
            <RightSplitPane>
              <EditorContainer>
                <Title as="h4">Footprint name</Title>
                <Input
                  value={injectionToEdit.name}
                  onChange={handleInjectionNameChange}
                  disabled={injectionToEdit.key === -1}
                  data-testid="footprint-name-input"
                />
                <Title as="h4">Footprint code</Title>
                <InjectionEditor
                  injection={injectionToEdit}
                  setInjection={setInjectionToEdit}
                  options={{ readOnly: injectionToEdit.key === -1 }}
                />
              </EditorContainer>
            </RightSplitPane>
          </StyledSplit>
        )}
      </FlexContainer>
    </ErgogenWrapper>
  );
};

export default Ergogen;
