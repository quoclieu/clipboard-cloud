import { css } from "emotion";
import produce from "immer";
import { remove, sortBy } from "lodash-es";
import React, { FunctionComponent, useEffect, useMemo, useState } from "react";
import Form from "react-bootstrap/Form";
import { FaFileAlt } from "react-icons/fa";
import { TiDelete } from "react-icons/ti";
import { storage } from "../services/firebase";
import { colors } from "../style-variables";

interface Props {
  instanceId: string;
}

export const FileShare: FunctionComponent<Props> = ({ instanceId }) => {
  const [downloadUrls, setDownloadUrls] = useState<
    Array<{ name: string; url: string }>
  >([]);

  const storageRef = useMemo(() => storage().ref().child(instanceId), [
    instanceId,
  ]);

  useEffect(() => {
    storageRef.listAll().then((res) => {
      setDownloadUrls([]);
      res.items.forEach(function (itemRef) {
        itemRef.getDownloadURL().then((url) => {
          setDownloadUrls((prevDownloads) => {
            return [...prevDownloads, { url: url, name: itemRef.name }];
          });
        });
      });
    });
  }, [storageRef]);

  const handleUploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    let fileName = "untitled";
    if (e.target.files !== null) {
      fileName = e.target.files[0].name;
      storageRef
        .child(fileName)
        .put(e.target.files![0])
        .then(() => {
          console.log("upload done");
        })
        .then(() => {
          return storageRef.child(fileName).getDownloadURL();
        })
        .then((url) => {
          setDownloadUrls((prevDownloads) => {
            return [...prevDownloads, { url: url, name: fileName }];
          });
        })
        .catch((e) => {
          console.log(e);
        });
    }
    e.target.files = null;
    e.target.value = "";
  };

  const handleDeleteFile = (name: string) => {
    const ref = storageRef.child(name);
    ref
      .delete()
      .then(() => {
        setDownloadUrls((prevFiles) =>
          produce(prevFiles, (newFiles) => {
            remove(newFiles, (file) => file.name === name);
            return newFiles;
          })
        );
      })
      .catch(() => {});
  };

  return (
    <>
      <h5 className={heading}>Files</h5>
      <section className={fileContainer}>
        {sortBy(downloadUrls, ["name"]).map((file, index) => {
          return (
            <div key={file.url} className={fileRow}>
              <div>
                <FaFileAlt className={fileIcon} />
                <a download={file.name} href={file.url}>
                  {file.name}
                </a>
              </div>
              <div style={{ marginRight: 10 }}>
                <TiDelete
                  className={deleteIcon}
                  onClick={() => handleDeleteFile(file.name)}
                />
              </div>
            </div>
          );
        })}
      </section>
      <section>
        <label htmlFor="file-upload" className={fileInputLabel}>
          <Form.Control
            id="file-upload"
            type="file"
            onChange={handleUploadFile}
            className={fileInput}
          />
          Click or drag files here to upload.
        </label>
      </section>
    </>
  );
};

const fileContainer = css``;

const fileInput = css`
  border: 1px solid black;
  position: absolute;
  width: auto;
  height: 200px;
  opacity: 0;
  &:hover {
    cursor: pointer;
  }
`;

const fileInputLabel = css`
  border: 1px dashed ${colors.gray1};
  border-radius: 2px;
  height: 200px;
  width: 100%;
  background-color: ${colors.bordergray};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const heading = css`
  font-weight: bold;
  margin-bottom: 10px;
  margin-top: 5px;
`;

const fileRow = css`
  display: flex;
  align-items: center;
  padding: 1rem 0px;
  justify-content: space-between;
  border-bottom: 2px solid ${colors.bordergray};
  &:last-child {
    border-bottom: none;
  }
`;

const fileIcon = css`
  margin-right: 10px;
  color: ${colors.blue1};
  font-size: 20px;
`;

const deleteIcon = css`
  font-size: 1.5rem;
  color: salmon;
  &:hover {
    cursor: pointer;
  }
`;
