import React, { useState, useEffect } from 'react';
import Search from './SearchU';
import Chat from './Chat';
import './ChatPage.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Userselectedchat from './Userselectedchat';
import { ref, getDownloadURL, listAll } from "firebase/storage";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db, storage } from "../../firebase";
const ChatPage = ({ loggedInUserId }) => {
    const [selectedUser, setSelectedUser] = useState(null);
    const [chattedUsers, setChattedUsers] = useState([]);
    const navigate = useNavigate();
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
    const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 600);
    useEffect(() => {
        const handleResize = () => {
            setIsMobileView(window.innerWidth <= 600);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    useEffect(() => {
        const fetchChattedUsers = async () => {
            try {
                const response = await axios.get(`http://localhost:1234/chats?userId=${loggedInUserId}`);
                const userIds = response.data;
                console.log("chattedUsers1", userIds);
                // const userIds=chatData
                const q = query(collection(db, "users"), where("uid", "in", userIds));
                const querySnapshot = await getDocs(q);

                const users = await Promise.all(querySnapshot.docs.map(async (doc) => {
                    const docData = doc.data();
                    const imageUrl = await getProfileImageUrl(docData.uid);
                    return {
                        uid: docData.uid,
                        username: docData.username,
                        profileimg: imageUrl,
                        fullName: docData.fullName,
                        bio: docData.bio
                    };
                }));

                setChattedUsers(users);
            } catch (error) {
                console.error("Error fetching chatted users:", error);
            }
        };

        fetchChattedUsers();
    }, [loggedInUserId]);
    const handleUserSelect = (userId) => {
        setSelectedUser(userId);
        // navigate(`/chat/${userId}`);
        if (isMobileView) {
            navigate(`/chat/${userId}`);
        }
    };
    const handleMsgClick = async (user) => {
        setSelectedUser(user.uid);
        if (isMobileView) {
            navigate(`/chat/${user.uid}`);
        }
    };
    return (

        <div className="chat-page-container">

            <div className="sidebarch">
                <Search onUserSelect={handleUserSelect} loggedInUserId={loggedInUserId} />
                <h3>Messages</h3>
                <ul className="chatted-users">
                    {chattedUsers.map((user) => (
                        <li key={user._id} onClick={() => handleMsgClick(user)} className="chatted-user">
                            <img src={user.profileimg} alt="Avatar" className="profile-image" />
                            {user.username}
                        </li>
                    ))}
                </ul>
            </div>
            {!isMobileView && (
                <div className="chat-area">
                    {selectedUser ? (
                        <Userselectedchat loggedInUserId={loggedInUserId} friendUserId={selectedUser} />
                    ) : (
                        <div className="empty-chat">Select a user to start chatting</div>
                    )}
                </div>
            )}

        </div>
    );
};

export default ChatPage;
