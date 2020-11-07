import { db } from "../services/firebase";

export const checkInstance = (uniqId: string) => {
  return db()
    .ref(uniqId)
    .once("value")
    .then((snapshot) => {
      if (snapshot.val() !== null) {
        return Promise.resolve(snapshot);
      } else {
        return Promise.reject();
      }
    });
};
