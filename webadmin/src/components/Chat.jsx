import React, { useState, useEffect, useRef } from "react";
import socketIOClient from "socket.io-client";
import './Chat.css';

function Chat(props) {
    console.log(props);
    const host = "http://localhost:3001";
    const [id, setId] = useState('');
    const [da, setData] = useState();
    const socketRef = useRef();


    useEffect(() => {
        socketRef.current = socketIOClient.connect(host)
        socketRef.current.emit('admin-get-context', props.idadmin);
        socketRef.current.on('admin_data_context', data => {
            if (data.status == "true") {
                setData(data.data);
                console.log(da);
            }
        })

        return () => {
            socketRef.current.disconnect();
        };
    }, []);

    const logout = async () => {
        localStorage.setItem('username', 'false');
        window.location.reload();
    }

    

    const renderContext =da ? da.map((data)=>
        <button className="button1" key= {data._id} onClick = {()=>{setId(data._id); console.log(id)}}>Name <br></br>context</button>
         ) : undefined  ;
    


    return (
        <div className="chat-body">
            <div className="chat-context">
                <div className="chat-title"> Admin
                    <button onClick={logout}>
                        Logout
                    </button>
                </div>
                {renderContext}
            </div>
            <div className="chat-mess">
            </div>
        </div>
    )
}

export default Chat