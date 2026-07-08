import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { theme } from '../theme/theme';
import {
  createShareableUri,
  extractUsedFootprintsFromCanonical,
} from '../utils/share';
import { createErgogenWorker } from '../workers/workerFactory';

/**
 * Props for the ShareDialog component.
 */
type ShareDialogProps = {
  config: string;
  injections?: string[][];
  onClose: () => void;
  'data-testid'?: string;
};

/**
 * Copies text to the clipboard with fallback support.
 * Sets the copied state and manages timeout for resetting it.
 *
 * @param text - The text to copy to the clipboard
 * @param setCopied - State setter function to update copied status
 * @param timeoutRef - Ref to store the timeout ID for cleanup
 */
const copyToClipboardWithFallback = async (
  text: string,
  setCopied: (value: boolean) => void,
  timeoutRef: React.MutableRefObject<NodeJS.Timeout | null>
): Promise<void> => {
  try {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    // Reset after 2.5 seconds
    timeoutRef.current = setTimeout(() => {
      setCopied(false);
    }, 2500);
  } catch (error) {
    console.error('Failed to copy shareable URI to clipboard:', error);
    // Fallback: try using the older execCommand API
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        setCopied(false);
      }, 2500);
    } catch (fallbackError) {
      console.error('Fallback copy method also failed:', fallbackError);
    }
  }
};

/**
 * A dialog component that allows selecting custom footprints/libraries, runs analysis,
 * and displays a shareable link.
 */
