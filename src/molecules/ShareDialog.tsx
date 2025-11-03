import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { theme } from '../theme/theme';

/**
 * Props for the ShareDialog component.
 */
type ShareDialogProps = {
  shareLink: string;
  onClose: () => void;
  'data-testid'?: string;
};

/**
 * A dialog component that displays a shareable link and allows copying it to the clipboard.
 */
const ShareDialog: React.FC<ShareDialogProps> = ({
  shareLink,
  onClose,
  'data-testid': dataTestId,
}) => {
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-copy on mount
  useEffect(() => {
    const performCopy = async () => {
      try {
        await navigator.clipboard.writeText(shareLink);
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
          textArea.value = shareLink;
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
    performCopy();
  }, [shareLink]); // Copy when shareLink changes (on mount)

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

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, []);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
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
        textArea.value = shareLink;
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

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <Overlay
      data-testid={dataTestId}
      onClick={(e) => {
        // Close if clicking on overlay (not the dialog itself)
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
        <Title>Share Configuration</Title>
        <Message>
          Share this link with others to let them view and use your keyboard
          configuration.
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
        </InputContainer>
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

const InputContainer = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: stretch;
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
