import { useId, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ChatPage from './components/ChatPage';
import useIdStore from './zustand';
import { Link, Router, Route, Routes } from 'react-router-dom';
import MainSideDisplay from './components/MainSideDisplay';
import RegistrationForm from './components/RegistrationForm';
import LoginForm from './components/Login';
import Testing from './components/Testing';
import UserChats from './components/UserChats';
import Newgroup from './components/Newgroup';
import ProfileSettings from './components/Profile';
function App() {
  const [count, setCount] = useState(0);
  const [value, setValue] = useState("");

  const userId = useIdStore((state) => state.value);
  const setIdValue = useIdStore((state) => state.setIdValue);

  return (

    <Routes>
      <Route path="/" element={<MainSideDisplay />} />
      <Route path="/register" element={<RegistrationForm />} />
      <Route path='/login' element={<LoginForm />} />
      <Route path="/testing" element={<Testing />} />
      <Route path="/chat" element={<UserChats />} />
      <Route path="/newgroup" element={<Newgroup />} />
      <Route path='/profile' element={<ProfileSettings />} />
    </Routes>


  )
}

export default App
