import { css, cx } from "emotion";
import React, { useEffect, useState } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useHistory } from "react-router-dom";
import clipboardCloudLogo from "../assets/logo.png";
import { db } from "../services/firebase";
import { checkInstanceExists } from "../utils/checkInstanceExists";
import { generateId } from "../utils/generateId";
import {
  addToLocalStorage,
  LOCAL_STORAGE_VISITED_KEY,
  removeFromLocalStorage,
} from "../utils/localStorageFunctions";
import { LastVisited } from "./LastVisited";

export const Home = () => {
  const history = useHistory();
  const [uniqId, setUniqId] = useState("");
  const [btnDisabled, setBtnDisabled] = useState(true);
  const [showErrAlert, setShowErrAlert] = useState(false);
  const [lastVisitedIds, setLastVisitedIds] = useState<Array<string>>([]);

  useEffect(() => {
    setLastVisitedIds(
      JSON.parse(localStorage.getItem(LOCAL_STORAGE_VISITED_KEY) || "[]")
    );
  }, []);

  const handleCreateInstance = () => {
    const id = generateId(6);
    db()
      .ref(id)
      .child("text")
      .once("value")
      .then(() => {
        db()
          .ref(id)
          .set({ text: { 0: "", 1: "", 2: "" } });
      })
      .then(() => {
        addToLocalStorage(id);
        history.push(`/${id}`);
      });
  };

  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUniqId(e.target.value);
    if (e.target.value.length === 6) {
      setBtnDisabled(false);
    } else {
      setBtnDisabled(true);
    }
  };

  const handleRemove = (id: string) => {
    removeFromLocalStorage(id);
    setLastVisitedIds(
      JSON.parse(localStorage.getItem(LOCAL_STORAGE_VISITED_KEY) || "[]")
    );
  };

  const handleSearchBtn = () => {
    setShowErrAlert(false);

    checkInstanceExists(uniqId)
      .then(() => {
        if (!lastVisitedIds.includes(uniqId)) {
          addToLocalStorage(uniqId);
        }
        history.push(`/${uniqId}`);
      })
      .catch(() => setShowErrAlert(true));
  };

  return (
    <main className={container}>
      <header className={header}>
        <img src={clipboardCloudLogo} alt="clipboard-cloud-logo" height="80" />
        <h1>Clipboard Cloud</h1>
        <div style={{ padding: "0 20px" }}>
          <p style={{ textAlign: "center" }}>
            Easy and quick way to share text or files across any device.
          </p>
        </div>
      </header>
      <Button
        variant="dark"
        size="lg"
        className={createBtn}
        onClick={handleCreateInstance}
      >
        Create new instance
      </Button>

      <div className={inputWrapper}>
        <Form.Control
          type="text"
          size="lg"
          value={uniqId}
          placeholder="Unique ID"
          onChange={handleIdChange}
          className={idInput}
          maxLength={6}
        />
        <Button
          variant="dark"
          size="lg"
          onClick={handleSearchBtn}
          className={searchBtn}
          disabled={btnDisabled}
        >
          Load
        </Button>
      </div>

      <Alert
        className={cx(
          { [errorAlertShow]: showErrAlert },
          { [errorAlertHide]: !showErrAlert }
        )}
        variant="danger"
      >
        This ID is not valid.
      </Alert>

      {lastVisitedIds.length > 0 ? (
        <LastVisited items={lastVisitedIds} onRemove={handleRemove} />
      ) : null}
    </main>
  );
};

const header = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 5rem;
`;

const createBtn = css`
  font-weight: bold;
  width: 100%;
  max-width: 300px;
  margin-bottom: 1rem;
`;

const container = css`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100vh;
`;

const inputWrapper = css`
  width: 100%;
  max-width: 300px;
  margin: 1rem 0;
  display: flex;
`;

const idInput = css`
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0ex;
`;

const searchBtn = css`
  border-top-left-radius: 0px;
  border-bottom-left-radius: 0px;
  &:disabled:hover {
    cursor: not-allowed;
  }
`;

const errorAlertShow = css``;

const errorAlertHide = css`
  opacity: 0;
  cursor: none;
`;
