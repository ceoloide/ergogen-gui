import Button from "./Button";
import styled from "styled-components";
import {Dispatch, SetStateAction} from "react";

export interface Preview {
  extension: string,
  key: string,
  content: string
}

type Props = {
    fileName: string,
    extension: string,
    content: string,
    preview?: Preview,
    setPreview: (preview: Preview) => void,
    setTabIndex: Dispatch<SetStateAction<number>> | undefined
};

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const FileName = styled.div`
    overflow: hidden;
    text-overflow: ellipsis;
`;

const Buttons = styled.div`
    white-space: nowrap;
    display: flex;
    gap: 10px;
    align-items: center;
`;

const StyledButton = styled(Button)`
    height: 34px;
    padding: 8px 12px;
    border-radius: 6px;
    
    .material-symbols-outlined {
        font-size: 16px !important;
    }
        
    &:hover {
        background-color: #222222;
    }
`;

const StyledLinkButton = styled.a`
    background-color: transparent;
    border: 1px solid #ccc;
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

    .material-symbols-outlined {
        font-size: 16px !important;
    }

    &:hover {
        background-color: #222222;
    }
`;

const DownloadRow = ({fileName, extension, content, preview, setPreview, setTabIndex}: Props): JSX.Element => {
    return (
        <Row>
            <FileName>{fileName}.{extension}</FileName>
            <Buttons>
                {preview && (

                <StyledLinkButton 
                        onClick={()=>{
                            setPreview(preview);
                            setTabIndex?.(0)
                        }}>
                    <span className="material-symbols-outlined">visibility</span>
                </StyledLinkButton>
                )}

                <StyledLinkButton target={"_blank"}
                   rel={"noreferrer"}
                   download={`${fileName}.${extension}`}
                   href={window.URL.createObjectURL(new Blob([content], {type: "octet/stream"}))}>
                    <span className="material-symbols-outlined">download</span>
                </StyledLinkButton>
            </Buttons>
        </Row>
    );
};

export default DownloadRow;