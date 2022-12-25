
import React, { useState, useEffect, useRef } from "react";
import socketIOClient from "socket.io-client";
import '../public/css/bootstrap.min.css'
import '../public/css/fontawesome.min.css'
import '../public/css/templatemo-style.css'
import '../public/js/bootstrap.js'

function LoginForm()
{
    const host = "http://localhost:3000";
    const [ username, setUsername ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ error, setError ] = useState('');
    const [id, setId] = useState();

    const socketRef = useRef();

    useEffect(() => {
        socketRef.current = socketIOClient.connect(host)
        socketRef.current.on('admin_login_emit',data => {
            console.log("hello"+data.status);
            if(data.status =="true")
            {
                console.log(data.user_name);
                setId(data.user_name)
                localStorage.setItem('username', data.user_name);
                setError('');
                window.location.reload();
            }
        }) 
    
        return () => {
          socketRef.current.disconnect();
        };
      }, []);

    const handleSubmit = async(e) =>
    {
        e.preventDefault();
        try
        {
                socketRef.current.emit('adminLogin', username, password);
                setUsername('');
                setPassword('');
            setError('');
        } catch (error) {
            setError('Oops,incorrect credencials');
        }
        finally {
            
        }
        
    }
  return (
      <div className='wrapper'>
          <div className='form'>
              <h1 className='title'>Admin Chatbot</h1>
              <form onSubmit={handleSubmit}>
                  <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className='input' placeholder='Username' required />
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className='input' placeholder='Password' required />
                  <div align='center'>
                      <button type='submit' className='button'>
                          <span>Start</span>
                      </button>
                  </div>
              </form>
               <h2>{error}</h2>
          </div>  
      </div>
  )
}

export default LoginForm