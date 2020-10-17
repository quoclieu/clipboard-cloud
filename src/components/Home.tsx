import { css } from "emotion";
import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useHistory } from "react-router-dom";

const createUniqueId = () => {
  return 123;
};

export const Home = () => {
  const history = useHistory();

  const handleCreateInstance = () => {
    const id = createUniqueId();
    history.push(`/${id}`);
  };

  return (
    <div className={container}>
      <h1>File Cloud</h1>
      <Button size="lg" className={btnStyling} onClick={handleCreateInstance}>
        Create new instance
      </Button>
      <div className={inputWrapper}>
        <Form.Control type="text" size="lg" placeholder="Unique ID" />
      </div>
    </div>
  );
};

const btnStyling = css`
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
`;
