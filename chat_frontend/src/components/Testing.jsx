import React from 'react'
import { data } from 'react-router-dom';
import { da } from 'zod/v4/locales';

const Testing = () => {
    const database = indexedDB.open('chatbase', 1);
     database.onerror = function (event) {
         alert('Database error: ' + event.target.error.message);
     };

     database.onsuccess = function (event) {
         const db = event.target.result;
         alert('Database opened successfully');
         console.log("Database opened successfully");
     };
  return (
    <div>
        <h1>testing</h1>

        <button onClick={database}>Save test</button>
        <button>Get test</button>
      
    </div>
  )
}

export default Testing;
