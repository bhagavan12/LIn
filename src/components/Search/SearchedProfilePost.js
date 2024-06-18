import React, { useState, useEffect } from "react";
import { MDBContainer, MDBRow, MDBCol, MDBCardImage } from "mdb-react-ui-kit";
import { collection, query, where, getDocs } from "firebase/firestore";
import { ref, getDownloadURL, listAll } from "firebase/storage";
import { db } from "../../firebase";
import { storage } from "../../firebase";
import ReactPlayer from 'react-player';
// import { useUserAuth } from "../context/UserAuthContext";
import Modal from "react-bootstrap/Modal";
import { Button, Carousel } from "react-bootstrap"; // Import Carousel from react-bootstrap
// Import ExampleCarouselImage or replace it with your image component
// import ExampleCarouselImage from "./ExampleCarouselImage"; 
import { MDBCardVideo } from 'mdbreact';
import '../PostShow.css';
const PostList = ({ location, userId }) => {
    // const { userDataf } = useUserAuth();
    const [posts, setPosts] = useState([]);
    const [modalPost, setModalPost] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [index, setIndex] = useState(0);
    const [usernamee, setUsernamee] = useState(null);
    const [profileImageUrl, setProfileImageUrl] = useState(null); // State for profile image URL
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                // const { uid } = await userDataf();
                setProfileImageUrl(await getProfileImageUrl(userId));
                const q = query(collection(db, "posts"), where("uid", "==", userId));
                const querySnapshot = await getDocs(q);
                const fetchedPosts = [];
                querySnapshot.forEach((doc) => {
                    fetchedPosts.push({ id: doc.id, ...doc.data() });
                });
                const sortedPosts = fetchedPosts.sort((a, b) => b.createdAt - a.createdAt);
                setPosts(fetchedPosts);
                setUsernamee(posts.username);
            } catch (error) {
                console.error("Error fetching posts:", error);
            }
        };
        fetchPosts();
    }, [location]);

    const handlePostClick = (post) => {
        setModalPost(post);
        setShowModal(true);
    };

    const handleSelect = (selectedIndex, e) => {
        setIndex(selectedIndex);
    };
    const formatDate = (timestamp) => {
        const dateObj = timestamp?.toDate(); // Convert Firestore timestamp to Date object
        return dateObj ? dateObj.toLocaleString() : "";
    };
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
    const isVideoUrl = (url) => {
        return url.includes('.mp4');
    };
    return (
        <div>
            <div className='postfeed'>

                <div className='postsgrid'>
                    {posts.map((post, index) => (
                        <div>
                            {isVideoUrl(post.imageuploaded[0]) ? (
                                <div key={index} className='postcont'>
                                    <MDBCardVideo
                                        src={post.imageuploaded[0]}
                                        // className="w-100 rounded-3"
                                        className="posts"
                                        onClick={() => handlePostClick(post)}
                                    />
                                </div>
                            ) : (
                                <div key={index} className='postcont'>
                                    <img
                                        src={post.imageuploaded[0]}
                                        alt={`Post ${post.id}`}
                                        className="posts"
                                        // style={{ width: "450px", height: "330px", cursor: "pointer" }}
                                        onClick={() => handlePostClick(post)}
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal using React Bootstrap */}
            <Modal show={showModal} onHide={() => setShowModal(false)} >
                <Modal.Header closeButton>
                    <Modal.Title className="d-flex align-items-center">
                        <img
                            src={profileImageUrl}
                            className="rounded-circle mr-2"
                            height="42"
                            alt="Avatar"
                            loading="lazy"
                        />
                        <p>{usernamee}</p>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body >
                    {modalPost && (
                        <div>
                            <p>Date: {(new Date(modalPost.createdAt.seconds * 1000)).toLocaleString()}</p>
                            {/* <p>Date: {formatDate(modalPost.timestamp)}</p> */}
                            {/* Display images in a Bootstrap Carousel */}
                            <Carousel activeIndex={index} onSelect={handleSelect}>
                                {modalPost.imageuploaded.map((mediaUrl, idx) => (
                                    <Carousel.Item key={idx}>
                                        {/* <img src={image} className="d-block w-100" alt={`Post ${modalPost.id} Image ${idx}`} /> */}
                                        {isVideoUrl(mediaUrl) ? (
                                            <ReactPlayer url={mediaUrl} controls width="100%" height="auto" />
                                        ) : (
                                            <img src={mediaUrl} className="d-block w-100" alt={`Post ${modalPost.id} Image ${idx}`} />
                                        )}
                                    </Carousel.Item>
                                ))}
                            </Carousel>
                            <h5>{modalPost.caption}</h5>
                            <p>Likes: {modalPost.likes}</p>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default PostList;
