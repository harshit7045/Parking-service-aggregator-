import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import BasicPie from "./piechart.jsx";
import Cookies from "js-cookie";

// Initialize the socket connection
//const socket = io("http://localhost:9000", { transports: ['websocket'] });

export default function BooklotPopup() {
    const [serverMessage, setServerMessage] = useState("");

    useEffect(() => {
        const ownerToken = Cookies.get("ownertoken");
    
        if (ownerToken) {
            const socket = io('http://localhost:9000');  // Ensure the correct server URL
    
            socket.on('connect', () => {
                console.log('Connected to backend, Socket ID:', socket.id);
                console.log("Owner Token:", ownerToken);
    
                // Emit 'userConnected' event with ownerToken and socketId
                socket.emit("userConnected", { ownerToken, socketId: socket.id });
                console.log("userConnected event emitted");
            });
             socket.on('lotData', (data) => {
                 //console.log(data);
                 setServerMessage(data);
             })
            return () => {
                socket.disconnect();
            };
        } else {
            console.error("No ownerToken found in cookies");
        }
    }, []);
    
    return (
        <div className="h-[50vh] w-[50vw]">
            <BasicPie serverMessage={serverMessage} />
            
        </div>
    );
}
