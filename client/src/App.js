
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Homepage from './Pages/Homepage/Homepage';
import Chats from './Pages/Chats/Chats';
function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Homepage/>} />
          <Route path='/chats' element={<Chats/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
