import InjectionRow from '../atoms/InjectionRow';
import { Injection } from '../atoms/InjectionRow';
import styled from 'styled-components';
import { useConfigContext } from '../context/ConfigContext';
import { Dispatch, SetStateAction } from 'react';
import GrowButton from '../atoms/GrowButton';

/**
 * A styled container for the injections list.
 */
const InjectionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

/**
 * A styled `h3` component used for section titles.
 *
 * This component applies specific styling to an `<h3>` element, including
 * font size, a semi-bold weight, white text color, and a margin.
 */
const Title = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: white;
  margin: 1rem;
`;

/**
 * Props for the Injections component.
 * @typedef {object} Props
 * @property {Dispatch<SetStateAction<Injection>>} setInjectionToEdit - Function to set the injection to be edited.
 * @property {(injection: Injection) => void} deleteInjection - Function to delete an injection.
 */
type Props = {
  setInjectionToEdit: Dispatch<SetStateAction<Injection>>;
  deleteInjection: (injection: Injection) => void;
  injectionToEdit: Injection;
};

/**
 * An array of Injection objects.
 * @typedef {Injection[]} InjectionArr
 */
type InjectionArr = Array<Injection>;

/**
 * A component that displays and manages lists of custom footprints and templates.
 * It reads injection data from the ConfigContext and provides functionality to add new injections.
 *
 * @param {Props} props - The props for the component.
 * @returns {JSX.Element | null} The rendered component or null if context is not available.
 */
const Injections = ({
  setInjectionToEdit,
  deleteInjection,
  injectionToEdit,
}: Props) => {
  const footprints: InjectionArr = [];
  const templates: InjectionArr = [];
  const configContext = useConfigContext();
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
        const collection =
          injection[0] === 'footprint' ? footprints : templates;
        collection.push({
          key: i,
          type: injection[0],
          name: injection[1],
          content: injection[2],
        });
      }
    }
  }

  /**
   * Handles the creation of a new footprint.
   * It creates a new injection object with a default template and calls `setInjectionToEdit`
   * to open it in the editor.
   */
  const handleNewFootprint = () => {
    const nextKey = configContext?.injectionInput?.length || 0;
    const newInjection = {
      key: nextKey,
      type: 'footprint',
      name: `custom_footprint_${nextKey + 1}`,
      content:
        "module.exports = {\n  params: {\n    designator: '',\n  },\n  body: p => ``\n}",
    };
    setInjectionToEdit(newInjection);
  };

  return (
    <InjectionsContainer>
      <Title>Custom Footprints</Title>
      {footprints.map((footprint) => {
        return (
          <InjectionRow
            key={footprint.key}
            injection={footprint}
            setInjectionToEdit={setInjectionToEdit}
            deleteInjection={deleteInjection}
            previewKey={injectionToEdit.name}
          />
        );
      })}
      {/* <h3>Custom Templates</h3>
      {
        templates.map(
          (template, i) => {
            return <InjectionRow key={i} {...template} setInjection={setInjection} />;
          }
        )
      } */}
      <GrowButton onClick={handleNewFootprint} data-testid="add-footprint">
        <span className="material-symbols-outlined">add</span>
      </GrowButton>
    </InjectionsContainer>
  );
};

export default Injections;
