/**
 * Props for the PcbPreview component.
 * @typedef {object} Props
 * @property {string} pcb - The KiCad PCB file content as a string.
 * @property {string} key - A unique key for the component, important for React's rendering logic.
 * @property {string} [aria-label] - An optional aria-label for the preview container.
 * @property {string} [data-testid] - An optional data-testid for testing purposes.
 */
type Props = {
  pcb: string;
  previewKey: string;
  'aria-label'?: string;
  'data-testid'?: string;
};

/**
 * A React component that embeds a KiCad PCB preview using the `<kicanvas-embed>` custom element.
 * This component takes the PCB data as a string and renders it within an interactive canvas.
 *
 * @param {Props} props - The props for the component.
 * @returns {JSX.Element} A `<kicanvas-embed>` element containing the PCB source.
 */
const PcbPreview = ({
  pcb,
  previewKey,
  'aria-label': ariaLabel,
  'data-testid': dataTestId,
}: Props): JSX.Element => (
  <kicanvas-embed
    key={previewKey}
    controls="full"
    controlslist="nodownload nooverlay"
    theme="kicad"
    aria-label={ariaLabel}
    data-testid={dataTestId}
  >
    <kicanvas-source type="board">{pcb}</kicanvas-source>
  </kicanvas-embed>
);

export default PcbPreview;
