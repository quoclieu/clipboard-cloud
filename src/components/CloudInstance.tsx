import { css } from "emotion";
import React from "react";
import { useParams } from "react-router-dom";
import { TextShare } from "./TextShare";

export const CloudInstance = () => {
  const { id } = useParams<{ id: string }>();
  return (
    <>
      <div className={headerContainer}>
        <h1>File Cloud</h1>
        <h2>Instance ID: {id}</h2>
      </div>
      <div className={contentContainer}>
        <div className={textContainer}>
          <TextShare instanceId={id} />
        </div>
        <div className={fileContainer}>world</div>
      </div>
    </>
  );
};

const headerContainer = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 0;
`;

const contentContainer = css`
  margin: 1rem;
  display: grid;
  grid-template-rows: 500px;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  grid-gap: 1rem;
`;

const textContainer = css``;

const fileContainer = css`
  background-color: lightseagreen;
`;
