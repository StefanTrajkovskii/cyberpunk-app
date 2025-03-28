export const getUserStorageKey = (username: string, key: string): string => {
  return `${username}_${key}`;
};

export const setUserData = (username: string, key: string, data: any): void => {
  const storageKey = getUserStorageKey(username, key);
  localStorage.setItem(storageKey, JSON.stringify(data));
};

export const getUserData = (username: string, key: string): any => {
  const storageKey = getUserStorageKey(username, key);
  const data = localStorage.getItem(storageKey);
  return data ? JSON.parse(data) : null;
};

export const clearUserData = (username: string, key: string): void => {
  const storageKey = getUserStorageKey(username, key);
  localStorage.removeItem(storageKey);
};

export const clearAllUserData = (username: string): void => {
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith(`${username}_`)) {
      localStorage.removeItem(key);
    }
  });
}; 