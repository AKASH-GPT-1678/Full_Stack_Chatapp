import { useId, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ChatPage from './components/ChatPage';
import useIdStore from './zustand';

function App() {
  const [count, setCount] = useState(0);
  const [value , setValue] = useState("");

  const userId = useIdStore((state) => state.value);
  const setIdValue = useIdStore((state) => state.setIdValue);

  return (
    <>
    <ChatPage/>

    <div>
      <input type="text"  onChange={(e)=> setValue(e.target.value)}/>
      <button onClick={setIdValue(value)}>add Value</button>
      <h1>{userId}</h1>
    </div> 
    
    </>
  )
}

export default App
