export const LOCAL_STORAGE_VISITED_KEY = "visited";

export const addToLocalStorage = (id: string) => {
  const ids = JSON.parse(
    localStorage.getItem(LOCAL_STORAGE_VISITED_KEY) || "[]"
  );
  ids.push(id);
  localStorage.setItem(LOCAL_STORAGE_VISITED_KEY, JSON.stringify(ids));
};

export const removeFromLocalStorage = (id: string) => {
  const ids = JSON.parse(
    localStorage.getItem(LOCAL_STORAGE_VISITED_KEY) || "[]"
  ).filter((item: string) => item !== id);

  localStorage.setItem(LOCAL_STORAGE_VISITED_KEY, JSON.stringify(ids));
};
