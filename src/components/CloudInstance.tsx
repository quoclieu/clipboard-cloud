import { css } from "emotion";
import { storage } from "firebase";
import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/esm/Button";
import { useHistory, useParams } from "react-router-dom";
import clipboardCloudLogo from "../assets/logo.png";
import { db } from "../services/firebase";
import { checkInstanceExists } from "../utils/checkInstanceExists";
import { removeFromLocalStorage } from "../utils/localStorageFunctions";
import { FileShare } from "./FileShare";
import { HintText } from "./styled-components/HintText";
import { TextShare } from "./TextShare";

export const CloudInstance = () => {
  const { id } = useParams<{ id: string }>();
  const [isValid, setIsValid] = useState(false);
  const history = useHistory();

  useEffect(() => {
    checkInstanceExists(id)
      .then(() => setIsValid(true))
      .catch(() => {
        history.push("/");
      });
  }, [history, id]);

  const removeInstance = () => {
    // delete all notes for this id in firebase db
    db().ref(id).remove();
    // delete all images for this id in firebase storage
    storage()
      .ref()
      .child(id)
      .listAll()
      .then((res) => {
        res.items.forEach(function (itemRef) {
          itemRef.delete();
        });
      });

    // remove this id from last viewed
    removeFromLocalStorage(id);
    history.push("/");
  };

  if (!isValid) return null;

  return (
    <div className={pageWrapper}>
      <header className={headerContainer}>
        <h1 onClick={() => history.push("/")} className={heading}>
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
  margin-bottom: 2rem;
  font-size: 2rem;
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
