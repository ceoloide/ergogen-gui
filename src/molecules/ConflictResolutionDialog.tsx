import React from 'react';
import styled from 'styled-components';
import Button from '../atoms/Button';

type Resolution = 'skip' | 'overwrite' | 'keep-both';

type Props = {
  injectionName: string;
  onResolve: (resolution: Resolution, applyToAll: boolean) => void;
};

const DialogOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const DialogContainer = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const ConflictResolutionDialog = ({ injectionName, onResolve }: Props) => {
  const [applyToAll, setApplyToAll] = React.useState(false);

  return (
    <DialogOverlay>
      <DialogContainer>
        <h2>Conflict Detected</h2>
        <p>An injection with the name "{injectionName}" already exists.</p>
        <div>
          <input
            type="checkbox"
            checked={applyToAll}
            onChange={(e) => setApplyToAll(e.target.checked)}
          />
          <label>Apply to all conflicts</label>
        </div>
        <ButtonContainer>
          <Button onClick={() => onResolve('skip', applyToAll)}>Skip</Button>
          <Button onClick={() => onResolve('overwrite', applyToAll)}>
            Overwrite
          </Button>
          <Button onClick={() => onResolve('keep-both', applyToAll)}>
            Keep Both
          </Button>
        </ButtonContainer>
      </DialogContainer>
    </DialogOverlay>
  );
};

export default ConflictResolutionDialog;
