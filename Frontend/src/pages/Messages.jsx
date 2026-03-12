import React, { useEffect, useState, useRef } from 'react';
import { io } from "socket.io-client";
import { Link, useNavigate } from 'react-router-dom';

function Messages() {
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [profile, setProfile] = useState(null);
  const socketRef = useRef();
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Parse user from local storage
    const userData = localStorage.getItem('etn_user');
    if (!userData) {
      navigate('/login');
      return;
    }
    setProfile(JSON.parse(userData));

    // Initialize Socket.IO connection
    // Ensure we connect to the backend server URL
    socketRef.current = io("http://localhost:5002");

    socketRef.current.on("connect", () => {
      console.log("Connected to socket server");
    });

    socketRef.current.on("receiveMessage", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [navigate]);

  useEffect(() => {
    // Auto scroll down to newest message
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (currentMessage.trim() === "") return;

    const msgData = {
      sender: profile?.email || "Unknown User",
      text: currentMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    socketRef.current.emit("sendMessage", msgData);
    setCurrentMessage("");
  };

  return (
    <div className="min-h-screen bg-etnBg text-etnDark flex flex-col">
      <nav className="bg-white shadow-sm px-8 py-4 flex justify-between items-center sticky top-0 z-10 w-full shrink-0">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-etnIndigo to-etnViolet">
          <Link to="/">ETN</Link>
        </h1>
        <div className="flex items-center gap-6">
          <Link to="/network" className="text-sm font-medium text-gray-700 hover:text-etnIndigo transition-colors">
            Talent Network
          </Link>
          <Link to="/" className="text-sm font-medium text-gray-700 hover:text-etnIndigo transition-colors">
            Dashboard
          </Link>
        </div>
      </nav>

      <div className="flex-1 p-8 max-w-4xl mx-auto w-full flex flex-col h-[calc(100vh-80px)]">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center shrink-0">
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-xl shadow-inner border border-white">
              🌍
            </div>
            <div className="ml-3">
              <h2 className="font-bold text-gray-800">Global Peer Chat</h2>
              <p className="text-xs text-green-500 font-medium">● Online</p>
            </div>
          </div>

          {/* Message List */}
          <div className="flex-1 p-6 overflow-y-auto bg-gray-[50] flex flex-col gap-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-400 my-auto pb-10">
                <svg className="w-16 h-16 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                <p>No messages yet. Say hello!</p>
              </div>
            ) : (
              messages.map((msg, index) => {
                const isMe = msg.sender === profile?.email;
                return (
                  <div key={index} className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] rounded-2xl px-5 py-3 shadow-sm ${isMe ? 'bg-etnIndigo text-white rounded-br-none' : 'bg-white border border-gray-100 text-gray-800 rounded-bl-none'}`}>
                       {!isMe && <div className="text-xs text-indigo-500 font-bold mb-1 ml-1">{msg.sender.split('@')[0]}</div>}
                       <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                       <div className={`text-[10px] text-right mt-1 ${isMe ? 'text-indigo-200' : 'text-gray-400'}`}>
                         {msg.timestamp}
                       </div>
                    </div>
                  </div>
                )
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-100 flex gap-3 items-center shrink-0">
            <input
              type="text"
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-gray-50 border border-gray-200 rounded-full py-3 px-5 focus:outline-none focus:ring-2 focus:ring-etnIndigo focus:border-etnIndigo transition-all text-sm"
            />
            <button 
              type="submit" 
              disabled={!currentMessage.trim()}
              className="bg-etnViolet text-white rounded-full p-3 hover:bg-etnIndigo disabled:opacity-50 transition-colors shadow-sm"
            >
              <svg className="w-5 h-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Messages;
