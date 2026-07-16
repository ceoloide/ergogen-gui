import { lazy, Suspense, useEffect } from 'react';
import styled from 'styled-components';
const PcbPreview = lazy(() => import('../atoms/PcbPreview'));
const StlPreview = lazy(() => import('../atoms/StlPreview'));
import SvgPreview from '../atoms/SvgPreview';
import TextPreview from '../atoms/TextPreview';
import PreviewLoader from '../atoms/PreviewLoader';
import { theme } from '../theme/theme';

const PlaceholderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  background-color: ${theme.colors.background};
`;

const PlaceholderLogo = styled.img`
  width: 96px;
  height: 96px;
  opacity: 0.12;
  filter: grayscale(100%);
  -webkit-user-drag: none;
  user-drag: none;
`;

/**
 * Props for the FilePreview component.
 * @typedef {object} Props
 * @property {string} previewExtension - The extension of the file to preview (e.g. 'yaml', 'stl', 'kicad_pcb').
 * @property {string | ArrayBuffer | Uint8Array} previewContent - The content of the file to preview.
 * @property {string} previewKey - A unique key identifying the file preview target.
 * @property {string | number} [width] - Optional custom width (default '100%').
 * @property {string | number} [height] - Optional custom height (default '100%').
 * @property {string} [className] - Optional custom class.
 * @property {string} [data-testid] - Optional custom test id.
 * @property {string} [aria-label] - Optional custom aria-label.
 */
type Props = {
  previewExtension: string;
  previewContent: string | ArrayBuffer | Uint8Array;
  previewKey: string;
  width?: string | number;
  height?: string | number;
  className?: string;
  'data-testid'?: string;
  'aria-label'?: string;
};

/**
 * A component that dynamically renders a preview for different file types.
 * It selects the appropriate preview component based on the file extension.
 *
 * @param {Props} props - The props for the component.
 * @returns {JSX.Element} A container with the rendered file preview.
 */
const FilePreview = ({
  previewExtension,
  previewContent,
  previewKey,
  width = '100%',
  height = '100%',
  className,
  'data-testid': dataTestId,
  'aria-label': ariaLabel,
}: Props) => {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      window.requestIdleCallback(() => {
        void import('../atoms/StlPreview');
        void import('../atoms/PcbPreview');
      });
    } else {
      const id = setTimeout(() => {
        void import('../atoms/StlPreview');
        void import('../atoms/PcbPreview');
      }, 2000);
      return () => clearTimeout(id);
    }
  }, []);
  const isEmpty =
    !previewContent ||
    (typeof previewContent === 'string' && previewContent === '') ||
    (previewContent instanceof ArrayBuffer &&
      previewContent.byteLength === 0) ||
    (ArrayBuffer.isView(previewContent) && previewContent.byteLength === 0);

  if (isEmpty) {
    return (
      <PlaceholderContainer
        className={className}
        data-testid={dataTestId}
        aria-label={ariaLabel}
      >
        <PlaceholderLogo
          src={`${import.meta.env.BASE_URL}ergogen.png`}
          alt="Ergogen Logo"
          draggable="false"
        />
      </PlaceholderContainer>
    );
  }
  /**
   * Renders the correct preview component based on the file extension.
   * @param {string} extension - The file extension.
   * @returns {JSX.Element | string} The appropriate preview component or a "no preview" message.
   */
  const renderFilePreview = (extension: string) => {
    switch (extension) {
      case 'svg':
        return (
          <SvgPreview
            svg={previewContent as string}
            width={width}
            height={height}
            aria-label={ariaLabel || `SVG preview for ${previewKey}`}
            data-testid={dataTestId && `${dataTestId}-svg`}
          />
        );
      case 'yaml':
        return (
          <TextPreview
            language="yaml"
            content={previewContent as string}
            aria-label={ariaLabel || `YAML preview for ${previewKey}`}
            data-testid={dataTestId && `${dataTestId}-yaml`}
          />
        );
      case 'txt':
        return (
          <TextPreview
            language="text"
            content={previewContent as string}
            aria-label={ariaLabel || `Text preview for ${previewKey}`}
            data-testid={dataTestId && `${dataTestId}-txt`}
          />
        );
      case 'jscad':
        return (
          <TextPreview
            language="javascript"
            content={previewContent as string}
            aria-label={ariaLabel || `JSCAD code preview for ${previewKey}`}
            data-testid={dataTestId && `${dataTestId}-jscad-text`}
          />
        );
      case 'kicad_pcb':
        return (
          <Suspense
            fallback={<PreviewLoader text="Loading layout preview..." />}
          >
            <PcbPreview
              pcb={previewContent as string}
              previewKey={previewKey}
              key={previewKey}
              aria-label={ariaLabel || `PCB preview for ${previewKey}`}
              data-testid={dataTestId && `${dataTestId}-pcb`}
            />
          </Suspense>
        );
      case 'stl':
        return (
          <Suspense
            fallback={<PreviewLoader text="Loading 3D STL preview..." />}
          >
            <StlPreview
              stl={previewContent}
              aria-label={ariaLabel || `STL preview for ${previewKey}`}
              data-testid={dataTestId && `${dataTestId}-stl`}
            />
          </Suspense>
        );
      default:
        return 'No preview available';
    }
  };

  return (
    <div className={className} data-testid={dataTestId} aria-label={ariaLabel}>
      {renderFilePreview(previewExtension)}
    </div>
  );
};

export default FilePreview;
