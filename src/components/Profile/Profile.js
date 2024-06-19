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
    const [showFriends, setShowFriends] = useState(false); // State to control friends modal
    const [friends, setFriends] = useState([]); //
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleClose1 = () => setShow1(false);
    const handleShow1 = () => setShow1(true);
    const handleCloseFriends = () => setShowFriends(false);
    const handleShowFriends = () => setShowFriends(true);

    /*modal*/
    const [friendsDetails, setFriendsDetails] = useState([]);
    const navigate = useNavigate(); // Initialize useNavigate
    const { userDataf } = useUserAuth();
    const { uploadProfileImage, uploadProgress } = useProfileImage();
    const [userData, setUserData] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [profileImageUrl, setProfileImageUrl] = useState(null); // State for profile image URL
    const [friendCount, setFriendCount] = useState(0); // State for friend count
    const [numOfPosts, setNumOfPosts] = useState(0);
    const [toastMessage, setToastMessage] = useState("");
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
                if (downloadURL) {
                    // showToast("Profile image uploaded successfully!");
                    console.log("Profile image uploaded successfully!");
                }
            } catch (error) {
                console.error("Error uploading profile image:", error);
                // showToast("Failed to upload profile image.");
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
            console.log("friendDocSnap", friendDocSnap);
            if (friendDocSnap.exists()) {
                const friendData = friendDocSnap.data();
                if (friendData.friends) {
                    setFriends(friendData.friends);
                    console.log("friends of ", userId, friendData.friends);
                    await fetchFriendsDetails(friendData.friends);
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
            console.log("querySnapshot", querySnapshot);
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
    const handleUserClick = async (user) => {
        const { uid } = await userDataf();
        if (uid === user.uid) {
            navigate("/mdb");
        } else {
            navigate(`/userprofile/${user.uid}`, { state: { userData: user } });
        }
    };
    // const fetchFriendsDetails = async (friendsList) => {
    //     try {
    //         const friendsDetailsArray = [];
    //         for (const friendId of friendsList) {
    //             const friendDocRef = doc(db, 'users', friendId);
    //             const friendDocSnap = await getDoc(friendDocRef);
    //             if (friendDocSnap.exists()) {
    //                 friendsDetailsArray.push(friendDocSnap.data());
    //                 console.log(friendDocSnap.data(),"added");
    //             }
    //         }
    //         setFriendsDetails(friendsDetailsArray);
    //         console.log("friendsDetailsArray",friendsDetails);
    //     } catch (error) {
    //         console.error('Error fetching friends details:', error);
    //     }
    // };
    const fetchFriendsDetails = async (friendsList) => {
        try {
            console.log("friendsList:", friendsList); // Debug: log the input list
            const friendsDetailsArray = [];
            for (const friendId of friendsList) {
                console.log("Fetching details for friend ID:", friendId); // Debug: log the friend ID
                const q = query(collection(db, "users"), where("uid", "==", friendId));
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    const userDocSnapshot = querySnapshot.docs[0];
                    const userData = userDocSnapshot.data();
                    // console.log("Fetched friend Data:", userData)
                    // friendsDetailsArray.push(userData);
                    const profileImageUrl = await getProfileImageUrl(friendId);
                    friendsDetailsArray.push({ ...userData, profileImageUrl });
                    console.log(userData, "added"); // Debug: log the added friend details
                } else {
                    console.log("No document found for friend ID:", friendId); // Debug: log if no document found
                }
            }
            setFriendsDetails(friendsDetailsArray);
            console.log("friendsDetailsArray", friendsDetailsArray); // Debug: log the final array before setting state
        } catch (error) {
            console.error('Error fetching friends details:', error);
        }
    };
    /*no use*/
    const showToast = (message) => {
        setToastMessage(message);
        setTimeout(() => {
            setToastMessage("");
        }, 5000); // Hide toast after 5 seconds
    };
    /*no use*/
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
                            {/* <Modal.Header closeButton>
                                <Modal.Title>Posting</Modal.Title>
                            </Modal.Header> */}
                            <Modal.Body>
                                <p className='model_header_h4'>Create Post</p>
                                <UserPost />
                            </Modal.Body>
                        </Modal>
                    </div>
                    <Modal show={show} onHide={handleClose}>
                        {/* <Modal.Header closeButton>
                            <Modal.Title>Profile Editing</Modal.Title>
                        </Modal.Header> */}

                        <Modal.Body>
                            <p className='model_header_h4'>Profile Editing</p>
                            <div className='cardd'>
                                <label htmlFor="file" className="labelFile">
                                    <span>
                                        <svg
                                            viewBox="0 0 184.69 184.69"
                                            xmlns="http://www.w3.org/2000/svg"
                                            id="Capa_1"
                                            version="1.1"
                                            width="30px"
                                            height="30px"
                                        >
                                            <g>
                                                <g>
                                                    <g>
                                                        <path
                                                            d="M149.968,50.186c-8.017-14.308-23.796-22.515-40.717-19.813
                      C102.609,16.43,88.713,7.576,73.087,7.576c-22.117,0-40.112,17.994-40.112,40.115c0,0.913,0.036,1.854,0.118,2.834
                      C14.004,54.875,0,72.11,0,91.959c0,23.456,19.082,42.535,42.538,42.535h33.623v-7.025H42.538
                      c-19.583,0-35.509-15.929-35.509-35.509c0-17.526,13.084-32.621,30.442-35.105c0.931-0.132,1.768-0.633,2.326-1.392
                      c0.555-0.755,0.795-1.704,0.644-2.63c-0.297-1.904-0.447-3.582-0.447-5.139c0-18.249,14.852-33.094,33.094-33.094
                      c13.703,0,25.789,8.26,30.803,21.04c0.63,1.621,2.351,2.534,4.058,2.14c15.425-3.568,29.919,3.883,36.604,17.168
                      c0.508,1.027,1.503,1.736,2.641,1.897c17.368,2.473,30.481,17.569,30.481,35.112c0,19.58-15.937,35.509-35.52,35.509H97.391
                      v7.025h44.761c23.459,0,42.538-19.079,42.538-42.535C184.69,71.545,169.884,53.901,149.968,50.186z"
                                                            style={{ fill: '#010002' }}
                                                        />
                                                    </g>
                                                    <g>
                                                        <path
                                                            d="M108.586,90.201c1.406-1.403,1.406-3.672,0-5.075L88.541,65.078
                      c-0.701-0.698-1.614-1.045-2.534-1.045l-0.064,0.011c-0.018,0-0.036-0.011-0.054-0.011c-0.931,0-1.85,0.361-2.534,1.045
                      L63.31,85.127c-1.403,1.403-1.403,3.672,0,5.075c1.403,1.406,3.672,1.406,5.075,0L82.296,76.29v97.227
                      c0,1.99,1.603,3.597,3.593,3.597c1.979,0,3.59-1.607,3.59-3.597V76.165l14.033,14.036
                      C104.91,91.608,107.183,91.608,108.586,90.201z"
                                                            style={{ fill: '#010002' }}
                                                        />
                                                    </g>
                                                </g>
                                            </g>
                                        </svg>
                                    </span>
                                    <p>Drag and drop your image here or click to select image!</p>
                                </label>
                                <input className="input" name="text" id="file" type="file" onChange={handleFileChange} />
                                <p>
                                    <button class="button_sub" onClick={handleUpload}>Upload</button>
                                    {uploadProgress > 0 && <p>Upload Progress: {uploadProgress.toFixed(2)}%</p>}
                                    <div className="loaderp" style={{ width: `${uploadProgress}%` }}></div>
                                </p>
                            </div>
                            {/* <button onClick={handleUpload}>Edit</button> */}
                        </Modal.Body>

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
                                        {/* <Modal.Header closeButton>
                                           
                                        </Modal.Header> */}
                                        <Modal.Body>
                                            <p className='model_header_h4'>Create Post</p>
                                            <UserPost />
                                        </Modal.Body>

                                    </Modal>
                                </div>
                                <Modal show={show} onHide={handleClose}>
                                    {/* <Modal.Header closeButton>
                                        <Modal.Title>Profile Editing</Modal.Title>
                                    </Modal.Header> */}
                                    <Modal.Body>
                                        <p className='model_header_h4'>Profile Editing</p>
                                        <div className='cardd'>
                                            <label htmlFor="file" className="labelFile">
                                                <span>
                                                    <svg
                                                        viewBox="0 0 184.69 184.69"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        id="Capa_1"
                                                        version="1.1"
                                                        width="30px"
                                                        height="30px"
                                                    >
                                                        <g>
                                                            <g>
                                                                <g>
                                                                    <path
                                                                        d="M149.968,50.186c-8.017-14.308-23.796-22.515-40.717-19.813
                      C102.609,16.43,88.713,7.576,73.087,7.576c-22.117,0-40.112,17.994-40.112,40.115c0,0.913,0.036,1.854,0.118,2.834
                      C14.004,54.875,0,72.11,0,91.959c0,23.456,19.082,42.535,42.538,42.535h33.623v-7.025H42.538
                      c-19.583,0-35.509-15.929-35.509-35.509c0-17.526,13.084-32.621,30.442-35.105c0.931-0.132,1.768-0.633,2.326-1.392
                      c0.555-0.755,0.795-1.704,0.644-2.63c-0.297-1.904-0.447-3.582-0.447-5.139c0-18.249,14.852-33.094,33.094-33.094
                      c13.703,0,25.789,8.26,30.803,21.04c0.63,1.621,2.351,2.534,4.058,2.14c15.425-3.568,29.919,3.883,36.604,17.168
                      c0.508,1.027,1.503,1.736,2.641,1.897c17.368,2.473,30.481,17.569,30.481,35.112c0,19.58-15.937,35.509-35.52,35.509H97.391
                      v7.025h44.761c23.459,0,42.538-19.079,42.538-42.535C184.69,71.545,169.884,53.901,149.968,50.186z"
                                                                        style={{ fill: '#010002' }}
                                                                    />
                                                                </g>
                                                                <g>
                                                                    <path
                                                                        d="M108.586,90.201c1.406-1.403,1.406-3.672,0-5.075L88.541,65.078
                      c-0.701-0.698-1.614-1.045-2.534-1.045l-0.064,0.011c-0.018,0-0.036-0.011-0.054-0.011c-0.931,0-1.85,0.361-2.534,1.045
                      L63.31,85.127c-1.403,1.403-1.403,3.672,0,5.075c1.403,1.406,3.672,1.406,5.075,0L82.296,76.29v97.227
                      c0,1.99,1.603,3.597,3.593,3.597c1.979,0,3.59-1.607,3.59-3.597V76.165l14.033,14.036
                      C104.91,91.608,107.183,91.608,108.586,90.201z"
                                                                        style={{ fill: '#010002' }}
                                                                    />
                                                                </g>
                                                            </g>
                                                        </g>
                                                    </svg>
                                                </span>
                                                <p>Drag and drop your image here or click to select image!</p>
                                            </label>
                                            <input className="input" name="text" id="file" type="file" onChange={handleFileChange} />
                                            {uploadProgress > 0 && <p>Upload Progress: {uploadProgress.toFixed(2)}%</p>}
                                            <div className="loaderp" style={{ width: `${uploadProgress}%` }}></div>
                                            <p>
                                                <button class="button_sub" onClick={handleUpload}>Upload</button>
                                            </p>
                                        </div>
                                    </Modal.Body>
                                </Modal>
                            </div>
                        )}
                        <div className='Sndrow_data'>
                            <p id='nposts' >{numOfPosts} posts</p>
                            <p id='nfriends' onClick={() => setShowFriends(true)}>{friendCount} friends</p>
                            <Modal show={showFriends} onHide={() => setShowFriends(false)}>
                                <Modal.Body>
                                    <ul className='frilist'>
                                        {friendsDetails.map((friend, index) => (
                                            <li key={index} onClick={() => handleUserClick(friend)} className='frilistdata'>
                                                <img
                                                    src={friend.profileImageUrl || 'default-profile.png'}
                                                    alt={friend.username || 'No Name'}
                                                    style={{ width: '50px', height: '50px', borderRadius: '50%', marginRight: '10px' }}
                                                />
                                                {friend.fullName || friend.username || 'No Name'}
                                            </li>
                                        ))}
                                    </ul>
                                </Modal.Body>
                            </Modal>
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
            <div
                className={`toast align-items-center text-white bg-secondary border-0 position-fixed top-0 end-0 m-3 ${toastMessage ? "show" : ""
                    }`}
                role="alert"
                aria-live="assertive"
                aria-atomic="true"
            >
                <div className="d-flex">
                    <div className="toast-body">{toastMessage}</div>
                    <button
                        type="button"
                        className="btn-close me-2 m-auto"
                        data-bs-dismiss="toast"
                        aria-label="Close"
                        onClick={() => setToastMessage("")}
                    ></button>
                </div>
            </div>
            <div className=''>
                <PostShow />
            </div>
        </div>
    );
}
