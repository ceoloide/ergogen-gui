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
import GenOption from "./atoms/GenOption";
import { fetchConfigFromUrl } from "./utils/github";
import { ConfigOption, exampleOptions } from "./examples";

const EditorContainer = styled.div`
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  width: 100%;
  flex-grow: 1;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const GrowButton = styled(Button)`
  flex-grow: 1;
`;

const ErgogenWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow: hidden;
  padding: 0 1em;
`;

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

const StyledFilePreview = styled(FilePreview)`
  height: 100%;
`;

const StyledConfigEditor = styled(ConfigEditor)`
  position: relative;
  flex-grow: 1;
`;

const OptionContainer = styled.div`
  display: inline-grid;
  justify-content: space-between;
`;

const StyledSelect = styled(CreatableSelect)`
    color: black;
    white-space: nowrap;
`;

// @ts-ignore
const StyledSplit = styled(Split)`
  width: 100%;
  height: 100%;
  display: flex;

  .gutter {
    background-color: #878787;
    border-radius: 0.15rem;

    background-repeat: no-repeat;
    background-position: 50%;

    &:hover {
      background-color: #a0a0a0;
    }

    &.gutter-horizontal {
      cursor: col-resize;
      background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAIklEQVQoU2M4c+bMfxAGAgYYmwGrIIiDjrELjpo5aiZeMwF+yNnOs5KSvgAAAABJRU5ErkJggg==');
    }
  }
`;

const LeftSplitPane = styled.div`
    padding-right: 1rem;
    position: relative;
`;

const RightSplitPane = styled.div`
    padding-left: 1rem;
    position: relative;
`;

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

const FlexContainer = styled.div`
  display: flex;
  flex-flow: wrap;
  flex-grow: 1;
`;

const Ergogen = () => {
  const [preview, setPreviewKey] = useState({ key: "demo.svg", extension: "svg", content: "" });
  const [injectionToEdit, setInjectionToEdit] = useState({ key: -1, type: "", name: "", content: "" });
  const [selectedOption, setSelectedOption] = useState<ConfigOption | null>(null);
  const configContext = useConfigContext();

  useEffect(() => {
    if (selectedOption?.value) {
      configContext?.setConfigInput(selectedOption.value)
    }
    // eslint-disable-next-line
  }, [selectedOption]);

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
    if (result === undefined && preview.key !== "demo.svg") {
      // If we don't find the preview we had, switch to demo.svg
      preview.key = "demo.svg"
      preview.extension = "svg"
      result = findResult(preview.key, configContext.results);
    }

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

  const handleInjectionNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newInjectionToEdit = {
      ...injectionToEdit,
      name: e.target.value
    };
    setInjectionToEdit(newInjectionToEdit);
  }

  const handleDeleteInjection = (injectionToDelete: Injection) => {
    if (!Array.isArray(configContext?.injectionInput)) return;
    const injections = [...configContext.injectionInput].filter((e, i) => { return i !== injectionToDelete.key })
    // @ts-ignore
    configContext.setInjectionInput(injections);
    if (injectionToEdit.key === injectionToDelete.key) {
      const emptyInjection = { key: -1, type: "", name: "", content: "" };
      setInjectionToEdit(emptyInjection);
    } else if (injectionToEdit.key >= injectionToDelete.key) {
      const reIndexedInjection = { ...injectionToEdit, key: injectionToEdit.key - 1 };
      setInjectionToEdit(reIndexedInjection);
    }
  }

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
    document.body.removeChild(element);
  }

  return (<ErgogenWrapper>
    {configContext.deprecationWarning && <Warning>{configContext.deprecationWarning}</Warning>}
    {configContext.error && <Error>{configContext.error?.toString()}</Error>}
    <FlexContainer>
      {!configContext.showSettings ?
        (<StyledSplit
          direction={"horizontal"}
          sizes={[30, 70]}
          minSize={100}
          gutterSize={10}
          snapOffset={0}
        >
          <LeftSplitPane>
            <EditorContainer>
              <StyledSelect
                isClearable
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
              />
              <StyledConfigEditor />
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
              gutterSize={10}
              snapOffset={0}
            >
              <LeftSplitPane>
                <StyledFilePreview previewExtension={preview.extension} previewKey={`${preview.key}-${configContext.resultsVersion}`} previewContent={preview.content} jscadPreview={configContext.jscadPreview} />
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