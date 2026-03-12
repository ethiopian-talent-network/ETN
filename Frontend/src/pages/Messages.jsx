import React, { useEffect, useState, useRef } from 'react';
import { io } from "socket.io-client";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

function Messages() {
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [profile, setProfile] = useState(null);
  
  const [connections, setConnections] = useState([]);
  const [activePeer, setActivePeer] = useState(null);

  const socketRef = useRef();
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const { state } = useLocation();

  useEffect(() => {
    // 1. Get user and initialize component
    const initializeChat = async () => {
      const token = localStorage.getItem('etn_token');
      const u = localStorage.getItem('etn_user');
      if (!token || !u) {
        navigate('/login');
        return;
      }

      // decode token simply to get user id would be ideal, going to fetch profile to be sure.
      let fetchedProfile;
      try {
         const res = await axios.get('http://localhost:5002/api/users/profile', { headers: { Authorization: `Bearer ${token}` } });
         fetchedProfile = res.data.data;
         setProfile(fetchedProfile);
      } catch (e) {
         navigate('/login'); return;
      }

      // Fetch connections to show on sidebar
      try {
         const connRes = await axios.get('http://localhost:5002/api/network/connections', { headers: { Authorization: `Bearer ${token}` } });
         setConnections(connRes.data.data);
      } catch (e) { console.error(e) }

      // 2. Setup Sockets
      socketRef.current = io("http://localhost:5002");
      socketRef.current.on("connect", () => {
         socketRef.current.emit("join", fetchedProfile._id);
      });

      socketRef.current.on("receiveMessage", (msgData) => {
         setMessages((prev) => [...prev, msgData]);
      });
    };

    initializeChat();

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [navigate]);

  // Load history when clicking a peer or navigated with state
  useEffect(() => {
     if (state?.peerId && connections.find(c => c._id === state.peerId)) {
        setActivePeer({ _id: state.peerId, fullName: state.peerName });
     }
  }, [state, connections]);

  useEffect(() => {
     if (activePeer && profile) {
        // Fetch old messages
        const fetchHistory = async () => {
           try {
              const token = localStorage.getItem('etn_token');
              const res = await axios.get(`http://localhost:5002/api/messages/${activePeer._id}`, { headers: { Authorization: `Bearer ${token}` } });
              setMessages(res.data.data);
           } catch(e) { console.log(e); }
        };
        fetchHistory();
     }
  }, [activePeer, profile]);


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (currentMessage.trim() === "" || !activePeer) return;

    const msgData = {
      sender: profile._id,
      receiver: activePeer._id,
      text: currentMessage,
    };

    socketRef.current.emit("sendMessage", msgData);
    setCurrentMessage("");
  };

  return (
    <div className="h-screen bg-etnLight text-gray-800 flex flex-col font-sans">
      <nav className="bg-white px-8 py-3 flex justify-between items-center z-10 shadow-sm shrink-0">
        <h1 className="text-xl font-black text-etnNavy tracking-tight">
          <Link to="/">ETN Messaging</Link>
        </h1>
        <Link to="/network" className="text-sm font-semibold text-gray-500 hover:text-etnNavy">Back to Network</Link>
      </nav>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 bg-white border-r border-gray-100 flex flex-col">
           <div className="p-4 border-b border-gray-100 bg-gray-50">
             <h2 className="font-bold text-gray-700">Your Connections</h2>
           </div>
           <div className="flex-1 overflow-y-auto w-full">
             {connections.length === 0 ? (
               <p className="text-xs text-gray-400 p-4 text-center">Connect with peers in Network to chat.</p>
             ) : (
               connections.map(c => (
                 <div 
                   key={c._id} 
                   onClick={() => setActivePeer(c)}
                   className={`p-4 border-b border-gray-50 cursor-pointer transition-colors flex items-center gap-3 ${activePeer?._id === c._id ? 'bg-indigo-50/50 border-l-4 border-l-etnNavy' : 'hover:bg-gray-50 border-l-4 border-l-transparent'}`}
                 >
                   <div className="w-10 h-10 rounded-full bg-etnNavy text-white flex items-center justify-center font-bold">{c.fullName ? c.fullName[0] : 'U'}</div>
                   <div>
                     <h4 className="font-bold text-sm text-gray-800">{c.fullName}</h4>
                     <p className="text-xs text-gray-500 truncate w-40">{c.email}</p>
                   </div>
                 </div>
               ))
             )}
           </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 bg-gray-50 flex flex-col relative w-full h-full">
          {!activePeer ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
               <svg className="w-16 h-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
               <h3 className="text-xl font-bold text-gray-500 mb-1">Your Messages</h3>
               <p className="text-sm">Select a connection to start messaging</p>
            </div>
          ) : (
             <>
               {/* Chat Header */}
               <div className="p-4 bg-white border-b border-gray-100 flex items-center justify-between shadow-sm shrink-0">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-etnGreen text-white flex items-center justify-center font-bold">
                       {activePeer.fullName ? activePeer.fullName[0] : 'U'}
                     </div>
                     <div>
                       <h3 className="font-bold text-gray-900">{activePeer.fullName}</h3>
                       <p className="text-xs text-green-500 font-bold">• Online</p>
                     </div>
                  </div>
               </div>

               {/* Messages */}
               <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-4">
                  {messages.filter(m => (m.sender === profile._id && m.receiver === activePeer._id) || (m.sender === activePeer._id && m.receiver === profile._id)).map((msg, idx) => {
                     const isMe = msg.sender === profile._id;
                     return (
                      <div key={idx} className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[75%] rounded-2xl px-5 py-3 shadow-sm ${isMe ? 'bg-etnNavy text-white rounded-br-none' : 'bg-white border border-gray-100 text-gray-800 rounded-bl-none'}`}>
                           <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                        </div>
                      </div>
                     )
                  })}
                  <div ref={messagesEndRef} />
               </div>

               {/* Input */}
               <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-100 flex gap-3 shrink-0">
                  <input
                    type="text"
                    value={currentMessage}
                    onChange={e => setCurrentMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-full py-3 px-5 focus:outline-none focus:ring-2 focus:ring-etnNavy transition-all text-sm h-12"
                  />
                  <button type="submit" disabled={!currentMessage.trim()} className="h-12 w-12 rounded-full bg-etnGreen text-white hover:bg-green-600 disabled:opacity-50 transition-colors flex items-center justify-center shadow-sm">
                    <svg className="w-5 h-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                  </button>
               </form>
             </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Messages;
