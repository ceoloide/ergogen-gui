import { useEffect, useState, useRef, ChangeEvent } from 'react';
import styled, { keyframes } from 'styled-components';
import Split from 'react-split';
import yaml from 'js-yaml';
import { useHotkeys } from 'react-hotkeys-hook';

import ConfigEditor from './molecules/ConfigEditor';
import InjectionEditor from './molecules/InjectionEditor';
import Downloads from './molecules/Downloads';
import Injections from './molecules/Injections';
import FilePreview from './molecules/FilePreview';

import { useConfigContext } from './context/ConfigContext';
import { findResult } from './utils/object';
import { isMacOS } from './utils/platform';
import Input from './atoms/Input';
import { Injection } from './atoms/InjectionRow';
import GenOption from './atoms/GenOption';
import OutlineIconButton from './atoms/OutlineIconButton';
import GrowButton from './atoms/GrowButton';
import Title from './atoms/Title';
import { theme } from './theme/theme';
import { createZip } from './utils/zip';
import { createShareableUri } from './utils/share';

// Shortcut key sub-label styled component
const ShortcutKey = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: ${theme.colors.accentSecondary};
  border-radius: 6px;
  padding: 0 0.5em;
  margin-left: 1em;
  font-family: ${theme.fonts.body};
  font-size: ${theme.fontSizes.bodySmall};
  height: 1.7em;
  min-width: 2.2em;
  color: ${theme.colors.white};
  box-sizing: border-box;
  user-select: none;
