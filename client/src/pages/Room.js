import React, { useCallback, useEffect, useState } from 'react';
import { useSocket } from '../providers/Socket';
import { usePeer } from '../providers/Peers';
import ReactPlayer from "react-player";

const RoomPage = () => {
    const { socket } = useSocket();
    const { peer, createOffer, createAnswer, setRemoteAns, sendStream, remoteStream } = usePeer();
    const [myStream, setMyStream] = useState(null);


    const handleNewUserJoined = useCallback(
        async (data) => {
            const { emailId } = data;
            console.log("New user joined with email " + emailId);
            const offer = await createOffer();
            socket.emit("call-user", { emailId, offer });
        },
        [createOffer, socket]
    );

    const handleIncomingCall = useCallback(async (data) => {
        const { from, offer } = data;
        console.log("Incoming call from " + from + " to " + offer);
        const ans = await createAnswer(offer);
        socket.emit("call-accepted", { emailId: from, ans })
    }, [createAnswer, socket]);

    const handleCallAccepted = useCallback(async (data) => {
        const { ans } = data;
        console.log("Call Got accepted ", ans);
        await setRemoteAns(ans);
    }, [setRemoteAns]);

    const getUserMediaStream = useCallback(async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setMyStream(stream);
    }, []);

    useEffect(() => {
        socket.on("user-joined", handleNewUserJoined);
        socket.on("incoming-call", handleIncomingCall);
        socket.on("call-accepted", handleCallAccepted);


        return () => {
            socket.off("user-joined", handleNewUserJoined);
            socket.off("incoming-call", handleIncomingCall);
            socket.off("call-accepted", handleCallAccepted);
        }
    }, [handleCallAccepted, handleIncomingCall, handleNewUserJoined, socket])


    useEffect(() => {
        getUserMediaStream();
    }, [getUserMediaStream])

    return (
        <div>
            <h1>Room Page</h1>
            <button onClick={e => sendStream(myStream)}>Send My Video</button>
            <ReactPlayer url={myStream} playing muted />
            <ReactPlayer url={remoteStream} playing />
        </div >
    )
}

export default RoomPage;