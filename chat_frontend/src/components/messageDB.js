// indexedDB.js - Chat message storage functions

let db = null;

// Initialize IndexedDB
export const initDB = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('ChatDatabase', 1);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
            db = request.result;
            resolve(db);
        };

        request.onupgradeneeded = (event) => {
            db = event.target.result;

            // Create messages store
            if (!db.objectStoreNames.contains('messages')) {
                const messageStore = db.createObjectStore('messages', {
                    keyPath: 'id',
                    autoIncrement: true
                });
                // Index by contactId to get all messages for a specific contact
                messageStore.createIndex('contactId', 'contactId', { unique: false });
            }
        };
    });
};

// Save message to IndexedDB
export const saveChatMessage = async (messageData) => {

    return new Promise((resolve, reject) => {
        if (!db) {
            reject(new Error('Database not initialized'));
            return;
        }

        const transaction = db.transaction(['messages'], 'readwrite');
        const store = transaction.objectStore('messages');

        // Add message to store
        const request = store.add(messageData);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};

// Get all messages for a specific contact ID
export const getMessagesByContactId = (contactId) => {
    if(!contactId) return;
    return new Promise((resolve, reject) => {
        if (!db) {
            reject(new Error('Database not initialized'));
            return;
        }

        const transaction = db.transaction(['messages'], 'readonly');
        const store = transaction.objectStore('messages');
        const index = store.index('contactId');

        const request = index.getAll(contactId);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};

// Get all messages (optional - if you want all messages)
export const getAllMessages = () => {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject(new Error('Database not initialized'));
            return;
        }

        const transaction = db.transaction(['messages'], 'readonly');
        const store = transaction.objectStore('messages');

        const request = store.getAll();

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};

// Delete all messages for a contact (optional)
export const deleteMessagesByContactId = async (contactId) => {
    await initDB();
    return new Promise((resolve, reject) => {
        if (!db) {
            reject(new Error('Database not initialized'));
            return;
        }


        const transaction = db.transaction(['messages'], 'readwrite');
        const store = transaction.objectStore('messages');
        const index = store.index('contactId');

        const request = index.openCursor(contactId);

        request.onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
                cursor.delete();
                cursor.continue();
            } else {
                resolve();
            }
        };

        request.onerror = () => reject(request.error);
    });
};

export async function storeMessage(message) {
    await initDB();
    console.log("Database initialized");

    // normalize & validate fields
    let contactId = message.groupId == "na" ? message.senderId : message.groupId;

    const saving = {
        content: (message.content || "").trim(),
        groupId: (message.groupId || "").trim(),
        receiverId: (message.receiverId || "").trim(),
        senderId: (message.senderId || "").trim(),
        timestamp: message.timestamp || Date.now(),
        contactId: contactId,
    };

    await saveChatMessage(saving);
    console.log("Message saved successfully" + saving);

    return saving; 
}

// Usage example:
/*
// Initialize database first
initDB().then(() => {
  console.log('Database initialized');
  
  // Save a message
  const message = {
    content: "Nomoshkar",
    groupId: "",
    receiverId: "c727890a-93f1-44ba-ae03-08b02c9ef937",
    senderId: "a7f3ea23-19e9-486c-bc45-d90be1c9e763",
    timestamp: "2025-08-18T18:37:52.199Z",
    contactId: "ramu_id_abcszy" // This is the key field for grouping
  };
  
  saveMessage(message).then(() => {
    console.log('Message saved');
    
    // Get all messages for this contact
    getMessagesByContactId("ramu_id_abcszy").then(messages => {
      console.log('Messages from Ramu:', messages);
    });
  });
});
*/