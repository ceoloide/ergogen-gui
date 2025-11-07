import { useEffect, useState, ChangeEvent, SetStateAction, Dispatch } from 'react';
import styled from 'styled-components';
import yaml from 'js-yaml';
import { useHotkeys } from 'react-hotkeys-hook';

import ConfigEditor from './molecules/ConfigEditor';
import InjectionEditor from './molecules/InjectionEditor';
import Downloads from './molecules/Downloads';
import Injections from './molecules/Injections';
import FilePreview from './molecules/FilePreview';
import ShareDialog from './molecules/ShareDialog';
import ResizablePanel from './molecules/ResizablePanel';
import { Preview } from './atoms/DownloadRow';

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
import { trackEvent } from './utils/analytics';

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
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
`;

const SettingsPaneContainer = styled.div`
  height: 100%;
  overflow-y: auto;
  padding: 0.5rem;

  @media (min-width: 640px) {
    padding: 1rem;
  }
`;

const MobileEditorHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (min-width: 640px) {
    display: none;
  }
`;

const MobileCloseButton = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.textDark};
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition:
    background-color 0.15s ease-in-out,
    color 0.15s ease-in-out;

  .material-symbols-outlined {
    font-size: ${theme.fontSizes.iconLarge};
  }

  &:hover {
    background-color: ${theme.colors.buttonHover};
    color: ${theme.colors.text};
  }

  @media (min-width: 640px) {
    display: none;
  }
`;

/**
 * A container for the right pane that takes remaining space.
 */
const RightPane = styled.div<{ $fullWidth?: boolean }>`
  position: relative;
  flex: 1;
  min-width: 0;
  height: 100%;
  display: flex;
  flex-direction: row;

  @media (max-width: 639px) {
    width: ${(props) => (props.$fullWidth ? '100%' : 'auto')};
  }
