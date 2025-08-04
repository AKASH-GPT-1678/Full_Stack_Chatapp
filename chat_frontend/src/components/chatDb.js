const DB_NAME = "chatbase";
const STORE_NAME = "messages";
const DB_VERSION = 1;

export function openChatDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);

    request.onupgradeneeded = () => {
      const db = request.result;
      const store = db.createObjectStore(STORE_NAME, {
        keyPath: "id",
      });
      store.createIndex("senderId", "senderId", { unique: false });
      store.createIndex("timestamp", "timestamp", { unique: false });
    };

    request.onsuccess = () => resolve(request.result);
  });
}

export async function saveMessage(message) {
  const db = await openChatDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);
  const request = store.add(message);

  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function getMessagesByReceiverId(receiverId) {
  const db = await openChatDB();
  const tx = db.transaction(STORE_NAME, "readonly");
  const store = tx.objectStore(STORE_NAME);
  const index = store.index("senderId");

  const messages = [];

  return new Promise((resolve, reject) => {
    const cursorReq = index.openCursor(receiverId, "next"); // "next" to keep order

    cursorReq.onsuccess = () => {
      const cursor = cursorReq.result;
      if (cursor) {
        messages.push(cursor.value);
        cursor.continue(); // keep going until end
        console.log(" i am mesg", messages);
      } else {
        resolve(messages); // all messages done
        console.log("i am db", messages);
      }
    };

    cursorReq.onerror = () => reject(cursorReq.error);
  });
}
