import React from 'react';
import { ChatEngine} from 'react-chat-engine';
import './App.css';
import Chat from './components/Chat';
import LoginForm from './components/LoginForm';
function App()
{
    if (!localStorage.getItem('username') || localStorage.getItem('username')== undefined || 
    localStorage.getItem('username') == 'false') return <LoginForm />;
    return (
      <Chat idadmin = "6374fedad36a12dad2ba4b56"/>
          )
}

export default App