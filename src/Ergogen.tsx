import { useEffect, useState, ChangeEvent } from "react";
import styled from "styled-components";
import Split from "react-split";
import yaml from 'js-yaml';

import ConfigEditor from "./molecules/ConfigEditor";
import Downloads from "./molecules/Downloads";
import FilePreview from "./molecules/FilePreview";

import { useConfigContext } from "./context/ConfigContext";
import Button from "./atoms/Button";
import DownloadButton from "./atoms/DownloadButton";
import DownloadIcon from "./atoms/DownloadIcon";
import Settings from "./organisms/Settings";

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
      gap: 16px;
      padding: 0 1rem;
      flex-shrink: 0;

      @media (max-width: 639px) {
          display: flex;
      }
`;

/**
 * A styled button with an outline, used for secondary actions.
 */
const OutlineIconButton = styled.button`
    background-color: transparent;
    transition: color .15s ease-in-out,
    background-color .15s ease-in-out,
    border-color .15s ease-in-out,
    box-shadow .15s ease-in-out;
    border: 1px solid #3f3f3f;
    border-radius: 6px;
    color: white;
    display: flex;
    align-items: center;
    padding: 8px 12px;
    text-decoration: none;
    cursor: pointer;
    font-size: 13px;
    line-height: 16px;
    gap: 6px
    height: 34px;
    font-family: 'Roboto', sans-serif;

    .material-symbols-outlined {
        font-size: 16px !important;
    }

    &:hover,
    &.active {
        background-color: #3f3f3f;
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
  gap: 0.5rem;
  align-items: stretch;

  @media (max-width: 639px) {
      display: none;
  }
`;

/**
 * A container for elements that should only be visible on desktop-sized screens.
 */
const DesktopOnlyContainer = styled.div`
  @media (max-width: 639px) {
      display: none;
  }
`;

/**
 * A button that expands to fill the available horizontal space.
 */
const GrowButton = styled(Button)`
  flex-grow: 1;
`;

/**
 * The main wrapper for the entire Ergogen application UI.
 */
const ErgogenWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow: hidden;
  padding: 1em;
  
  @media (max-width: 639px) {
    padding: 0 0 1em 0;
  }
`;

/**
 * A styled component for displaying error messages.
 */
const Error = styled.div`
  background: #ff6d6d;
  color: #a31111;
  border: 1px solid #a31111;
  padding: 1em;
  margin: 0.5em 0 0.5em 0;
  width: 100%;
  min-height: 4em;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

/**
 * A styled component for displaying warning messages.
 */
const Warning = styled.div`
  background: #ffc107;
  color: #000000;
  border: 1px solid #e0a800;
  padding: 1em;
  margin: 0.5em 0 0.5em 0;
  width: 100%;
  min-height: 4em;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

/**
 * A styled version of the FilePreview component.
 */
const StyledFilePreview = styled(FilePreview)`
  height: 100%;

  @media (max-width: 639px) {
      padding-top: 16px;
  }
`;

/**
 * A styled version of the ConfigEditor component.
 */
const StyledConfigEditor = styled(ConfigEditor)`
  position: relative;
  flex-grow: 1;
`;

/**
 * A styled version of the `react-split` component, providing resizable panes.
 */
// @ts-ignore
const StyledSplit = styled(Split)`
  width: 100%;
  height: 100%;
  display: flex;

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
    padding-right: 1rem;
    position: relative; 
    @media (min-width: 640px) {
      min-width: 300px;
    }
`;

/**
 * A container for the right pane in a split layout.
 */
const RightSplitPane = styled.div`
    padding-left: 1rem;
    position: relative;
`;

/**
 * Recursively finds a nested property within an object using a dot-separated string.
 * @param {string} resultToFind - The dot-separated path to the desired property (e.g., "outlines.top.svg").
 * @param {any} resultsToSearch - The object to search within.
 * @returns {any | undefined} The found property value, or undefined if not found.
 */
const findResult = (resultToFind: string, resultsToSearch: any): (any | undefined) => {
  if (resultsToSearch === null) return null;
  if (resultToFind === '') return resultsToSearch;
  let properties = resultToFind.split('.');
  let currentProperty = properties[0] as keyof typeof resultsToSearch;
  let remainingProperties = properties.slice(1).join('.');
  return (resultsToSearch.hasOwnProperty(currentProperty)
    ? findResult(
      remainingProperties,
      resultsToSearch[currentProperty]
    )
    : undefined);
};

/**
 * A flex container that allows its children to wrap and grow.
 */
const FlexContainer = styled.div`
  display: flex;
  flex-flow: wrap;
  flex-grow: 1;
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
  const [preview, setPreviewKey] = useState({ key: "demo.svg", extension: "svg", content: "" });

  /**
   * State for the selected example from the dropdown menu.
   * @type {ConfigOption | null}
   */
  const configContext = useConfigContext();

  if (!configContext) return null;
  let result = null;
  if (configContext.results) {
    result = findResult(preview.key, configContext.results);
    // Fallback to the default demo SVG if the current preview key is not found.
    if (result === undefined && preview.key !== "demo.svg") {
      preview.key = "demo.svg"
      preview.extension = "svg"
      result = findResult(preview.key, configContext.results);
    }

    // Process the result based on the file extension to format it for the preview component.
    switch (preview.extension) {
      case 'svg':
      case 'kicad_pcb':
        preview.content = (typeof result === "string" ? result : "");
        break;
      case 'jscad':
        preview.content = (typeof result?.jscad === "string" ? result.jscad : "");
        break;
      case 'yaml':
        preview.content = yaml.dump(result);
        break;
      case 'txt':
        preview.content = configContext.configInput || '';
        break;
      default:
        preview.content = ""
    };
  }

  /**
   * Triggers a browser download of the current configuration as a 'config.yaml' file.
   */
  const handleDownload = () => {
    if (configContext.configInput === undefined) {
      return;
    }
    const element = document.createElement("a");
    const file = new Blob([configContext.configInput], {type: 'text/yaml'});
    element.href = URL.createObjectURL(file);
    element.download = "config.yaml";
    document.body.appendChild(element);
    element.click();
    URL.revokeObjectURL(element.href);
    document.body.removeChild(element);
  }

  return (<ErgogenWrapper>
    {configContext.deprecationWarning && <Warning>{configContext.deprecationWarning}</Warning>}
    {configContext.error && <Error>{configContext.error?.toString()}</Error>}
    {!configContext.showSettings && <SubHeaderContainer>
              <OutlineIconButton className={configContext.showConfig ? 'active' : ''} onClick={() => configContext.setShowConfig(true)}>Config</OutlineIconButton>
              <OutlineIconButton className={!config.showConfig ? 'active' : ''} onClick={() => configContext.setShowConfig(false)}>Outputs</OutlineIconButton>
            </SubHeaderContainer>}
    <FlexContainer>
      {!configContext.showSettings ?
        (<StyledSplit
          direction={"horizontal"}
          sizes={[30, 70]}
          minSize={100}
          gutterSize={5}
          snapOffset={0}
          className={configContext.showConfig ? 'show-config' : 'show-outputs'}
        >
          <LeftSplitPane>
            <EditorContainer>
              <StyledConfigEditor data-testid="config-editor" />
              <ButtonContainer>
                <GrowButton onClick={() => configContext.processInput(configContext.configInput, configContext.injectionInput, { pointsonly: false })}>Generate</GrowButton>
                <DownloadButton onClick={handleDownload}>
                  <DownloadIcon />
                </DownloadButton>
              </ButtonContainer>
            </EditorContainer>
          </LeftSplitPane>

          <RightSplitPane>
            <StyledSplit
              direction={"horizontal"}
              sizes={[70, 30]}
              minSize={100}
              gutterSize={5}
              snapOffset={0}
            >
              <LeftSplitPane>
                <StyledFilePreview data-testid="file-preview" previewExtension={preview.extension} previewKey={`${preview.key}-${configContext.resultsVersion}`} previewContent={preview.content} jscadPreview={configContext.jscadPreview} />
              </LeftSplitPane>
              <RightSplitPane>
                <Downloads setPreview={setPreviewKey} previewKey={preview.key} />
              </RightSplitPane>
            </StyledSplit>
          </RightSplitPane>
        </StyledSplit>) : (
          <Settings />
        )}
    </FlexContainer></ErgogenWrapper>
  );
}

export default Ergogen;