import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { theme } from '../theme/theme';
import { VersionInfo } from '../utils/version';

interface DevChipProps {
  versionInfo: VersionInfo;
  'data-testid'?: string;
}

export const DevChip: React.FC<DevChipProps> = ({
  versionInfo,
  'data-testid': dataTestId,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 250);
  };

  const handlePopoverMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handlePopoverMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 250);
  };

  const handleChipClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  // Close popover when clicking anywhere else
  useEffect(() => {
    if (!isOpen) return;

    const handleGlobalClick = () => {
      setIsOpen(false);
    };

    window.addEventListener('click', handleGlobalClick);
    return () => {
      window.removeEventListener('click', handleGlobalClick);
    };
  }, [isOpen]);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <ChipWrapper
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-testid={dataTestId}
    >
      <ChipElement
        onClick={handleChipClick}
        data-testid={dataTestId && `${dataTestId}-badge`}
        aria-label="Custom Ergogen version indicator"
      >
        <span className="material-symbols-outlined">science</span>
      </ChipElement>

      {isOpen && (
        <PopoverCard
          onMouseEnter={handlePopoverMouseEnter}
          onMouseLeave={handlePopoverMouseLeave}
          onClick={(e) => e.stopPropagation()}
          data-testid={dataTestId && `${dataTestId}-popover`}
        >
          <PopoverTitle>Custom Ergogen Version</PopoverTitle>
          <PopoverText>
            This website is running a custom version of Ergogen for development
            and preview purposes.
          </PopoverText>
          <VersionLink
            href={versionInfo.url}
            target="_blank"
            rel="noopener noreferrer"
            data-testid={dataTestId && `${dataTestId}-link`}
          >
            <span>{versionInfo.label}</span>
            <span className="material-symbols-outlined open-icon">
              open_in_new
            </span>
          </VersionLink>
        </PopoverCard>
      )}
    </ChipWrapper>
  );
};

const ChipWrapper = styled.span`
  position: relative;
  display: inline-flex;
  align-items: center;
  transform: translateY(-5px);
`;

const ChipElement = styled.span`
  background-color: ${theme.colors.accent};
  color: ${theme.colors.white};
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  user-select: none;
  margin-left: 4px;
  width: 16px;
  height: 16px;
  line-height: 1;

  .material-symbols-outlined {
    font-size: 11px !important;
  }

  &:hover {
    background-color: ${theme.colors.accentDark};
  }
`;

const PopoverCard = styled.div`
  position: absolute;
  top: 100%;
  left: 4px;
  margin-top: 6px;
  background-color: ${theme.colors.backgroundLight};
  border: 1px solid ${theme.colors.border};
  border-radius: 6px;
  padding: 10px 12px;
  width: 240px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  z-index: 2000;
  display: flex;
  flex-direction: column;
  gap: 6px;
  cursor: default;
  text-align: left;
`;

const PopoverTitle = styled.div`
  font-size: 12px;
  font-weight: ${theme.fontWeights.semiBold};
  color: ${theme.colors.white};
`;

const PopoverText = styled.div`
  font-size: 11px;
  color: ${theme.colors.textDark};
  line-height: 1.4;
`;

const VersionLink = styled.a`
  font-size: 11px;
  color: ${theme.colors.accent};
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-top: 2px;
  font-weight: ${theme.fontWeights.semiBold};
  align-self: flex-start;
  word-break: break-all;

  .open-icon {
    font-size: 11px !important;
  }

  &:hover {
    color: ${theme.colors.accentDark};
    text-decoration: underline;
  }
`;
