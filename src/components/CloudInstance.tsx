import { css } from "emotion";
import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/esm/Button";
import { useHistory, useParams } from "react-router-dom";
import clipboardCloudLogo from "../assets/logo.png";
import { db } from "../services/firebase";
import { checkInstance } from "../utils/checkInstanceExists";
import { FileShare } from "./FileShare";
import { HintText } from "./styled-components/HintText";
import { TextShare } from "./TextShare";

export const CloudInstance = () => {
  const { id } = useParams<{ id: string }>();
  const [isValid, setIsValid] = useState(false);
  const history = useHistory();

  useEffect(() => {
    checkInstance(id)
      .then(() => setIsValid(true))
      .catch(() => {
        history.push("/");
      });
  }, [history, id]);

  const removeInstance = () => {
    db().ref(id).remove();
    history.goBack();
  };

  if (!isValid) return null;

  return (
    <div className={pageWrapper}>
      <header className={headerContainer}>
        <h1
          style={{ marginBottom: "2rem", fontSize: "2rem" }}
          onClick={() => history.push("/")}
          className={heading}
        >
          <img
            src={clipboardCloudLogo}
            alt="clipboard-cloud-logo"
            height="40"
            style={{ marginTop: -13 }}
          />
          Clipboard Cloud
        </h1>
        <div>
          <span style={{ fontSize: "1.5rem" }}>ID:</span>{" "}
          <span style={{ fontSize: "2rem", fontWeight: "bold" }}>{id}</span>
        </div>
        <HintText>
          Your unique ID to load this cloud again. Please copy this down
          somewhere.
        </HintText>
        <HintText>
          Or go to{" "}
          <a href={window.location.href} target="_blank" rel="noreferrer">
            {window.location.href}
          </a>{" "}
          on your target device browser to view your files/notes
        </HintText>
      </header>

      <div className={flexContainer}>
        <div className={contentContainer}>
          <section>
            <TextShare instanceId={id} />
          </section>
          <section>
            <FileShare instanceId={id} />
          </section>
        </div>
      </div>
      <div style={{ marginTop: "2rem" }}>
        <Button
          onClick={removeInstance}
          variant="link"
          style={{
            fontSize: "1rem",
            padding: 0,
            color: "red",
          }}
        >
          Delete Instance
        </Button>
        <HintText>
          Instances are automatically cleared within 3 days of inactivity.
        </HintText>
      </div>
    </div>
  );
};

const pageWrapper = css`
  margin: 2rem 4rem;
`;

const heading = css`
  &:hover {
    cursor: pointer;
  }
`;

const headerContainer = css`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const flexContainer = css`
  display: flex;
  justify-content: center;
  @media (max-width: 500px) {
    flex-direction: column;
  } ;
`;

const contentContainer = css`
  display: grid;
  grid-template-rows: 1fr;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  grid-gap: 4rem;
  width: 100%;
  max-width: 1800px;
  @media (max-width: 400px) {
    grid-template-columns: 1fr;
  } ;
`;
