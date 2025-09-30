import React, { ChangeEvent, useEffect, useState } from "react";
import styled from "styled-components";
import Split from "react-split";

import InjectionEditor from "../molecules/InjectionEditor";
import Injections from "../molecules/Injections";
import GenOption from "../atoms/GenOption";
import Input from "../atoms/Input";
import { Injection } from "../atoms/InjectionRow";
import { useConfigContext } from "../context/ConfigContext";

const OptionContainer = styled.div`
  display: inline-grid;
  justify-content: space-between;
`;

const EditorContainer = styled.div`
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  width: 100%;
  flex-grow: 1;
`;

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

const LeftSplitPane = styled.div`
    padding-right: 1rem;
    position: relative;
    @media (min-width: 640px) {
      min-width: 300px;
    }
`;

const RightSplitPane = styled.div`
    padding-left: 1rem;
    position: relative;
`;

const Settings = () => {
  const [injectionToEdit, setInjectionToEdit] = useState({ key: -1, type: "", name: "", content: "" });
  const configContext = useConfigContext();

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
      injections.push(editedInjection);
      setInjectionToEdit({ ...injectionToEdit, key: nextIndex });
    } else {
      const existingInjection = injections[injectionToEdit.key];
      if (
        existingInjection[0] === injectionToEdit.type
        && existingInjection[1] === injectionToEdit.name
        && existingInjection[2] === injectionToEdit.content
      ) {
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

  return (
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
  )
}

export default Settings;