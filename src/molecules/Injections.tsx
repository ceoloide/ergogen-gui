import InjectionRow from "../atoms/InjectionRow";
import Button from "../atoms/Button";
import { Injection } from "../atoms/InjectionRow";
import styled from "styled-components";
import { useConfigContext } from "../context/ConfigContext";
import { Dispatch, SetStateAction } from "react";

const InjectionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const StyledButton = styled(Button)`
margin-right: 0.5em;
margin-left: 1em;
display: block;
`;

type Props = {
  setInjectionToEdit: Dispatch<SetStateAction<Injection>>,
  deleteInjection: (injection: Injection) => void
};

type InjectionArr = Array<Injection>;

const Injections = ({ setInjectionToEdit, deleteInjection }: Props) => {
  let footprints: InjectionArr = [];
  let templates: InjectionArr = [];
  const configContext = useConfigContext();
  // const tabContext = useContext(TabContext);
  if (!configContext) return null;

  const { injectionInput } = configContext;
  if (injectionInput && Array.isArray(injectionInput) && injectionInput.length > 0) {
    for (let i = 0; i < injectionInput.length; i++) {
      const injection = injectionInput[i];
      if (injection.length === 3) {
        let collection = (injection[0] === "footprint" ? footprints : templates);
        collection.push(
          {
            key: i,
            type: injection[0],
            name: injection[1],
            content: injection[2],
          }
        )
      }
    }
  }

  const handleNewFootprint = () => {
    const nextKey = configContext?.injectionInput?.length || 0;
    const newInjection = {
      key: nextKey,
      type: "footprint",
      name: `custom_footprint_${nextKey + 1}`,
      content: "module.exports = {\n  params: {\n    designator: '',\n  },\n  body: p => ``\n}"
    }
    setInjectionToEdit(newInjection);
  }

  return (
    <InjectionsContainer>
      <h3>Custom Footprints</h3>
      {
        footprints.map(
          (footprint, i) => {
            return <InjectionRow injection={footprint} setInjectionToEdit={setInjectionToEdit} deleteInjection={deleteInjection} />;
          }
        )
      }
      {/* <h3>Custom Templates</h3>
      {
        templates.map(
          (template, i) => {
            return <InjectionRow key={i} {...template} setInjection={setInjection} />;
          }
        )
      } */}
      <StyledButton size={"small"}
        onClick={handleNewFootprint}
      >{/* @ts-ignore */}
        <span class="material-symbols-outlined">add</span>
      </StyledButton>
    </InjectionsContainer>
  );
};

export default Injections;