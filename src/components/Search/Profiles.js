// import React from 'react';
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardBody, MDBCardImage, MDBBtn, MDBTypography } from 'mdb-react-ui-kit';
import React, { useState, useEffect } from "react";
import { collection, addDoc, doc, getDoc, query, where, getDocs, updateDoc } from "firebase/firestore"; // Import Firestore methods

import useProfileImage from "../uploadImage";
import { useUserAuth } from "../../context/UserAuthContext";
import { ref, getDownloadURL, listAll } from "firebase/storage";
import { storage, db } from "../../firebase";
import '../mdb.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import SearchedProfilePost from './SearchedProfilePost';
// import UserPost from './UserPost';
import { useParams, useLocation } from "react-router-dom";
export default function EditButton() {
    /*modal*/
    const [show, setShow] = useState(false);
    const [show1, setShow1] = useState(false);
    const [senderid, setSenderid] = useState(null);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleClose1 = () => setShow1(false);
    const handleShow1 = () => setShow1(true);
    // const 
    /*modal*/
    const location = useLocation(); // Get the location object
    const { userId } = useParams();
    const { userDataf } = useUserAuth();
    // setSenderid(userDataff.uid);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const userDataff = userDataf();
                // const data = await userDataf();
                // setUserData(data);
                setSenderid(userDataff);
                // Fetch and set profile image URL
                // const imageUrl = await getProfileImageUrl(data.uid);
                // setProfileImageUrl(imageUrl);
                const isFriend = await checkIfFriend(userDataff.uid, userId);
                setIsFriend(isFriend);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };
        fetchData();
    }, [userDataf, userId]);
    // console.log(userDataff.dob);
    // console.log("sdata:",userDataff.uid);
    // const senderid=userDataff.uid
    const { uploadProfileImage, uploadProgress } = useProfileImage();
    const [userData, setUserData] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [profileImageUrl, setProfileImageUrl] = useState(null); // State for profile image URL
    const [isFriend, setIsFriend] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // const data = await userDataf();
                const { state } = location;
                if (state && state.userData) {
                    setUserData(state.userData);
                }
                setUserData(state.userData);
                console.log("userData.userData",state.userData);

                // Fetch and set profile image URL
                const imageUrl = await getProfileImageUrl(userId);
                setProfileImageUrl(imageUrl);

            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };
        fetchData();
    }, [location]);



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
    const sendFollowRequest = async (senderId, receiverId) => {
        if (!senderId || !receiverId) {
            console.error("Error sending follow request: Invalid senderId or receiverId", senderId.uid, receiverId);
            return;
        }

        try {
            // Check if a friend request or friendship already exists
            const existingFriendship = await checkFriendship(senderId, receiverId);
            if (existingFriendship) {
                console.log("Friendship already exists or a friend request has been sent previously.");
                return;
            }

            // Add a document to the 'friendRequests' collection
            await addDoc(collection(db, 'friendRequests'), {
                senderUid: senderId,
                receiverUid: receiverId,
                status: 'pending'
            });
            console.log("Friend request sent successfully!");
        } catch (error) {
            console.error("Error sending follow request:", error);
        }
    };

    const checkFriendship = async (senderId, receiverId) => {
        try {
            // Check if sender and receiver are already friends
            const senderDoc = await getDoc(doc(db, 'friends', senderId));
            const receiverDoc = await getDoc(doc(db, 'friends', receiverId));

            if (senderDoc.exists() && receiverDoc.exists()) {
                const senderData = senderDoc.data();
                const receiverData = receiverDoc.data();

                // Check if sender is already a friend of receiver
                if (senderData.friends.includes(receiverId)) {
                    return true;
                }

                // Check if receiver is already a friend of sender
                if (receiverData.friends.includes(senderId)) {
                    return true;
                }
            }

            // Check if a friend request has been sent previously
            const querySnapshot = await getDocs(query(collection(db, 'friendRequests'),
                where('senderUid', '==', senderId),
                where('receiverUid', '==', receiverId)));

            if (!querySnapshot.empty) {
                return true;
            }

            return false;
        } catch (error) {
            console.error("Error checking friendship:", error);
            return false;
        }
    };
    // const sendFollowRequest = async (senderId, receiverId) => {
    //     if (!senderId || !receiverId) {
    //         console.error("Error sending follow request: Invalid senderId or receiverId", senderId.uid, receiverId);
    //         return;
    //     }

    //     try {
    //         await addDoc(collection(db, 'friendRequests'), {
    //             senderUid: senderId,
    //             receiverUid: receiverId,
    //             status: 'pending'
    //         });
    //         console.log("Friend request sent successfully!");
    //     } catch (error) {
    //         console.error("Error sending follow request:", error);
    //     }
    // };

    const checkIfFriend = async (userId, receiverId) => {
        try {
            const friendsDoc = await getDoc(doc(db, 'friends', userId));
            if (friendsDoc.exists()) {
                const friendsData = friendsDoc.data();
                return friendsData.friends.includes(receiverId);
            }
            return false;
        } catch (error) {
            console.error("Error checking if friend:", error);
            return false;
        }
    };

    const handleButtonClick = async (senderId, receiverId) => {
        try {
            if (isFriend) {
                // If already friends, perform unfollow action
                await removeFriend(senderId, receiverId);
                console.log("Unfollow action here");
            } else {
                await sendFollowRequest(senderId, receiverId);
            }
        } catch (error) {
            console.error("Error handling button click:", error);
        }
    };
    const removeFriend = async (userId, friendId) => {
        try {
            // Remove friendId from userId's friends array
            const userDocRef = doc(db, 'friends', userId);
            const docSnapshot = await getDoc(userDocRef);
            if (docSnapshot.exists()) {
                const friendsData = docSnapshot.data();
                const updatedFriends = friendsData.friends.filter(id => id !== friendId);
                await updateDoc(userDocRef, { friends: updatedFriends });
                setIsFriend(false); // Update the state to reflect the unfollow action
            }

            // Also remove userId from friendId's friends array
            const friendDocRef = doc(db, 'friends', friendId);
            const friendDocSnapshot = await getDoc(friendDocRef);
            if (friendDocSnapshot.exists()) {
                const friendFriendsData = friendDocSnapshot.data();
                const updatedFriendFriends = friendFriendsData.friends.filter(id => id !== userId);
                await updateDoc(friendDocRef, { friends: updatedFriendFriends });
            }
        } catch (error) {
            console.error("Error removing friend:", error);
        }
    };

    return (
        <div className="gradient-custom-2" style={{ backgroundColor: 'whitesmoke' }}>
            <MDBContainer className="py-5 h-100">
                <MDBRow className="justify-content-center align-items-center h-100">
                    <MDBCol lg="11" xl="11">
                        <MDBCard>
                            <div className="rounded-top text-white d-flex flex-row" style={{ backgroundColor: '#000', height: '200px' }}>
                                <div className="ms-4 mt-5 d-flex flex-column" style={{ width: '150px' }}>
                                    {profileImageUrl ? (
                                        <MDBCardImage
                                            src={profileImageUrl || 'placeholder_image_url'} // Use a placeholder image URL or default image if profileImageUrl is null
                                            alt="Profile"
                                            className="mt-4 mb-2 img-thumbnail"
                                            fluid
                                            style={{
                                                width: '200px', // Set the fixed width for the profile image container
                                                height: '150px', // Set the fixed height for the profile image container
                                                objectFit: 'contain', // Ensure the image covers the entire container
                                                objectPosition: 'center', // Center the image within the container
                                                zIndex: '1'
                                            }}
                                        />
                                    ) : (
                                        <div className="" style={{ width: "200px", height: "150px" }}>No Profile Image</div>
                                    )}

                                    {/* <div style={{ display: 'flex' }}>
                                        <MDBBtn outline color="dark" style={{ height: '36px', width: '240px', overflow: 'visible', flex: '1', marginRight: '30px' }} onClick={() => handleButtonClick(senderid.uid, userId)}>
                                            {isFriend ? "Unfollow" : "Send Request"}
                                        </MDBBtn>
                                    </div> */}
                                    <div style={{ display: 'flex' }}>
                                        <MDBBtn outline color="dark" style={{ height: '36px', width: '240px', overflow: 'visible', flex: '1', marginRight: '30px' }} onClick={() => handleButtonClick(senderid.uid, userId)}>
                                            {isFriend ? "Unfollow" : "Send Request"}
                                        </MDBBtn>
                                    </div>
                                </div>
                                {userData && (
                                    <div className="ms-3" style={{ marginTop: '100px' }}>
                                        <MDBTypography tag="h5">{userData.username}</MDBTypography>
                                        <MDBTypography>{userData.fullName}</MDBTypography>
                                        <MDBCardText >{userData.email}</MDBCardText>
                                    </div>
                                )}
                            </div>

                            <div className="p-4 text-black" style={{ backgroundColor: '#f8f9fa' }}>
                                <div className="d-flex justify-content-end text-center py-1">
                                    <div>
                                        <MDBCardText className="mb-1 h5">253</MDBCardText>
                                        <MDBCardText className="small text-muted mb-0">Photos</MDBCardText>
                                    </div>
                                    <div className="px-3">
                                        <MDBCardText className="mb-1 h5">1026</MDBCardText>
                                        <MDBCardText className="small text-muted mb-0">Followers</MDBCardText>
                                    </div>
                                    <div>
                                        <MDBCardText className="mb-1 h5">478</MDBCardText>
                                        <MDBCardText className="small text-muted mb-0">Following</MDBCardText>
                                    </div>
                                </div>
                            </div>
                            <MDBCardBody className="text-black p-4">
                                <SearchedProfilePost location={location} userId={userId} />
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        </div>
    );
}
{/* <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Edit</button> */}
{/* <button class="button">
            <div class="b-container">
            <div class="folder folder_one"></div>
            <div class="folder folder_two"></div>
            <div class="folder folder_three"></div>
            <div class="folder folder_four"></div>
            </div>
            <div class="active_line"></div>
            <span class="text">File Explorer</span>
        </button> */}
{/* <div style={{ display: 'flex' }}>
          <MDBBtn outline color="dark" style={{ height: '36px', width: '240px', overflow: 'visible', flex: '1', marginRight: '30px' }} onClick={handleShow}>
            Edit Profile
          </MDBBtn>
          <MDBBtn outline color="dark" style={{ height: '36px', overflow: 'visible', flex: '1' }} onClick={handleShow1}>
            Post
          </MDBBtn>
          <Modal show={show1} onHide={handleClose1}>
            <Modal.Header closeButton>
              <Modal.Title>Posting</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <UserPost />
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose1}>
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
            
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleUpload}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal> */}