import { css } from "emotion";
import { sortBy } from "lodash-es";
import React, { FunctionComponent, useEffect, useMemo, useState } from "react";
import { FaFileAlt } from "react-icons/fa";
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
    // * uploading a file
    // storageRef
    //   .child("file3.txt") // * file name
    //   .putString("my message2")
    //   .then(() => {
    //     console.log("upload done");
    //   });

    // * Get all files under the instance ID folder
    storageRef.listAll().then((res) => {
      res.items.forEach(function (itemRef) {
        console.log(itemRef.name);

        itemRef.getDownloadURL().then((url) => {
          setDownloadUrls((prevDownloads) => {
            return [...prevDownloads, { url: url, name: itemRef.name }];
          });
        });
      });
    });
  }, [storageRef]);
  return (
    <>
      <h5 className={heading}>Files</h5>
      <div className={fileContainer}>
        {sortBy(downloadUrls, ["name"]).map((file) => {
          return (
            <div key={file.url} className={fileRow}>
              <FaFileAlt className={fileIcon} />
              <a href={file.url}>{file.name}</a>
            </div>
          );
        })}
      </div>
    </>
  );
};

const fileContainer = css``;

const heading = css`
  font-weight: bold;
  margin-bottom: 10px;
  margin-top: 5px;
`;

const fileRow = css`
  display: flex;
  align-items: center;
  padding: 1rem 0px;

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
