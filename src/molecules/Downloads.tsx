import DownloadRow from "../atoms/DownloadRow";
import { Preview } from "../atoms/DownloadRow";
import yaml from 'js-yaml';
import styled from "styled-components";
import { useConfigContext } from "../context/ConfigContext";
import { Dispatch, SetStateAction, useContext } from "react";
import { TabContext } from "../organisms/Tabs";

const DownloadsContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
`;

type Props = {
  setPreview: Dispatch<SetStateAction<Preview>>
};

type DownloadObj = {
  fileName: string,
  extension: string,
  content: string,
  previewKey?: string,
  preview?: Preview,
};

type DownloadArr = Array<DownloadObj>;

const Downloads = ({ setPreview }: Props) => {
  let downloads: DownloadArr = [];
  const configContext = useConfigContext();
  const tabContext = useContext(TabContext);
  if (!configContext) return null;

  const { configInput, results } = configContext;
  if (results?.demo) {
    downloads.push({
      fileName: 'raw',
      extension: 'txt',
      content: configInput ?? ''
    }, {
      fileName: 'canonical',
      extension: 'yaml',
      content: yaml.dump(results.canonical),
      previewKey: 'canonical',
      preview: {
        key: 'canonical',
        extension: 'yaml',
        content: yaml.dump(results.canonical),
      }
    },
      {
        fileName: 'demo',
        extension: 'dxf',
        content: results?.demo?.dxf,
        previewKey: 'demo.svg',
        preview: {
          key: 'demo.svg',
          extension: 'svg',
          content: results?.demo?.svg,
        }
      },
      {
        fileName: 'points',
        extension: 'yaml',
        content: yaml.dump(results.points),
        previewKey: 'points',
        preview: {
          key: 'points',
          extension: 'yaml',
          content: yaml.dump(results.points),
        }
      },
      {
        fileName: 'units',
        extension: 'yaml',
        content: yaml.dump(results.units),
        previewKey: 'units',
        preview: {
          key: 'units',
          extension: 'yaml',
          content: yaml.dump(results.units),
        }
      });
  }

  if (results?.outlines) {
    for (const [name, outline] of Object.entries(results.outlines)) {
      downloads.push(
        {
          fileName: name,
          extension: 'dxf',
          // @ts-ignore
          content: outline.dxf,
          previewKey: `outlines.${name}.svg`,
          preview: {
            key: `outlines.${name}.svg`,
            extension: 'svg',
            // @ts-ignore
            content: outline.svg
          }
        }
      )
      // @ts-ignore
      if (caseObj.stl) {
        downloads.push(
          {
            fileName: name,
            extension: 'stl',
            // @ts-ignore
            content: caseObj.stl,
            previewKey: `cases.${name}.stl`,
            preview: {
              key: `cases.${name}.stl`,
              extension: 'stl',
              // @ts-ignore
              content: caseObj.stl
            }
          }
        )
      }
    }
  }

  if (results?.cases) {
    for (const [name, caseObj] of Object.entries(results.cases)) {
      downloads.push(
        {
          fileName: name,
          extension: 'jscad',
          // @ts-ignore
          content: caseObj.jscad,
          previewKey: `cases.${name}`,
          preview: {
            key: `cases.${name}`,
            extension: 'jscad',
            // @ts-ignore
            content: caseObj.jscad
          }
        }
      )
    }

  }

  if (results?.pcbs) {
    for (const [name, pcb] of Object.entries(results.pcbs)) {
      const pcbString = String(pcb);
      const match = pcbString.match(/version "?([0-9]+)"?/);
      const version = (match && match.length > 1 ? Number(match[1]) : -1);
      downloads.push(
        {
          fileName: name,
          extension: 'kicad_pcb',
          // @ts-ignore
          content: pcb,
          previewKey: (configContext.kicanvasPreview && version > 20240101 ? `pcbs.${name}` : ''),
          // @ts-ignore
          preview: (configContext.kicanvasPreview && version > 20240101 ? {
            key: `pcbs.${name}`,
            extension: 'kicad_pcb',
            content: pcb
          } : undefined)
        }
      )
    }

  }

  return (
    <DownloadsContainer>
      <h3>Outputs</h3>
      {
        downloads.map(
          (download, i) => {
            if (!configContext.debug) {
              if (download.fileName.startsWith("_")) return false;
              
              // Ignore the following combinations of file names and extensions:
              const ignore : {[key:string]:string} = {
                "units": "yaml",
                "points": "yaml",
                "canonical": "yaml",
                "raw": "txt",
              };
              if(ignore[download.fileName] === download.extension) return false;
            }

            return <DownloadRow key={i} {...download} setPreview={setPreview} setTabIndex={tabContext?.setTabIndex} />;
          }
        )
      }
    </DownloadsContainer>
  );
};

export default Downloads;