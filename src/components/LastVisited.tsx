import { css } from "emotion";
import React, { FunctionComponent } from "react";
import Button from "react-bootstrap/esm/Button";
import { TiDelete } from "react-icons/ti";
import { Link } from "react-router-dom";
import { colors } from "../style-variables";

interface Props {
  items: Array<string>;
  onRemove: (id: string) => void;
}

export const LastVisited: FunctionComponent<Props> = ({ items, onRemove }) => {
  return (
    <div className={container}>
      <p>Last viewed</p>
      <ul className={listContainer}>
        {items.map((id) => {
          return (
            <li key={id} className={item}>
              <Link to={`/${id}`}>{id}</Link>
              <Button
                variant="link"
                style={{
                  color: colors.gray,
                  padding: 0,
                  fontSize: "1.5rem",
                  marginBottom: "5px",
                  marginLeft: "10px",
                }}
                onClick={() => onRemove(id)}
              >
                <TiDelete />
              </Button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

const container = css`
  text-align: left;
  min-width: 300px;
`;

const listContainer = css`
  margin: 0;
  padding: 0;
  list-style-type: none;
  text-align: left;
`;

const item = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
