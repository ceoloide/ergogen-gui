import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { theme } from '../theme/theme';
import Button from '../atoms/Button';
import { exportConfigsProgressively } from '../utils/zip';

type BulkDownloadDialogProps = {
  isOpen: boolean;
  configs: { id: string; name: string; config: string }[];
  injections: string[][] | undefined;
  debug: boolean;
  stlPreview: boolean;
  onClose: () => void;
  'data-testid'?: string;
};

const BulkDownloadDialog: React.FC<BulkDownloadDialogProps> = ({
  isOpen,
  configs,
  injections,
  debug,
  stlPreview,
  onClose,
  'data-testid': dataTestId,
}) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [onlyConfigs, setOnlyConfigs] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [currentName, setCurrentName] = useState('');
  const abortRef = useRef(false);

  // Initialize selected IDs with all configs when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedIds(new Set(configs.map((c) => c.id)));
      setIsGenerating(false);
      setCurrentProgress(0);
      setCurrentName('');
      abortRef.current = false;
    }
  }, [isOpen, configs]);

  if (!isOpen) return null;

  const handleToggleSelectAll = (select: boolean) => {
    if (select) {
      setSelectedIds(new Set(configs.map((c) => c.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleCheckboxChange = (id: string, checked: boolean) => {
    const next = new Set(selectedIds);
    if (checked) {
      next.add(id);
    } else {
      next.delete(id);
    }
    setSelectedIds(next);
  };

  const handleProceed = async () => {
    if (selectedIds.size === 0) return;
    setIsGenerating(true);
    setCurrentProgress(0);
    setCurrentName('');
    abortRef.current = false;

    const selectedConfigs = configs.filter((c) => selectedIds.has(c.id));

    try {
      await exportConfigsProgressively(
        selectedConfigs,
        injections,
        debug,
        stlPreview,
        onlyConfigs,
        (current, total, name) => {
          setCurrentProgress(current);
          setCurrentName(name);
        },
        () => abortRef.current
      );
    } catch (err) {
      console.error('Error during bulk download:', err);
    } finally {
      // Auto-close modal if not aborted
      if (!abortRef.current) {
        onClose();
      }
    }
  };

  const handleAbort = () => {
    abortRef.current = true;
    onClose();
  };

  const percent =
    selectedIds.size > 0 ? (currentProgress / selectedIds.size) * 100 : 0;

  return (
    <Overlay data-testid={dataTestId}>
      <DialogBox data-testid={dataTestId && `${dataTestId}-box`}>
        <Title>Download Configurations</Title>

        {!isGenerating ? (
          <>
            <ConfigListContainer>
              {configs.map((cfg) => {
                const isChecked = selectedIds.has(cfg.id);
                return (
                  <ConfigItemRow key={cfg.id}>
                    <CustomCheckboxWrapper htmlFor={`bulk-check-${cfg.id}`}>
                      <HiddenCheckbox
                        id={`bulk-check-${cfg.id}`}
                        checked={isChecked}
                        onChange={(e) =>
                          handleCheckboxChange(cfg.id, e.target.checked)
                        }
                      />
                      <StyledCheckbox $checked={isChecked} />
                      <ConfigItemLabelText>{cfg.name}</ConfigItemLabelText>
                    </CustomCheckboxWrapper>
                  </ConfigItemRow>
                );
              })}
            </ConfigListContainer>

            <SelectionActions>
              <ActionButton onClick={() => handleToggleSelectAll(true)}>
                Select All
              </ActionButton>
              <ActionButton onClick={() => handleToggleSelectAll(false)}>
                Deselect All
              </ActionButton>
            </SelectionActions>

            <SwitchWrapper>
              <SwitchLabel>Only download configs</SwitchLabel>
              <SwitchContainer
                $checked={onlyConfigs}
                htmlFor="only-configs-switch"
              >
                <HiddenInput
                  type="checkbox"
                  id="only-configs-switch"
                  checked={onlyConfigs}
                  onChange={(e) => setOnlyConfigs(e.target.checked)}
                />
                <SwitchTrack $checked={onlyConfigs} />
                <SwitchThumb $checked={onlyConfigs} />
              </SwitchContainer>
            </SwitchWrapper>

            {!onlyConfigs && (
              <WarningBox>
                <span className="material-symbols-outlined">warning</span>
                <span>
                  Warning: Exporting generated outputs for multiple
                  configurations may take a long time depending on the number of
                  selected configurations, their complexity, and CPU speed.
                </span>
              </WarningBox>
            )}

            <ButtonGroup>
              <SecondaryButton onClick={handleAbort} size="medium">
                Cancel
              </SecondaryButton>
              <Button
                onClick={handleProceed}
                disabled={selectedIds.size === 0}
                size="medium"
              >
                Download ({selectedIds.size})
              </Button>
            </ButtonGroup>
          </>
        ) : (
          <>
            <ProgressWrapper>
              <ProgressBarContainer>
                <ProgressBarFill style={{ width: `${percent}%` }} />
              </ProgressBarContainer>
              <ProgressTextContainer>
                <GeneratingLabel>
                  {currentName ? `Generating ${currentName}` : 'Preparing...'}
                </GeneratingLabel>
                <ProgressRatio>
                  {currentProgress} / {selectedIds.size}
                </ProgressRatio>
              </ProgressTextContainer>
            </ProgressWrapper>

            <ButtonGroup>
              <AbortButton onClick={handleAbort} size="medium">
                Cancel
              </AbortButton>
            </ButtonGroup>
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
  max-width: 500px;
  width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
`;

const Title = styled.h2`
  margin: 0 0 1rem 0;
  font-size: ${theme.fontSizes.h3};
  color: ${theme.colors.text};
`;

const SelectionActions = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 1.5rem;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.textDark};
  font-size: 11px;
  font-weight: ${theme.fontWeights.regular};
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;

  &:hover {
    background-color: ${theme.colors.border};
    color: ${theme.colors.white};
  }
`;

const ConfigListContainer = styled.div`
  border: 1px solid ${theme.colors.border};
  background-color: ${theme.colors.background};
  border-radius: 6px;
  padding: 0.5rem;
  max-height: 200px;
  overflow-y: auto;
  margin-bottom: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const ConfigItemRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ConfigItemLabelText = styled.span`
  color: ${theme.colors.text};
  font-size: 13px;
  user-select: none;
`;

const CustomCheckboxWrapper = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  width: 100%;
  padding: 4px 0;
`;

const HiddenCheckbox = styled.input.attrs({ type: 'checkbox' })`
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
`;

const StyledCheckbox = styled.div<{ $checked: boolean }>`
  width: 16px;
  height: 16px;
  background-color: ${(props) =>
    props.$checked ? theme.colors.accent : 'transparent'};
  border: 2px solid
    ${(props) => (props.$checked ? theme.colors.accent : theme.colors.border)};
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
  flex-shrink: 0;

  &::after {
    content: '';
    display: ${(props) => (props.$checked ? 'block' : 'none')};
    width: 3px;
    height: 6px;
    border: solid ${theme.colors.white};
    border-width: 0 2px 2px 0;
    transform: rotate(45deg) translate(-0.5px, -1px);
  }

  ${CustomCheckboxWrapper}:hover & {
    border-color: ${theme.colors.accent};
  }
`;

const SwitchWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  margin-bottom: 1rem;
`;

const SwitchLabel = styled.span`
  color: ${theme.colors.text};
  font-size: ${theme.fontSizes.base};
  user-select: none;
`;

const SwitchContainer = styled.label<{ $checked: boolean }>`
  position: relative;
  display: inline-block;
  width: 36px;
  height: 20px;
  flex-shrink: 0;
  cursor: pointer;
`;

const HiddenInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
`;

const SwitchTrack = styled.span<{ $checked: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${(props) =>
    props.$checked ? theme.colors.accent : theme.colors.border};
  border-radius: 20px;
  transition: background-color 0.2s ease-in-out;
`;

const SwitchThumb = styled.span<{ $checked: boolean }>`
  position: absolute;
  top: 2px;
  left: ${(props) => (props.$checked ? '18px' : '2px')};
  width: 16px;
  height: 16px;
  background-color: ${theme.colors.white};
  border-radius: 50%;
  transition: left 0.2s ease-in-out;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const WarningBox = styled.div`
  background-color: ${theme.colors.warning};
  border: 1px solid ${theme.colors.warningDark};
  border-radius: 6px;
  padding: 10px 12px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: flex-start;
  gap: 8px;
  color: ${theme.colors.warningDark};
  font-size: 13px;
  line-height: 1.4;

  .material-symbols-outlined {
    font-size: 18px;
    flex-shrink: 0;
    margin-top: 1px;
    color: ${theme.colors.warningDark};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: auto;
`;

const ProgressWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1.5rem;
`;

const ProgressBarContainer = styled.div`
  background-color: ${theme.colors.border};
  height: 8px;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
  width: 100%;
`;

const ProgressBarFill = styled.div`
  background-color: ${theme.colors.accent};
  height: 100%;
  transition: width 0.15s ease-out;
`;

const ProgressTextContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
`;

const GeneratingLabel = styled.span`
  color: ${theme.colors.text};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 80%;
`;

const ProgressRatio = styled.span`
  color: ${theme.colors.textDark};
  font-weight: ${theme.fontWeights.semiBold};
`;

const SecondaryButton = styled(Button)`
  background-color: ${theme.colors.backgroundLighter};
  color: ${theme.colors.textDark};

  &:hover {
    background-color: ${theme.colors.buttonHover};
  }
`;

const AbortButton = styled(SecondaryButton)`
  width: 100%;
`;

export default BulkDownloadDialog;
