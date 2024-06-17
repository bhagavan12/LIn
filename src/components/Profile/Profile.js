import './Profile1.css';
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardBody, MDBCardImage, MDBBtn, MDBTypography } from 'mdb-react-ui-kit';
import React, { useState, useEffect } from "react";
import useProfileImage from "../uploadImage";
import { useUserAuth } from "../../context/UserAuthContext";
import { ref, getDownloadURL, listAll, getMetadata } from "firebase/storage";
import { db, storage } from "../../firebase";
import { collection, addDoc, doc, getDoc, query, where, getDocs, deleteDoc, updateDoc, setDoc } from "firebase/firestore";
// import './mdb.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import PostShow from '../PostShow';
import UserPost from '../UserPost';
import { useNavigate } from "react-router-dom";
export default function Profile() {
    /*from mdbprofile*/
    /*modal*/
    const [show, setShow] = useState(false);
    const [show1, setShow1] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleClose1 = () => setShow1(false);
    const handleShow1 = () => setShow1(true);
    /*modal*/
    const navigate = useNavigate(); // Initialize useNavigate
    const { userDataf } = useUserAuth();
    const { uploadProfileImage, uploadProgress } = useProfileImage();
    const [userData, setUserData] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [profileImageUrl, setProfileImageUrl] = useState(null); // State for profile image URL
    const [friendCount, setFriendCount] = useState(0); // State for friend count
    const [numOfPosts, setNumOfPosts] = useState(0);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await userDataf();
                setUserData(data);

                // Fetch and set profile image URL
                const imageUrl = await getProfileImageUrl(data.uid);
                setProfileImageUrl(imageUrl);
                // Fetch and set friend count
                const friendsCount = await getFriendCount(data.uid);
                setFriendCount(friendsCount);
                const postsCount = await getPostsCount(data.uid);
                setNumOfPosts(postsCount);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };
        fetchData();
    }, [userDataf]);

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (selectedFile && userData) {
            try {
                const downloadURL = await uploadProfileImage(userData.uid, selectedFile);
                console.log("Profile Image URL:", downloadURL);
                setProfileImageUrl(downloadURL); // Update profile image URL after upload
            } catch (error) {
                console.error("Error uploading profile image:", error);
            }
        }
    };

    // Function to get profile image URL from Firebase Storage
    const getProfileImageUrl = async (userId) => {
        try {
            const folderRef = ref(storage, `profile_photos/${userId}/`);
            const filesList = await listAll(folderRef);

            // Get the first file URL from the list
            if (filesList.items.length > 0) {
                const firstFileRef = filesList.items[0];
                const url = await getDownloadURL(firstFileRef);
                return url;
            } else {
                return null; // No files found in the folder
            }
        } catch (error) {
            console.error("Error fetching profile image:", error);
            return null;
        }
    };
    const handlenotifications = async () => {
        const { uid } = await userDataf();
        navigate(`/notifications/${uid}`);
    }
    const getFriendCount = async (userId) => {
        try {
            const friendDocRef = doc(db, "friends", userId);
            const friendDocSnap = await getDoc(friendDocRef);

            if (friendDocSnap.exists()) {
                const friendData = friendDocSnap.data();
                if (friendData.friends) {
                    return friendData.friends.length;
                }
            }
            return 0;
        } catch (error) {
            console.error("Error fetching friend count:", error);
            return 0;
        }
    };
    const getPostsCount = async (userId) => {
        try {
            const postsQuery = query(collection(db, "posts"), where("uid", "==", userId));
            const querySnapshot = await getDocs(postsQuery);
            console.log("querySnapshot",querySnapshot);
            const numPosts = querySnapshot.size; // Count the number of documents returned
            return numPosts;
        } catch (error) {
            console.error("Error fetching posts count:", error);
            return 0;
        }
    };
    // useEffect(() => {
    //     const fetchPostsCount = async () => {
    //         try {
    //             const { user } = await userDataf();
    //             const q = query(collection(db, "posts"), where("uid", "==", user.uid));
    //             const userDocSnapshot = await getDocs(q);
    //             console.log(userDocSnapshot);
    //             if (userDocSnapshot.exists()) {
    //                 const userDatad = userDocSnapshot.data();
    //                 console.log(userDatad);
    //                 const posts = userDatad.posts || []; // Assuming posts are stored in the user document under the key "posts"
    //                 const numPosts = posts.length; // Count the number of posts
    //                 setNumOfPosts(numPosts);
    //             } else {
    //                 console.log("User document not found");
    //             }
    //         } catch (error) {
    //             console.error("Error fetching posts count:", error);
    //         }
    //     };

    //     fetchPostsCount();
    // }, [userDataf]);
    /*from mdbprofile*/
    const users = {
        profileimg: 'https://statico.sportskeeda.com/editor/2022/09/d41a0-16639628212744-1920.jpg',
        username: 'teja.javvadi',
        friends: 150,
        postscount: 5,
        bio: "Always on the go 🔁",
        fullname: "««᯾ᵃⁱ 𝐁♕︎ᴀɢᴀᴠᴀɴ»»"
    };
    const posts = {

    }
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
    return (
        <div>
            {isMobileView && userData && (
                <div className='Fstrow_data'>
                    <p id='uname'>{userData.username}</p>
                    <button type="button" className='pbutton' onClick={handleShow}>Edit Profile</button>
                    <button type="button" className='pbutton' onClick={handleShow1}>Add Post</button>
                    <i className='system-uicons--settings' id='iconsett'></i>
                    <div style={{ display: 'flex' }}>

                        <Modal show={show1} onHide={handleClose1}>
                            <Modal.Header closeButton>
                                <Modal.Title>Posting</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <UserPost />
                            </Modal.Body>
                            <Modal.Footer>
                                <Button className='button' variant="secondary" onClick={handleClose1}>
                                    Close
                                </Button>
                                <Button variant="primary" onClick={handleClose1}>
                                    Save Changes
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </div>
                    <Modal show={show} onHide={handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Profile Editing</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <input type="file" onChange={handleFileChange} />
                            {/* <button onClick={handleUpload}>Edit</button> */}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                Close
                            </Button>
                            <Button variant="primary" onClick={handleUpload}>
                                Save Changes
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            )}

            {userData ? (
                <div className='profile_box'>
                    <div className='profile_container'>
                        {profileImageUrl ? (
                            <div className='proimg' style={{ backgroundImage: `url(${profileImageUrl})` }} />
                        ) : (
                            <div className="" style={{ width: "200px", height: "150px" }}>No Profile Image</div>
                        )}
                        {isMobileView && userData && (
                            <div className='Trdrow_data'>
                                <p id='fname'>{userData.fullName}</p>
                                <p id='bio'>{users.bio}</p>
                            </div>
                        )}
                    </div>

                    <div className='profile_data'>
                        {!isMobileView && userData && (
                            <div className='Fstrow_data'>
                                <p id='uname'>{userData.username}</p>
                                <button type="button" className='pbutton' onClick={handleShow}>Edit Profile</button>
                                {/* <button type="button" className='pbutton' onClick={handleShow1}>Add Post</button> */}
                                <button class="icon-btn add-btn" onClick={handleShow1}>
                                    <div class="add-icon"></div>
                                    <div class="btn-txt">Add Post</div>
                                </button>
                                <i className='system-uicons--settings' id='iconsett'></i>
                                <div style={{ display: 'flex' }}>

                                    <Modal show={show1} onHide={handleClose1}>
                                        <Modal.Header closeButton>
                                            <Modal.Title>Posting</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <UserPost />
                                        </Modal.Body>
                                        <Modal.Footer>
                                            <Button className='button' variant="secondary" onClick={handleClose1}>
                                                Close
                                            </Button>
                                            <Button variant="primary" onClick={handleClose1}>
                                                Save Changes
                                            </Button>
                                        </Modal.Footer>
                                    </Modal>
                                </div>
                                <Modal show={show} onHide={handleClose}>
                                    <Modal.Header closeButton>
                                        <Modal.Title>Profile Editing</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <input type="file" onChange={handleFileChange} />
                                        {/* <button onClick={handleUpload}>Edit</button> */}
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="secondary" onClick={handleClose}>
                                            Close
                                        </Button>
                                        <Button variant="primary" onClick={handleUpload}>
                                            Save Changes
                                        </Button>
                                    </Modal.Footer>
                                </Modal>
                            </div>
                        )}
                        <div className='Sndrow_data'>
                            <p id='nposts'>{numOfPosts} posts</p>
                            <p id='nfriends'>{friendCount} friends</p>
                        </div>
                        {!isMobileView && userData && (
                            <div className='Trdrow_data'>
                                <p id='fname'>{userData.fullName}</p>
                                <p id='bio'>{users.bio}</p>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div class="card">
                    <div class="card_load"></div>
                    <div class="card_load_extreme_title"></div>
                    <div class="card_load_extreme_descripion"></div>
                </div>
            )}
            <div className=''>
                <PostShow />
            </div>
        </div>
    );
}
