import { css } from "emotion";
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

  const dbTextRef = useMemo(() => db().ref(instanceId).child("text"), [
    instanceId,
  ]);

  const loadDb = useCallback(() => {
    dbTextRef.once("value").then((snapshot) => {
      setTextVals(snapshot.val());
    });
  }, [dbTextRef]);

  useEffect(loadDb, []);

  const debounceUpdateDb = useCallback(
    debounce((nextVals: Array<string>) => {
      dbTextRef.set({ 0: nextVals[0], 1: nextVals[1], 2: nextVals[2] });
    }, 500),
    []
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
      {textVals.map((textVal, index) => {
        return (
          <textarea
            key={index}
            aria-label="text-share"
            className={textArea}
            value={textVal}
            onChange={(e) => handleTextChange(e, index)}
          />
        );
      })}
    </>
  );
};

const textArea = css`
  border: 2px solid ${colors.concrete};
  width: 100%;
  min-height: 300px;
  padding: 1rem;
  &:focus {
    outline: 2px solid ${colors.egyptianblue};
  }
  &:nth-child(2) {
    font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New",
      monospace;
  }
  &:last-child {
  }
`;
