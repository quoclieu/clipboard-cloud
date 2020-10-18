import { css, cx } from "emotion";
import React, { useState } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useHistory } from "react-router-dom";
import { db } from "../services/firebase";
import { generateId } from "../utils/generateId";

export const Home = () => {
  const history = useHistory();
  const [uniqId, setUniqId] = useState("");
  const [btnDisabled, setBtnDisabled] = useState(true);
  const [showErrAlert, setShowErrAlert] = useState(false);

  const handleCreateInstance = () => {
    const id = generateId(6);
    history.push(`/${id}`);
  };

  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUniqId(e.target.value);
    if (e.target.value.length === 6) {
      setBtnDisabled(false);
    } else {
      setBtnDisabled(true);
    }
  };

  const handleSearchBtn = () => {
    setShowErrAlert(false);
    db()
      .ref(uniqId)
      .once("value")
      .then((snapshot) => {
        if (snapshot.val() !== null) {
          history.push(`/${uniqId}`);
        } else {
          setShowErrAlert(true);
        }
      })
      .catch((err) => setShowErrAlert(true));
  };

  return (
    <div className={container}>
      <h1>File Cloud</h1>
      <Button size="lg" className={createBtn} onClick={handleCreateInstance}>
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
    </div>
  );
};

const createBtn = css`
  width: 100%;
  max-width: 300px;
  margin: 1rem 0;
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
