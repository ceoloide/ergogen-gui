import { useEffect, useState, ChangeEvent } from "react";
import styled from "styled-components";
import Split from "react-split";
import yaml from 'js-yaml';

import ConfigEditor from "./molecules/ConfigEditor";
import InjectionEditor from "./molecules/InjectionEditor";
import Downloads from "./molecules/Dowloads";
import Injections from "./molecules/Injections";
import FilePreview from "./molecules/FilePreview";

import { useConfigContext } from "./context/ConfigContext";
import Button from "./atoms/Button";
import DownloadButton from "./atoms/DownloadButton";
import DownloadIcon from "./atoms/DownloadIcon";
import Input from "./atoms/Input";
import { Injection } from "./atoms/InjectionRow";
import CreatableSelect from "react-select/creatable";
import { StylesConfig } from 'react-select';
import GenOption from "./atoms/GenOption";
import { fetchConfigFromUrl } from "./utils/github";
import { ConfigOption, exampleOptions } from "./examples";

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
 * A container for settings and options.
 */
const OptionContainer = styled.div`
  display: inline-grid;
  justify-content: space-between;
`;

/**
 * A styled CreatableSelect component from `react-select`.
 */
const StyledSelect = styled(CreatableSelect)`
    color: black;
    white-space: nowrap;
    width: 100%;
    
  @media (min-width: 640px) {
    padding: 0 0 10px 0;
  }
`;

/**
 * Custom styles object for the `react-select` component to match the application's theme.
 */
