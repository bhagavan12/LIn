// import React from 'react';
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardBody, MDBCardImage, MDBBtn, MDBTypography } from 'mdb-react-ui-kit';
import React, { useState, useEffect } from "react";
import useProfileImage from "../uploadImage";
import { useUserAuth } from "../../context/UserAuthContext";
import { ref, getDownloadURL, listAll, getMetadata } from "firebase/storage";
import { db, storage } from "../../firebase";
import { collection, addDoc, doc, getDoc, query, where, getDocs, deleteDoc, updateDoc, setDoc } from "firebase/firestore";
import './mdb.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import PostShow from '../PostShow';
import UserPost from '../UserPost';
import { useNavigate } from "react-router-dom";
export default function EditButton() {
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

  useEffect(() => {
    const fetchPostsCount = async () => {
      try {
        const { uid } = await userDataf();
        const userDocRef = doc(db, "posts", uid); // Reference to the user's document
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          const posts = userData.posts || []; // Assuming posts are stored in the user document under the key "posts"
          const numPosts = posts.length; // Count the number of posts
          setNumOfPosts(numPosts);
        } else {
          console.log("User document not found");
        }
      } catch (error) {
        console.error("Error fetching posts count:", error);
      }
    };

    fetchPostsCount();
  }, [userDataf]);
  // useEffect(() => {
  //   const fetchPostsCount = async () => {
  //     try {
  //       const { uid } = await userDataf();
  //       const postsRef = ref(storage, `posts/${uid}/`);
  //       const filesList = await listAll(postsRef);
  //       console.log(filesList.items)
  //       const numFiles = filesList.items.length;
  //       setNumOfPosts(numFiles);
  //     } catch (error) {
  //       console.error("Error fetching posts count:", error);
  //     }
  //   };

  //   fetchPostsCount();
  // }, [userDataf]);
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
                  <div style={{ display: 'flex' }}>
                    <MDBBtn outline color="dark" style={{ height: '36px', width: '240px', overflow: 'visible', flex: '1', marginRight: '30px' }} onClick={handleShow}>
                      Edit Profile
                    </MDBBtn>
                    <MDBBtn outline color="dark" style={{ height: '36px', overflow: 'visible', flex: '1' }} onClick={handleShow1}>
                      Post
                    </MDBBtn>
                    <MDBBtn outline color="dark" style={{ height: '36px', overflow: 'visible', flex: '1' }} onClick={() => handlenotifications()}>
                      Notifications
                    </MDBBtn>
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
                    <MDBCardText className="mb-1 h5"> {numOfPosts}</MDBCardText>
                    <MDBCardText className="small text-muted mb-0">posts</MDBCardText>
                  </div>
                  <div>
                    <MDBCardText className="mb-1 h5"> {friendCount}</MDBCardText>
                    <MDBCardText className="small text-muted mb-0">Friends</MDBCardText>
                  </div>
                  {/* <div className="px-3">
                    <MDBCardText className="mb-1 h5">1026</MDBCardText>
                    <MDBCardText className="small text-muted mb-0">Followers</MDBCardText>
                  </div> */}
                  {/* <div>
                    <MDBCardText className="mb-1 h5">478</MDBCardText>
                    <MDBCardText className="small text-muted mb-0">Following</MDBCardText>
                  </div> */}
                </div>
              </div>
              <MDBCardBody className="text-black p-4">
                <PostShow />
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
}
{/* <div className="mb-5">
                  <p className="lead fw-normal mb-1">About</p>
                  <div className="p-4" style={{ backgroundColor: '#f8f9fa' }}>
                    <MDBCardText className="font-italic mb-1">Web Developer</MDBCardText>
                    <MDBCardText className="font-italic mb-1">Lives in New York</MDBCardText>
                    <MDBCardText className="font-italic mb-0">Photographer</MDBCardText>
                  </div>
                </div> */}
{/* <div className="d-flex justify-content-between align-items-center mb-4">
                  <MDBCardText className="lead fw-normal mb-0">Recent photos</MDBCardText>
                  <MDBCardText className="mb-0"><a href="#!" className="text-muted">Show all</a></MDBCardText>
                </div>
                <MDBRow>
                  <MDBCol className="mb-2">
                    <MDBCardImage src="https://mdbcdn.b-cdn.net/img/Photos/Lightbox/Original/img%20(112).webp"
                      alt="image 1" className="w-100 rounded-3" />
                  </MDBCol>
                  <MDBCol className="mb-2">
                    <MDBCardImage src="https://mdbcdn.b-cdn.net/img/Photos/Lightbox/Original/img%20(107).webp"
                      alt="image 1" className="w-100 rounded-3" />
                  </MDBCol>
                </MDBRow>
                <MDBRow className="g-2">
                  <MDBCol className="mb-2">
                    <MDBCardImage src="https://mdbcdn.b-cdn.net/img/Photos/Lightbox/Original/img%20(108).webp"
                      alt="image 1" className="w-100 rounded-3" />
                  </MDBCol>
                  <MDBCol className="mb-2">
                    <MDBCardImage src="https://mdbcdn.b-cdn.net/img/Photos/Lightbox/Original/img%20(114).webp"
                      alt="image 1" className="w-100 rounded-3" />
                  </MDBCol>
                </MDBRow> */}