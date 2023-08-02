
import './App.css';
import {Routes, Route } from 'react-router-dom';
import Homepage from './Pages/Homepage/Homepage';
import Chats from './Pages/Chats/Chats';
import ChatProvider from './context/chatProvider';
function App() {
  return (
    <div className="app">
      <ChatProvider>
        <Routes>
          <Route path='/' element={<Homepage/>} />
          <Route path='/chats' element={<Chats/>} />
        </Routes>
      </ChatProvider>
    </div>
  );
}

export default App;