`;

/**
 * A container for nested right pane content.
 */
const NestedRightPane = styled.div`
  position: relative;
  flex: 1;
  min-width: 0;
  height: 100%;
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
  // Calculate initial widths based on viewport
  const getInitialLeftWidth = () => Math.max(200, window.innerWidth * 0.33);
  const getInitialRightWidth = () => Math.max(150, window.innerWidth * 0.15);
  const getInitialSettingsWidth = () => Math.max(350, window.innerWidth * 0.15);

  /**
   * State for the currently displayed file preview.
   * @type {Preview}
   */
  const [preview, setPreviewKey] = useState<Preview>({
    key: 'demo.svg',
    extension: 'svg',
    content: '',
  });

  /**
   * Wrapper function to set preview and hide downloads panel.
   * Only hides downloads panel on mobile (when showConfig is false).
   */
  const handleSetPreview: Dispatch<SetStateAction<Preview>> = (newPreview) => {
    setPreviewKey(newPreview);
    if (!configContext?.showConfig) {
      configContext?.setShowDownloads(false);
    }
  };

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
   * State to track if we're showing the injection editor on mobile.
   * Only used when showConfig is false (mobile view).
   */
  const [showMobileEditor, setShowMobileEditor] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 639);

  /**
   * State for the selected example from the dropdown menu.
   * @type {ConfigOption | null}
   */
  const configContext = useConfigContext();

  // Track screen size changes
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 639);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Show mobile editor when injectionToEdit changes and we're on mobile
  useEffect(() => {
    if (isMobile && !configContext?.showConfig && injectionToEdit.key !== -1) {
      setShowMobileEditor(true);
    } else if (!isMobile) {
      // Reset mobile editor state when not on mobile
      setShowMobileEditor(false);
    }
  }, [injectionToEdit.key, configContext?.showConfig, isMobile]);

  /**
   * State for showing the share notification toast.
   * We track both visibility and whether the component should be mounted.
   */
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [shareLink, setShareLink] = useState('');

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

  // Track preview changes
  useEffect(() => {
    if (configContext?.results && preview.key && preview.extension) {
      trackEvent('preview_loaded', {
        preview_type: preview.extension,
        preview_key: preview.key,
      });
    }
  }, [preview.key, preview.extension, configContext?.results]);

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
    trackEvent('download_button_clicked', {
      download_type: 'yaml',
      file_name: 'config.yaml',
    });
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
    trackEvent('download_button_clicked', {
      download_type: 'archive',
    });
    createZip(
      configContext.results,
      configContext.configInput,
      configContext.injectionInput,
      configContext.debug,
      configContext.stlPreview
    );
  };

  /**
   * Creates a shareable URI with the current configuration and shows a dialog.
   * Includes all current injections (footprints, templates, etc.) in the shared URI.
   */
  const handleShare = () => {
    if (!configContext.configInput) {
      return;
    }

    // Include all injections if present
    const injectionsToShare =
      configContext.injectionInput && configContext.injectionInput.length > 0
        ? configContext.injectionInput
        : undefined;

    const shareableUri = createShareableUri(
      configContext.configInput,
      injectionsToShare
    );

    trackEvent('share_button_clicked', {
      has_injections: !!injectionsToShare,
      injections_count: injectionsToShare?.length || 0,
    });

    setShareLink(shareableUri);
    setShowShareDialog(true);
  };

  return (
    <ErgogenWrapper>
      {showShareDialog && (
        <ShareDialog
          shareLink={shareLink}
          onClose={() => setShowShareDialog(false)}
          data-testid="share-dialog"
        />
      )}
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
          <>
            {configContext.showConfig && (
              <ResizablePanel
                initialWidth={getInitialLeftWidth()}
                minWidth={250}
                maxWidth="60%"
                side="left"
                data-testid="config-panel"
              >
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
              </ResizablePanel>
            )}
            <RightPane>
              {configContext.showDownloads ? (
                <>
                  <NestedRightPane>
                    <StyledFilePreview
                      data-testid={`${preview.key}-file-preview`}
                      previewExtension={preview.extension}
                      previewKey={`${preview.key}-${configContext.resultsVersion}`}
                      previewContent={preview.content}
                    />
                  </NestedRightPane>
                  <ResizablePanel
                    initialWidth={getInitialRightWidth()}
                    minWidth={105}
                    maxWidth="30%"
                    side="right"
                    data-testid="downloads-panel"
                  >
                    <ScrollablePanelContainer>
                      <Downloads
                        setPreview={handleSetPreview}
                        previewKey={preview.key}
                        data-testid="downloads-container"
                      />
                    </ScrollablePanelContainer>
                  </ResizablePanel>
                </>
              ) : (
                <NestedRightPane>
                  <StyledFilePreview
                    data-testid={`${preview.key}-file-preview`}
                    previewExtension={preview.extension}
                    previewKey={`${preview.key}-${configContext.resultsVersion}`}
                    previewContent={preview.content}
                  />
                </NestedRightPane>
              )}
            </RightPane>
          </>
        ) : (
          <>
            <ResizablePanel
              initialWidth={getInitialSettingsWidth()}
              minWidth={150}
              maxWidth="70%"
              side="left"
              data-testid="settings-panel"
              style={{
                display: showMobileEditor && isMobile ? 'none' : undefined,
              }}
            >
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
                  onInjectionSelect={() => setShowMobileEditor(true)}
                  data-testid="injections-container"
                />
              </SettingsPaneContainer>
            </ResizablePanel>
            <RightPane $fullWidth={showMobileEditor && isMobile}>
              <EditorContainer>
                {isMobile && (
                  <MobileEditorHeader>
                    <Title as="h4">Footprint name</Title>
                    <MobileCloseButton
                      onClick={() => {
                        setShowMobileEditor(false);
                        setInjectionToEdit({ key: -1, type: '', name: '', content: '' });
                      }}
                      aria-label="Close editor"
                      data-testid="mobile-editor-close"
                    >
                      <span className="material-symbols-outlined">close</span>
                    </MobileCloseButton>
                  </MobileEditorHeader>
                )}
                {(isMobile) ? null : (
                  <Title as="h4">Footprint name</Title>
                )}
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
            </RightPane>
          </>
        )}
      </FlexContainer>
    </ErgogenWrapper>
  );
};

export default Ergogen;
