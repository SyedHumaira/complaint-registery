// File: complaint-registery/frontend/src/components/common/ChatWindow.jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

// Replace with your backend address
const socket = io("http://localhost:8000");

const ChatWindow = ({ complaintId, name }) => {
  const [messageInput, setMessageInput] = useState('');
  const [messageList, setMessageList] = useState([]);
  const messageWindowRef = useRef(null);

  // Fetch messages initially
  useEffect(() => {
    fetchMessages();
  }, [complaintId]);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/messages/${complaintId}`);
      setMessageList(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  // Scroll to bottom whenever message list changes
  useEffect(() => {
    scrollToBottom();
  }, [messageList]);

  // Socket.IO - receive real-time messages
  useEffect(() => {
    socket.on("receiveMessage", (msg) => {
      if (msg.complaintId === complaintId) {
        setMessageList((prev) => [...prev, msg]);
      }
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [complaintId]);

  const sendMessage = async () => {
    if (!messageInput.trim()) return;

    const newMessage = {
      name,
      message: messageInput,
      complaintId,
    };

    try {
      const response = await axios.post("http://localhost:8000/messages", newMessage);
      socket.emit("sendMessage", response.data); // emit to others
      setMessageInput('');
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const scrollToBottom = () => {
    if (messageWindowRef.current) {
      messageWindowRef.current.scrollTop = messageWindowRef.current.scrollHeight;
    }
  };

  return (
    <div className="chat-container">
      <h6>Message Box</h6>
      <div className="message-window" ref={messageWindowRef} style={{ height: "200px", overflowY: "auto", background: "#f8f9fa", padding: "10px" }}>
        {messageList.map((msg) => (
          <div key={msg._id} className="message mb-2">
            <strong>{msg.name}:</strong> {msg.message}
            <div style={{ fontSize: '0.7em', color: 'gray' }}>
              {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        ))}
      </div>
      <div className="input-container mt-2 d-flex">
        <textarea
          className="form-control"
          rows="1"
          placeholder="Type message..."
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
        />
        <button className="btn btn-success ms-2" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
