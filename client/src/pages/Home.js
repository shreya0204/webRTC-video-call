import React, { useCallback, useEffect, useState } from 'react';
import { useSocket } from '../providers/Socket';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const { socket } = useSocket();
    const navigate = useNavigate();
    const [email, setEmail] = useState();
    const [roomId, setRoomId] = useState();


    const handleRoomJoined = useCallback(({ roomId }) => {
        navigate(`/room/${roomId}`);
    }, [navigate]);

    useEffect(() => {
        socket.on("joined-room", handleRoomJoined);

        return () => {
            socket.off("joined-room", handleRoomJoined);
        }
    }, [handleRoomJoined, socket]);

    const handleJoinRoom = () => {
        socket.emit("join-room", { roomId: roomId, emailId: email });
    }


    return (
        <div className='home_container'>
            <div className='home_input__container'>
                <input value={email} type="email" placeholder="Enter your email address" onChange={e => setEmail(e.target.value)} />
                <input value={roomId} type="text" placeholder="Enter room code" onChange={e => setRoomId(e.target.value)} />
                <button className='home_enter_button' onClick={handleJoinRoom}>Enter Room</button>
            </div>
        </div>
    );
}

export default Home;