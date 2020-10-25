import { css, cx } from "emotion";
import produce from "immer";
import { debounce } from "lodash-es";
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { db } from "../services/firebase";
import { colors } from "../style-variables";

interface Props {
  instanceId: string;
}

export const TextShare: FunctionComponent<Props> = ({ instanceId }) => {
  const [textVals, setTextVals] = useState<Array<string>>([]);
  const [visibleTextArea, setVisibleTextArea] = useState<0 | 1 | 2>(0);
  const [
    dbTextRef,
    setDbTextRef,
  ] = useState<firebase.database.Reference | null>(null);

  const loadDb = useCallback(() => {
    const dbTextRef = db().ref(instanceId).child("text");
    setDbTextRef(dbTextRef);

    dbTextRef!.once("value").then((snapshot) => {
      if (snapshot.val() === null) {
        db()
          .ref(instanceId)
          .set({ text: { 0: "", 1: "", 2: "" } });
        setTextVals(["", "", ""]);
      } else {
        setTextVals(snapshot.val());
      }
    });
  }, [instanceId]);

  useEffect(loadDb, [loadDb]);

  const debounceUpdateDb = useMemo(
    () =>
      debounce((nextVals: Array<string>) => {
        dbTextRef!.set({ 0: nextVals[0], 1: nextVals[1], 2: nextVals[2] });
      }, 500),
    [dbTextRef]
  );

  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>, index: number) => {
      const inputVal = e.target.value;

      const newVals = produce(textVals, (nextVals) => {
        nextVals[index] = inputVal;
        return nextVals;
      });

      setTextVals(newVals);

      debounceUpdateDb(newVals);
    },
    [debounceUpdateDb, textVals]
  );

  return (
    <>
      <h5 className={heading}>Text</h5>
      <div className={btnContainer}>
        <button
          className={cx(tabBtn, { [tabBtnSelected]: visibleTextArea === 0 })}
          onClick={() => setVisibleTextArea(0)}
        >
          Text Note 1
        </button>
        <button
          className={cx(tabBtn, { [tabBtnSelected]: visibleTextArea === 1 })}
          onClick={() => setVisibleTextArea(1)}
        >
          Text Note 2
        </button>
        <button
          className={cx(tabBtn, { [tabBtnSelected]: visibleTextArea === 2 })}
          onClick={() => setVisibleTextArea(2)}
        >
          Code Note
        </button>
      </div>
      {textVals.map((textVal, index) => {
        return (
          <textarea
            key={index}
            aria-label="text-share"
            className={textArea}
            value={textVal}
            onChange={(e) => handleTextChange(e, index)}
            style={{
              display: `${index === visibleTextArea ? "block" : "none"}`,
            }}
          />
        );
      })}
    </>
  );
};

const heading = css`
  font-weight: bold;
  margin-bottom: 10px;
  margin-top: 5px;
`;

const tabBtn = css`
  border-radius: 0px;
  margin-right: 1rem;
  background-color: transparent;
  color: ${colors.gray1};
  font-weight: bold;
  border: none;
  &:last-child {
    margin-right: none;
  }
  &:focus {
    outline: none;
  }
  &:hover {
    cursor: pointer;
  }
`;

const tabBtnSelected = css`
  color: ${colors.blue1};
  padding: 5px;
  border-bottom: 2px solid ${colors.blue1};
`;

const btnContainer = css`
  display: flex;
  margin-bottom: 1rem;
`;

const textArea = css`
  border: 2px solid ${colors.bordergray};
  width: 100%;
  min-height: 300px;
  padding: 1rem;
  margin-top: 4px;
  &:focus {
    outline: 2px solid ${colors.blue1};
  }
  &:nth-child(2) {
  }
  &:last-child {
    font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New",
      monospace;
  }
`;
