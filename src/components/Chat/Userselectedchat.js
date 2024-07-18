import React, { useState, useEffect ,useRef} from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { ref, getDownloadURL, listAll } from "firebase/storage";
import { useParams } from "react-router-dom";
import { storage } from "../../firebase";
import './Chat.css';

const socket = io('https://chatsocketv2-latest.onrender.com');

const Chat = ({ loggedInUserId ,friendUserId}) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const ele = useRef(null);
//   const { friendUserId } = useParams();
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [profileImageUrlf, setProfileImageUrlf] = useState(null);

  useEffect(() => {
    // Fetch chat history from server using Axios
    const fetchChat = async () => {
      try {
        const response = await axios.get(`https://chatsocketv2-latest.onrender.com/chat/${friendUserId}?loggedInUserId=${loggedInUserId}`);
        setMessages(response.data.messages);
        const url = await getProfileImageUrl(loggedInUserId);
        setProfileImageUrl(url);
        const urlf = await getProfileImageUrl(friendUserId);
        setProfileImageUrlf(urlf);
      } catch (error) {
        console.error('Error fetching chat history:', error);
      }
    };

    fetchChat();

    // Listen for new messages
    socket.on('message', (message) => {
      if (
        (message.user1 === loggedInUserId && message.user2 === friendUserId) ||
        (message.user1 === friendUserId && message.user2 === loggedInUserId)
      ) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
      ele.current.scrollIntoView({ behavior: 'smooth' });
    });

    // Clean up on component unmount
    return () => {
      socket.off('message');
    };
  }, [loggedInUserId, friendUserId]);

  const getProfileImageUrl = async (userId) => {
    try {
      const folderRef = ref(storage, `profile_photos/${userId}/`);
      const filesList = await listAll(folderRef);

      if (filesList.items.length > 0) {
        const firstFileRef = filesList.items[0];
        const url = await getDownloadURL(firstFileRef);
        return url;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error fetching profile image:", error);
      return null;
    }
  };
  function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
  
    // Extract date components
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are 0-based
    const year = date.getFullYear();
  
    // Extract time components
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // The hour '0' should be '12'
  
    // Format the components
    const formattedDate = `${month}/${day}/${year}`;
    const formattedTime = `${hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds} ${ampm}`;
  
    return `${formattedDate} ${formattedTime}`;
  }
  const sendMessage = () => {
    const msg = { user1: loggedInUserId, user2: friendUserId, sender: loggedInUserId, message: input };
    socket.emit('message', msg);
    setInput('');
  };

  return (
    <div className="chat-container">
      <div className="message-container">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender === loggedInUserId ? 'right' : 'left'}`}>
            {msg.sender !== loggedInUserId && profileImageUrlf && (
              <img src={profileImageUrlf} alt="Profile" className="profile-image" />
            )}
            <div className={`msgbox`}>
              <div ref={ele} className={`message-content ${msg.sender === loggedInUserId ? 'message-right' : 'message-left'}`}>
                {msg.message}

              </div>
              <div style={{ fontSize: "small" ,textAlign:"end"}}>{formatTimestamp(msg.timestamp)}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="input-container">
        <input className='typeinput' value={input} onChange={(e) => setInput(e.target.value)} />
        <button className='cbutton' onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
