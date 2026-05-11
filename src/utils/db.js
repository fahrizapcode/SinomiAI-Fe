import { openDB } from 'idb';

const DB_NAME = 'SinomiAIDB';
const STORE_NAME = 'scanHistory';

export const initDB = async () => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    },
  });
};

export const addHistory = async (record) => {
  const db = await initDB();
  return db.add(STORE_NAME, { ...record, date: new Date().toISOString() });
};

export const getAllHistory = async () => {
  const db = await initDB();
  return db.getAll(STORE_NAME);
};

export const deleteHistory = async (id) => {
  const db = await initDB();
  return db.delete(STORE_NAME, id);
};
