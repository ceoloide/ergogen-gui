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
import { OutlineButton, GenerateButton } from './atoms/Buttons';

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

function getShortcutLabel() {
  return (
    <>
      <span>{isMacOS() ? '⌘' : 'Ctrl'}&nbsp;⏎</span>
    </>
  );
}

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

const Spacer = styled.div`
  flex-grow: 1;
`;

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
  gap: 10px;
  align-items: stretch;
  padding: 10px;

  @media (max-width: 639px) {
    display: none;
  }
`;

const GrowButton = styled(GenerateButton)`
  flex-grow: 1;
`;

const ErgogenWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  height: 100%;
  overflow: hidden;
  padding: 0;
`;

const StyledFilePreview = styled(FilePreview)`
  height: 100%;
`;

const ScrollablePanelContainer = styled.div`
  height: 100%;
  overflow-y: auto;
`;

const StyledConfigEditor = styled(ConfigEditor)`
  position: relative;
  flex-grow: 1;
`;

const OptionContainer = styled.div`
  display: inline-grid;
  justify-content: space-between;
`;

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

const LeftSplitPane = styled.div`
  position: relative;
  @media (min-width: 640px) {
    min-width: 300px;
  }
`;

const RightSplitPane = styled.div`
  position: relative;
`;

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

const FlexContainer = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
`;

const Ergogen = () => {
  const [preview, setPreviewKey] = useState({
    key: 'demo.svg',
    extension: 'svg',
    content: '',
  });

  const [injectionToEdit, setInjectionToEdit] = useState({
    key: -1,
    type: '',
    name: '',
    content: '',
  });

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
      injections.push(editedInjection);
      setInjectionToEdit({ ...injectionToEdit, key: nextIndex });
    } else {
      const existingInjection = injections[injectionToEdit.key];
      if (
        existingInjection[0] === injectionToEdit.type &&
        existingInjection[1] === injectionToEdit.name &&
        existingInjection[2] === injectionToEdit.content
      ) {
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
    if (result === undefined && preview.key !== 'demo.svg') {
      preview.key = 'demo.svg';
      preview.extension = 'svg';
      result = findResult(preview.key, configContext.results);
    }

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

  const handleInjectionNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newInjectionToEdit = {
      ...injectionToEdit,
      name: e.target.value,
    };
    setInjectionToEdit(newInjectionToEdit);
  };

  const handleDeleteInjection = (injectionToDelete: Injection) => {
    if (!Array.isArray(configContext?.injectionInput)) return;
    const injections = [...configContext.injectionInput].filter((e, i) => {
      return i !== injectionToDelete.key;
    });
    configContext.setInjectionInput(injections);
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
          <OutlineButton
            className={configContext.showConfig ? 'active' : ''}
            onClick={() => configContext.setShowConfig(true)}
          >
            Config
          </OutlineButton>
          <OutlineButton
            className={!configContext.showConfig ? 'active' : ''}
            onClick={() => configContext.setShowConfig(false)}
          >
            Outputs
          </OutlineButton>
          <Spacer />
          {configContext.showConfig && (
            <>
              <GenerateButton
                onClick={() =>
                  configContext.generateNow(
                    configContext.configInput,
                    configContext.injectionInput,
                    { pointsonly: false }
                  )
                }
              >
                <span className="material-symbols-outlined">refresh</span>
              </GenerateButton>
              <OutlineButton onClick={handleDownload}>
                <span className="material-symbols-outlined">download</span>
              </OutlineButton>
            </>
          )}
          {!configContext.showConfig && (
            <OutlineButton
              onClick={() =>
                configContext.setShowDownloads(!configContext.showDownloads)
              }
            >
              <span className="material-symbols-outlined">
                {configContext.showDownloads
                  ? 'expand_content'
                  : 'collapse_content'}
              </span>
            </OutlineButton>
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
                  <OutlineButton onClick={handleDownload}>
                    <span className="material-symbols-outlined">download</span>
                  </OutlineButton>
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
                <h3>Options</h3>
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
              />
            </LeftSplitPane>
            <RightSplitPane>
              <EditorContainer>
                <h4>Footprint name</h4>
                <Input
                  value={injectionToEdit.name}
                  onChange={handleInjectionNameChange}
                  disabled={injectionToEdit.key === -1}
                />
                <h4>Footprint code</h4>
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
