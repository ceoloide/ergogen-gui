import styled from 'styled-components';

/**
 * A styled button with an outline, used for secondary actions.
 */
const OutlineIconButton = styled.button`
    background-color: transparent;
    transition: color .15s ease-in-out,
    background-color .15s ease-in-out,
    border-color .15s ease-in-out,
    box-shadow .15s ease-in-out;
    border: 1px solid #3f3f3f;
    border-radius: 6px;
    color: white;
    display: flex;
    align-items: center;
    padding: 8px 12px;
    text-decoration: none;
    cursor: pointer;
    font-size: 13px;
    line-height: 16px;
    gap: 6px
    height: 34px;
    font-family: 'Roboto', sans-serif;

    .material-symbols-outlined {
        font-size: 16px !important;
    }

    &:hover,
    &.active {
        background-color: #3f3f3f;
    }
`;

export default OutlineIconButton;
