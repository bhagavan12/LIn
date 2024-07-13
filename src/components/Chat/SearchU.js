import React, { useState, useEffect } from 'react';
import './SearchU.css';
import { Form } from "react-bootstrap";
import { ref, getDownloadURL, listAll } from "firebase/storage";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db, storage } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { useUserAuth } from "../../context/UserAuthContext";
import axios from 'axios';

const Search = ({ onUserSelect, loggedInUserId }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [chattedUsers, setChattedUsers] = useState([]);
    const navigate = useNavigate();
    // useEffect(() => {
    //     const fetchChattedUsers = async () => {
    //         try {
    //             const response = await axios.get(`http://localhost:1234/chats?userId=${loggedInUserId}`);
    //             setChattedUsers(response.data);
    //             console.log("chattedUsers",chattedUsers);
    //         } catch (error) {
    //             console.error("Error fetching chatted users:", error);
    //         }
    //     };

    //     fetchChattedUsers();
    // }, [loggedInUserId]);

    const handleSearchChange = async (e) => {
        const queryValue = e.target.value.trim();
        setSearchQuery(queryValue);

        if (queryValue === "") {
            setSearchResults([]);
            return;
        }

        try {
            const q = query(collection(db, "users"), where("username", ">=", queryValue), where("username", "<=", queryValue + '\uf8ff'));
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
            setSearchResults(users);
        } catch (error) {
            console.error("Error searching users:", error);
            setSearchResults([]);
        }
    };

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

    
    const handleMsgClick = async (user) => {
        
        onUserSelect(user.uid);
        // navigate(`/chat/${user.uid}`);
        // Reset search query and results
        setSearchQuery("");
        setSearchResults([]);
    };
    return (
        <div className="search-containerch">
            <label htmlFor="usernameField" className="usernamelabel label">Username</label>
            <input
                type="text"
                placeholder="@"
                id="usernameField"
                required="required"
                value={searchQuery}
                onChange={handleSearchChange}
                className='inputch'
            />
            {searchResults.length > 0 && (
                <ul className="searchlistch">
                    {searchResults.map((user) => (
                        <li key={user.uid} onClick={() => handleMsgClick(user)} className="searched">
                            <img src={user.profileimg} alt="Avatar" className="profile-imagech" />
                            {user.username}
                        </li>
                    ))}
                </ul>
            )}
            {/* <h3>Chatted Users</h3>
            <ul className="chatted-users">
                {chattedUsers.map((user) => (
                    <li key={user._id} onClick={() => handleMsgClick(user)} className="chatted-user">
                        <img src={user.profileimg} alt="Avatar" className="profile-image" />
                        {user.username}
                    </li>
                ))}
            </ul> */}
        </div>
    );
};

export default Search;
