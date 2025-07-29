import { useId, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ChatPage from './components/ChatPage';
import useIdStore from './zustand';
import { Link, Router, Route } from 'react-router-dom';
import MainSideDisplay from './components/MainSideDisplay';
function App() {
  const [count, setCount] = useState(0);
  const [value, setValue] = useState("");

  const userId = useIdStore((state) => state.value);
  const setIdValue = useIdStore((state) => state.setIdValue);

  return (
    <>



      <div>
        <MainSideDisplay />


      </div>

    </>
  )
}

export default App
