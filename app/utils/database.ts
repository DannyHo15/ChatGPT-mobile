import { SQLiteDatabase } from 'expo-sqlite/next';
import { Sender, TChat, TMessageData } from './models';
export async function migrateDbIfNeeded(db: SQLiteDatabase) {
  const DATABASE_VERSION = 1;
  let result = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');

  let currentDbVersion = result?.user_version ?? 0; if (currentDbVersion >= DATABASE_VERSION) {
    return;
  }
  if (currentDbVersion === 0) {
    await db.execAsync(`
PRAGMA journal_mode = 'wal';
CREATE TABLE IF NOT EXISTS chats
(
  id INTEGER PRIMARY KEY NOT NULL,
  title TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS messages(
id INTEGER PRIMARY KEY NOT NULL,
chatId INTEGER NOT NULL,
content TEXT NOT NULL,
imageUrl TEXT,
role TEXT,
prompt TEXT,
FOREIGN KEY (chatId) REFERENCES chats(id) ON DELETE CASCADE
);
`);
    currentDbVersion = 1;
    await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
  }
  // if (currentDbVersion === 1) {
  //   Add more migrations
  // }
  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}

export const addChats = async (db: SQLiteDatabase, title: string) => {
  return await db.runAsync('INSERT INTO chats (title) VALUES (?)', title);
}

export const getChats = async (db: SQLiteDatabase) => {
  return await db.getAllAsync<TChat>('SELECT * FROM chats');
}

export const getMessages = async (db: SQLiteDatabase, chatId: number): Promise<TMessageData[]> => {
  return (await db.getAllAsync<TMessageData>('SELECT * FROM messages WHERE chatId = ?', chatId)).map((message) => {
    return {
      ...message,
      role: message.role === 'user' ? Sender.User : Sender.Bot
    }
  });
}

export const deleteMessages = async (db: SQLiteDatabase, chatId: number) => {
  await db.runAsync('DELETE FROM messages');
}


export const addMessage = async (db: SQLiteDatabase, chatId: number, { content, imageUrl, prompt, role }: TMessageData) => {
  imageUrl = imageUrl ?? '';
  prompt = prompt ?? '';
  await db.runAsync('INSERT INTO messages (chatId, content, imageUrl, role, prompt) VALUES (?, ?, ?, ?, ?)', chatId, content, imageUrl = imageUrl ?? '', role, prompt ?? '');
}


export const deleteChat = async (db: SQLiteDatabase, chatId: number) => {
  await db.runAsync('DELETE FROM messages WHERE chatId = ?', chatId);
  await db.runAsync('DELETE FROM chats WHERE id = ?', chatId);
}

export const renameChat = async (db: SQLiteDatabase, chatId: number, title: string) => {
  await db.runAsync('UPDATE chats SET title = ? WHERE id = ?', title, chatId);
}
