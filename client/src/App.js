import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import './App.css'
import { SocketProvider } from './providers/Socket';
import RoomPage from './pages/Room';
import { PeerProvider } from './providers/Peers';

function App() {
  return (
    <div>
      <SocketProvider>
        <PeerProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/room/:roomId" element={<RoomPage />} />
          </Routes>
        </PeerProvider>
      </SocketProvider>
    </div >
  );
}

export default App;