`;

// Animation for toast notification
// Note: We need to preserve translateX(-50%) for centering while animating translateY
const slideIn = keyframes`
  from {
    transform: translate(-50%, -100%);
    opacity: 0;
  }
  to {
    transform: translate(-50%, 0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translate(-50%, 0);
    opacity: 1;
  }
  to {
    transform: translate(-50%, -100%);
    opacity: 0;
  }
`;

// Toast notification component
const ToastNotification = styled.div<{ $visible: boolean }>`
  position: fixed;
  top: 20px;
  left: 50%;
  background-color: ${theme.colors.backgroundLight};
  border: 1px solid ${theme.colors.border};
  border-radius: 6px;
  padding: 12px 20px;
  color: ${theme.colors.white};
  font-family: ${theme.fonts.body};
  font-size: ${theme.fontSizes.bodyMedium};
  z-index: 10000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  gap: 8px;
  animation: ${(props) => (props.$visible ? slideIn : slideOut)} 0.3s ease-out;
  pointer-events: ${(props) => (props.$visible ? 'auto' : 'none')};
  opacity: ${(props) => (props.$visible ? 1 : 0)};
  transform: translate(-50%, 0);

  .material-symbols-outlined {
    font-size: ${theme.fontSizes.iconMedium} !important;
    color: ${theme.colors.accent};
  }
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
  border-bottom: 1px solid ${theme.colors.border};
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
  background-color: ${theme.colors.accentSecondary};
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
  font-family: ${theme.fonts.body};
  padding: 8px 12px !important;

  .material-symbols-outlined {
    font-size: ${theme.fontSizes.iconMedium} !important;
  }

  &:hover {
    background-color: ${theme.colors.accentDark};
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

const SettingsPaneContainer = styled.div`
  height: 100%;
  overflow-y: auto;
  padding: 0.5rem;

  @media (min-width: 640px) {
    padding: 1rem;
  }
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
    background-color: ${theme.colors.border};
    border-radius: 0.15rem;

    background-repeat: no-repeat;
    background-position: 50%;

    &:hover {
      background-color: ${theme.colors.buttonSecondaryHover};
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

  /**
   * State for showing the share notification toast.
   */
  const [showShareNotification, setShowShareNotification] = useState(false);

  /**
   * Ref to store the notification timeout ID for cleanup.
   */
  const notificationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
   * Cleanup timeout on unmount to prevent memory leaks.
   */
  useEffect(() => {
    return () => {
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current);
      }
    };
  }, []);

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
      case 'stl':
        preview.content = typeof result === 'string' ? result : '';
        break;
      case 'jscad':
        preview.content =
          typeof (result as Record<string, unknown>)?.jscad === 'string'
            ? ((result as Record<string, unknown>).jscad as string)
            : '';
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

  /**
   * Triggers a download of all generated files as a zip archive.
   */
  const handleDownloadArchive = () => {
    if (
      !configContext.results ||
      !configContext.configInput ||
      configContext.isGenerating ||
      configContext.isJscadConverting
    ) {
      return;
    }
    createZip(
      configContext.results,
      configContext.configInput,
      configContext.injectionInput,
      configContext.debug,
      configContext.stlPreview
    );
  };

  /**
   * Creates a shareable URI with the current configuration and copies it to the clipboard.
   */
  const handleShare = async () => {
    if (!configContext.configInput) {
      return;
    }

    const shareableUri = createShareableUri(
      configContext.configInput,
      configContext.injectionInput
    );

    let copied = false;
    try {
      await navigator.clipboard.writeText(shareableUri);
      copied = true;
    } catch (error) {
      console.error('Failed to copy shareable URI to clipboard:', error);
      // Fallback: try using the older execCommand API
      try {
        const textArea = document.createElement('textarea');
        textArea.value = shareableUri;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        copied = true;
      } catch (fallbackError) {
        console.error('Fallback copy method also failed:', fallbackError);
      }
    }

    // Show notification if copy was successful
    if (copied) {
      setShowShareNotification(true);
      // Clear any existing timeout
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current);
      }
      // Set new timeout to hide notification
      notificationTimeoutRef.current = setTimeout(() => {
        setShowShareNotification(false);
      }, 2000); // Hide after 2 seconds
    }
  };

  return (
    <ErgogenWrapper>
      <ToastNotification
        $visible={showShareNotification}
        role="alert"
        aria-live="polite"
        data-testid="share-notification"
      >
        <span className="material-symbols-outlined">check_circle</span>
        <span>Configuration link copied to clipboard</span>
      </ToastNotification>
      {!configContext.showSettings && (
        <SubHeaderContainer>
          <OutlineIconButton
            className={configContext.showConfig ? 'active' : ''}
            onClick={() => configContext.setShowConfig(true)}
            aria-label="Show configuration panel"
            data-testid="mobile-config-button"
          >
            Config
          </OutlineIconButton>
          <OutlineIconButton
            className={!configContext.showConfig ? 'active' : ''}
            onClick={() => configContext.setShowConfig(false)}
            aria-label="Show outputs panel"
            data-testid="mobile-outputs-button"
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
                aria-label="Generate configuration"
                data-testid="mobile-generate-button"
              >
                <span className="material-symbols-outlined">refresh</span>
              </GenerateIconButton>
              <OutlineIconButton
                onClick={handleDownload}
                aria-label="Download configuration"
                data-testid="mobile-download-button"
              >
                <span className="material-symbols-outlined">download</span>
              </OutlineIconButton>
              <OutlineIconButton
                onClick={handleShare}
                aria-label="Share configuration"
                data-testid="mobile-share-button"
              >
                <span className="material-symbols-outlined">share</span>
              </OutlineIconButton>
            </>
          )}
          {!configContext.showConfig && (
            <>
              <OutlineIconButton
                onClick={handleDownloadArchive}
                disabled={
                  configContext.isGenerating || configContext.isJscadConverting
                }
                aria-label="Download archive of all generated files"
                data-testid="subheader-download-outputs-button"
              >
                <span className="material-symbols-outlined">archive</span>
              </OutlineIconButton>
              <OutlineIconButton
                onClick={() =>
                  configContext.setShowDownloads(!configContext.showDownloads)
                }
                aria-label={
                  configContext.showDownloads
                    ? 'Hide downloads panel'
                    : 'Show downloads panel'
                }
                data-testid="mobile-downloads-toggle-button"
              >
                <span className="material-symbols-outlined">
                  {configContext.showDownloads
                    ? 'expand_content'
                    : 'collapse_content'}
                </span>
              </OutlineIconButton>
            </>
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
                    aria-label="Generate configuration"
                    data-testid="generate-button"
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
                  <OutlineIconButton
                    onClick={handleDownload}
                    aria-label="Download configuration"
                    data-testid="download-config-button"
                  >
                    <span className="material-symbols-outlined">download</span>
                  </OutlineIconButton>
                  <OutlineIconButton
                    onClick={handleShare}
                    aria-label="Share configuration"
                    data-testid="share-config-button"
                  >
                    <span className="material-symbols-outlined">share</span>
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
                    data-testid={`${preview.key}-file-preview`}
                    previewExtension={preview.extension}
                    previewKey={`${preview.key}-${configContext.resultsVersion}`}
                    previewContent={preview.content}
                  />
                </LeftSplitPane>
                <RightSplitPane>
                  <ScrollablePanelContainer>
                    <Downloads
                      setPreview={setPreviewKey}
                      previewKey={preview.key}
                      data-testid="downloads-container"
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
              <SettingsPaneContainer>
                <OptionContainer>
                  <Title>Options</Title>
                  <GenOption
                    optionId={'autogen'}
                    label={'Auto-generate'}
                    setSelected={configContext.setAutoGen}
                    checked={configContext.autoGen}
                    aria-label="Enable auto-generate"
                  />
                  <GenOption
                    optionId={'debug'}
                    label={'Debug'}
                    setSelected={configContext.setDebug}
                    checked={configContext.debug}
                    aria-label="Enable debug mode"
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
                    aria-label="Enable auto-generate PCB and 3D (slow)"
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
                    aria-label="Enable KiCad preview (experimental)"
                  />
                  <GenOption
                    optionId={'stlPreview'}
                    label={
                      <>
                        STL Preview <small>(experimental)</small>
                      </>
                    }
                    setSelected={configContext.setStlPreview}
                    checked={configContext.stlPreview}
                    aria-label="Enable STL preview (experimental)"
                  />
                </OptionContainer>
                <Injections
                  setInjectionToEdit={setInjectionToEdit}
                  deleteInjection={handleDeleteInjection}
                  injectionToEdit={injectionToEdit}
                  data-testid="injections-container"
                />
              </SettingsPaneContainer>
            </LeftSplitPane>
            <RightSplitPane>
              <EditorContainer>
                <Title as="h4">Footprint name</Title>
                <Input
                  value={injectionToEdit.name}
                  onChange={handleInjectionNameChange}
                  disabled={injectionToEdit.key === -1}
                  aria-label="Footprint name"
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