const customSelectStyles: StylesConfig = {
  // Styles for the main input control
  control: (provided, state) => ({
    ...provided,
    border: '1px solid #3f3f3f',
    color: 'white',
    borderRadius: '6px',
    minHeight: '34px',
    height: '34px',
    fontSize: '13px',
    lineHeight: '16px',
    backgroundColor: 'transparent',
    fontFamily: '\'Roboto\', sans-serif',
    '&:hover': {
      backgroundColor: '3f3f3f',
    },
  }),

  // Styles for the container that holds the value or placeholder
  valueContainer: (provided) => ({
    ...provided,
    height: '34px',
    padding: '0px 12px',
  }),

  // Styles for the text of the selected value
  singleValue: (provided) => ({
    ...provided,
    color: 'white',
    whiteSpace: 'nowrap',
  }),

  indicatorSeparator: () => ({
    display: 'none', // Hides the vertical line separator
  }),
  indicatorsContainer: (provided) => ({
    ...provided,
    height: '34px',
  }),
};

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
   * State for the custom injection currently being edited in the settings panel.
   * @type {Injection}
   */
  const [injectionToEdit, setInjectionToEdit] = useState({ key: -1, type: "", name: "", content: "" });

  /**
   * State for the selected example from the dropdown menu.
   * @type {ConfigOption | null}
   */
  const [selectedOption, setSelectedOption] = useState<ConfigOption | null>(null);

  const configContext = useConfigContext();

  /**
   * Effect to update the config input when a new example is selected from the dropdown.
   */
  useEffect(() => {
    if (selectedOption?.value) {
      configContext?.setConfigInput(selectedOption.value)
    }
    // eslint-disable-next-line
  }, [selectedOption]);

  /**
   * Effect to handle changes to the injection being edited.
   * It updates the main injection list in the context when an injection is created or modified.
   */
  useEffect(() => {
    if (injectionToEdit.key === -1) return;
    if (injectionToEdit.name === "") return;
    if (injectionToEdit.content === "") return;
    const editedInjection = [injectionToEdit.type, injectionToEdit.name, injectionToEdit.content];
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
        existingInjection[0] === injectionToEdit.type
        && existingInjection[1] === injectionToEdit.name
        && existingInjection[2] === injectionToEdit.content
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
      })
    }
    configContext?.setInjectionInput(injections);
  }, [configContext, injectionToEdit]);

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
      default:
        preview.content = ""
    };
  }

  /**
   * Handles changes to the name input field for the injection being edited.
   * @param {ChangeEvent<HTMLInputElement>} e - The input change event.
   */
  const handleInjectionNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newInjectionToEdit = {
      ...injectionToEdit,
      name: e.target.value
    };
    setInjectionToEdit(newInjectionToEdit);
  }

  /**
   * Handles the deletion of a custom injection from the list.
   * @param {Injection} injectionToDelete - The injection object to be deleted.
   */
  const handleDeleteInjection = (injectionToDelete: Injection) => {
    if (!Array.isArray(configContext?.injectionInput)) return;
    const injections = [...configContext.injectionInput].filter((e, i) => { return i !== injectionToDelete.key })
    // @ts-ignore
    configContext.setInjectionInput(injections);
    // Reset or re-index the currently edited injection if it was affected by the deletion.
    if (injectionToEdit.key === injectionToDelete.key) {
      const emptyInjection = { key: -1, type: "", name: "", content: "" };
      setInjectionToEdit(emptyInjection);
    } else if (injectionToEdit.key >= injectionToDelete.key) {
      const reIndexedInjection = { ...injectionToEdit, key: injectionToEdit.key - 1 };
      setInjectionToEdit(reIndexedInjection);
    }
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
              <OutlineIconButton className={!configContext.showConfig ? 'active' : ''} onClick={() => configContext.setShowConfig(false)}>Outputs</OutlineIconButton>
              <StyledSelect
                styles={customSelectStyles}
                isClearable={false}
                options={exampleOptions}
                value={selectedOption}
                onChange={(newValue:any) => {
                  if (newValue.__isNew__) {
                    fetchConfigFromUrl(newValue.value)
                      .then(configContext.setConfigInput)
                      .catch((e) => {
                        configContext.setError(`Failed to fetch config from GitHub: ${e.message}`);
                      });
                  } else {
                    setSelectedOption(newValue)
                  }
                }}
                placeholder={"Paste a GitHub URL here, or select an example"}
              /></SubHeaderContainer>}
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
              <DesktopOnlyContainer><StyledSelect
                isClearable={false}
                styles={customSelectStyles}
                options={exampleOptions}
                value={selectedOption}
                onChange={(newValue:any) => {
                  if (newValue.__isNew__) {
                    fetchConfigFromUrl(newValue.value)
                      .then(configContext.setConfigInput)
                      .catch((e) => {
                        configContext.setError(`Failed to fetch config from GitHub: ${e.message}`);
                      });
                  } else {
                    setSelectedOption(newValue)
                  }
                }}
                placeholder={"Paste a GitHub URL here, or select an example"}
              /></DesktopOnlyContainer>
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
                <Downloads setPreview={setPreviewKey} />
              </RightSplitPane>
            </StyledSplit>
          </RightSplitPane>
        </StyledSplit>) : (
          <StyledSplit
            direction={"horizontal"}
            sizes={[40, 60]}
            minSize={100}
            gutterSize={10}
            snapOffset={0}
          >
            <LeftSplitPane>
              <OptionContainer>
                <h3>Options</h3>
                <GenOption optionId={'autogen'} label={'Auto-generate'} setSelected={configContext.setAutoGen} checked={configContext.autoGen} />
                <GenOption optionId={'debug'} label={'Debug'} setSelected={configContext.setDebug} checked={configContext.debug} />
                <GenOption optionId={'autogen3d'} label={<>Auto-gen PCB, 3D <small>(slow)</small></>} setSelected={configContext.setAutoGen3D} checked={configContext.autoGen3D} />
                <GenOption optionId={'kicanvasPreview'} label={<>KiCad Preview <small>(experimental)</small></>} setSelected={configContext.setKicanvasPreview} checked={configContext.kicanvasPreview} />
                <GenOption optionId={'jscadPreview'} label={<>JSCAD Preview <small>(experimental)</small></>} setSelected={configContext.setJscadPreview} checked={configContext.jscadPreview} />
              </OptionContainer>
              <Injections setInjectionToEdit={setInjectionToEdit} deleteInjection={handleDeleteInjection} />
            </LeftSplitPane>
            <RightSplitPane>
              <EditorContainer>
                <h4>Footprint name</h4>
                <Input value={injectionToEdit.name} onChange={handleInjectionNameChange} disabled={injectionToEdit.key === -1} />
                <h4>Footprint code</h4>
                <InjectionEditor injection={injectionToEdit} setInjection={setInjectionToEdit} options={{ readOnly: injectionToEdit.key === -1 }} />
              </EditorContainer>
            </RightSplitPane>
          </StyledSplit>
        )}
    </FlexContainer></ErgogenWrapper>
  );
}

export default Ergogen;