const ShareDialog: React.FC<ShareDialogProps> = ({
  config,
  injections,
  onClose,
  'data-testid': dataTestId,
}) => {
  const safeInjections = injections || [];
  const [step, setStep] = useState<1 | 2>(1);
  const [includeCustom, setIncludeCustom] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shareLink, setShareLink] = useState('');
  const [selectionItems, setSelectionItems] = useState<
    {
      type: string;
      name: string;
      content: string;
      checked: boolean;
    }[]
  >([]);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Background analysis effect
  useEffect(() => {
    if (
      !includeCustom ||
      hasAnalyzed ||
      safeInjections.length === 0 ||
      step !== 1
    ) {
      return;
    }

    let active = true;
    setLoading(true);
    setError(null);

    const worker = createErgogenWorker();
    if (!worker) {
      setError('Could not initialize background worker.');
      setLoading(false);
      return;
    }

    worker.onmessage = (event: MessageEvent) => {
      if (!active) return;
      const response = event.data;

      if (response.type === 'success') {
        const canonical = response.results?.canonical;
        const usedFootprints = extractUsedFootprintsFromCanonical(canonical);

        const eligibleItems = safeInjections
          .map(([type, name, content]) => {
            const isEligible = type !== 'footprint' || usedFootprints.has(name);
            return { type, name, content, checked: isEligible, isEligible };
          })
          .filter((item) => item.isEligible)
          .map(({ type, name, content, checked }) => ({
            type,
            name,
            content,
            checked,
          }));

        setSelectionItems(eligibleItems);
        setHasAnalyzed(true);
      } else if (response.type === 'error') {
        setError(response.error || 'Failed to analyze configuration.');
      }
      setLoading(false);
      worker.terminate();
    };

    worker.onerror = () => {
      if (!active) return;
      setError('Worker encountered an error during analysis.');
      setLoading(false);
      worker.terminate();
    };

    worker.postMessage({
      type: 'generate',
      inputConfig: config,
      injectionInput: safeInjections,
      requestId: `share-analysis-${Date.now()}`,
      options: {
        debug: true,
      },
    });

    return () => {
      active = false;
      worker.terminate();
    };
  }, [includeCustom, hasAnalyzed, safeInjections, config, step]);

  // Auto-copy on mount of Step 2
  useEffect(() => {
    if (step === 2 && shareLink) {
      copyToClipboardWithFallback(shareLink, setCopied, timeoutRef);
    }
  }, [shareLink, step]);

  // Handle Esc key press
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  // Focus input on step 2 mount
  useEffect(() => {
    if (step === 2 && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [step]);

  // Cleanup timeout on unmount
  useEffect(() => {
    const currentTimeoutRef = timeoutRef;
    return () => {
      if (currentTimeoutRef.current) {
        clearTimeout(currentTimeoutRef.current);
      }
    };
  }, []);

  const handleToggleItem = (index: number) => {
    setSelectionItems((prev) =>
      prev.map((item, idx) =>
        idx === index ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const handleGenerateLink = () => {
    const checkedItems = includeCustom
      ? selectionItems.filter((item) => item.checked)
      : [];
    const finalInjections =
      checkedItems.length > 0
        ? checkedItems.map((item) => [item.type, item.name, item.content])
        : undefined;

    const link = createShareableUri({
      config,
      injections: finalInjections,
    });

    setShareLink(link);
    setStep(2);
  };

  const copyToClipboard = () => {
    copyToClipboardWithFallback(shareLink, setCopied, timeoutRef);
  };

  return (
    <Overlay
      data-testid={dataTestId}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <DialogBox
        data-testid={dataTestId && `${dataTestId}-box`}
        onClick={(e) => e.stopPropagation()}
      >
        <CloseButton
          onClick={onClose}
          data-testid={dataTestId && `${dataTestId}-close`}
          aria-label="Close dialog"
        >
          <span className="material-symbols-outlined">close</span>
        </CloseButton>

        {step === 1 ? (
          <>
            <Title>Share Configuration</Title>
            <Message>
              Configure what content should be included when sharing your
              keyboard design.
            </Message>

            <SwitchRow>
              <SwitchContainer htmlFor="include-libraries-toggle">
                <SwitchInput
                  id="include-libraries-toggle"
                  type="checkbox"
                  checked={includeCustom}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setIncludeCustom(checked);
                    if (!checked) {
                      setLoading(false);
                      setError(null);
                    }
                  }}
                  aria-label="Include custom libraries"
                />
                <SwitchSlider $checked={includeCustom} />
                <span>Include custom libraries</span>
              </SwitchContainer>
            </SwitchRow>

            {includeCustom && (
              <>
                {loading && (
                  <LoadingContainer>
                    <Spinner />
                    <span>Analyzing configuration...</span>
                  </LoadingContainer>
                )}

                {error && <ErrorText>{error}</ErrorText>}

                {!loading && !error && safeInjections.length === 0 && (
                  <InfoText>No custom libraries loaded.</InfoText>
                )}

                {!loading &&
                  !error &&
                  safeInjections.length > 0 &&
                  selectionItems.length === 0 && (
                    <InfoText>
                      No custom footprints or libraries are used in this
                      configuration.
                    </InfoText>
                  )}

                {!loading && !error && selectionItems.length > 0 && (
                  <InjectionListContainer>
                    {selectionItems.map((item, idx) => (
                      <InjectionItem key={`${item.type}-${item.name}`}>
                        <CheckboxInput
                          id={`injection-${item.name}`}
                          type="checkbox"
                          checked={item.checked}
                          onChange={() => handleToggleItem(idx)}
                          aria-label={item.name}
                        />
                        <Badge $type={item.type}>{item.type}</Badge>
                        <InjectionLabel htmlFor={`injection-${item.name}`}>
                          {item.name}
                        </InjectionLabel>
                      </InjectionItem>
                    ))}
                  </InjectionListContainer>
                )}
              </>
            )}

            <ButtonWrapper>
              <PrimaryButton onClick={handleGenerateLink} disabled={loading}>
                Share
              </PrimaryButton>
            </ButtonWrapper>
          </>
        ) : (
          <>
            <Title>Shareable Configuration Link</Title>
            <Message>
              Share this link with others to let them view and use your keyboard
              configuration, including all of your custom footprints.
            </Message>
            <InputContainer>
              <ShareInput
                ref={inputRef}
                type="text"
                value={shareLink}
                readOnly
                data-testid={dataTestId && `${dataTestId}-input`}
                aria-label="Share link"
              />
              <ButtonWrapper>
                <CopyButton
                  onClick={copyToClipboard}
                  data-testid={dataTestId && `${dataTestId}-copy`}
                  aria-label={copied ? 'Link copied' : 'Copy link'}
                >
                  <span className="material-symbols-outlined">
                    {copied ? 'check' : 'content_copy'}
                  </span>
                  {copied ? 'Link copied' : 'Copy link'}
                </CopyButton>
              </ButtonWrapper>
            </InputContainer>
          </>
        )}
      </DialogBox>
    </Overlay>
  );
};

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const DialogBox = styled.div`
  background-color: ${theme.colors.backgroundLight};
  border: 1px solid ${theme.colors.border};
  border-radius: 8px;
  padding: 2rem;
  max-width: 600px;
  width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
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
`;

const Title = styled.h2`
  margin: 0 0 1rem 0;
  font-size: ${theme.fontSizes.h3};
  color: ${theme.colors.text};
  padding-right: 3rem;
`;

const Message = styled.p`
  margin: 0 0 1.5rem 0;
  font-size: ${theme.fontSizes.base};
  color: ${theme.colors.textDark};
  line-height: 1.5;
`;

const SwitchRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const SwitchContainer = styled.label`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  user-select: none;
  font-family: ${theme.fonts.body};
  font-size: ${theme.fontSizes.base};
  color: ${theme.colors.text};
`;

const SwitchInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
  position: absolute;
`;

const SwitchSlider = styled.span<{ $checked: boolean }>`
  position: relative;
  display: inline-block;
  width: 44px;
  height: 22px;
  background-color: ${(props) =>
    props.$checked ? theme.colors.accent : theme.colors.backgroundLighter};
  border: 1px solid ${theme.colors.border};
  border-radius: 22px;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease;

  &::before {
    content: '';
    position: absolute;
    height: 16px;
    width: 16px;
    left: 2px;
    bottom: 2px;
    background-color: ${theme.colors.white};
    border-radius: 50%;
    transition: transform 0.2s ease;
    transform: ${(props) =>
      props.$checked ? 'translateX(22px)' : 'translateX(0)'};
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 1.5rem 0;
  color: ${theme.colors.textDark};
`;

const Spinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid ${theme.colors.border};
  border-top: 2px solid ${theme.colors.accent};
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const ErrorText = styled.p`
  color: ${theme.colors.error};
  font-size: ${theme.fontSizes.sm};
  margin: 1rem 0;
  padding: 0.75rem;
  background-color: ${theme.colors.errorDark}22;
  border: 1px solid ${theme.colors.error};
  border-radius: 6px;
`;

const InfoText = styled.p`
  color: ${theme.colors.textDarker};
  font-size: ${theme.fontSizes.sm};
  margin: 1rem 0;
  font-style: italic;
`;

const InjectionListContainer = styled.div`
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid ${theme.colors.border};
  border-radius: 6px;
  background-color: ${theme.colors.backgroundLighter};
  margin: 1rem 0 1.5rem 0;
  padding: 0.5rem;
`;

const InjectionItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background-color 0.15s ease;

  &:hover {
    background-color: ${theme.colors.backgroundLight};
  }
`;

const CheckboxInput = styled.input`
  cursor: pointer;
  width: 16px;
  height: 16px;
  accent-color: ${theme.colors.accent};
`;

const InjectionLabel = styled.label`
  cursor: pointer;
  flex: 1;
  color: ${theme.colors.text};
  font-size: ${theme.fontSizes.sm};
  user-select: none;
`;

const Badge = styled.span<{ $type: string }>`
  font-size: ${theme.fontSizes.xs};
  font-weight: ${theme.fontWeights.bold};
  padding: 2px 6px;
  border-radius: 4px;
  text-transform: uppercase;
  color: ${theme.colors.white};
  background-color: ${(props) => {
    switch (props.$type) {
      case 'footprint':
        return '#007bff';
      case 'outline':
        return '#e83e8c';
      case 'template':
        return '#fd7e14';
      default:
        return theme.colors.border;
    }
  }};
`;

const PrimaryButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background-color: ${theme.colors.accent};
  border: none;
  border-radius: 6px;
  padding: 0.75rem 1.5rem;
  color: ${theme.colors.white};
  font-family: ${theme.fonts.body};
  font-size: ${theme.fontSizes.base};
  font-weight: ${theme.fontWeights.semiBold};
  cursor: pointer;
  transition:
    background-color 0.15s ease-in-out,
    transform 0.15s ease-in-out;
  margin-top: 1rem;

  &:hover {
    background-color: ${theme.colors.accentDark};
  }

  &:active {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const InputContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: stretch;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;

  @media (min-width: 500px) {
    width: auto;
  }
`;

const ShareInput = styled.input`
  flex: 1;
  background-color: ${theme.colors.backgroundLighter};
  border: 1px solid ${theme.colors.border};
  border-radius: 6px;
  padding: 0.75rem 1rem;
  color: ${theme.colors.text};
  font-family: ${theme.fonts.body};
  font-size: ${theme.fontSizes.base};
  outline: none;
  transition: border-color 0.15s ease-in-out;

  &:focus {
    border-color: ${theme.colors.accent};
  }

  &::selection {
    background-color: ${theme.colors.accent};
    color: ${theme.colors.white};
  }
`;

const CopyButton = styled.button`
  white-space: nowrap;
  flex-shrink: 0;
  width: 125px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background-color: ${theme.colors.accent};
  border: none;
  border-radius: 6px;
  padding: 0.75rem 1rem;
  color: ${theme.colors.white};
  font-family: ${theme.fonts.body};
  font-size: ${theme.fontSizes.base};
  cursor: pointer;
  transition:
    background-color 0.15s ease-in-out,
    transform 0.15s ease-in-out;

  .material-symbols-outlined {
    font-size: ${theme.fontSizes.iconMedium} !important;
  }

  &:hover {
    background-color: ${theme.colors.accentDark};
  }

  &:active {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export default ShareDialog;
