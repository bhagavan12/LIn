import React, { useState, useEffect } from "react";
import { MDBContainer, MDBRow, MDBCol, MDBCardImage } from "mdb-react-ui-kit";

import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { ref, getDownloadURL, listAll } from "firebase/storage";
import { db } from "../../firebase";
import { storage } from "../../firebase";
import ReactPlayer from 'react-player';
import { useUserAuth } from "../../context/UserAuthContext";
import Modal from "react-bootstrap/Modal";
import { Button, Carousel } from "react-bootstrap"; // Import Carousel from react-bootstrap
// Import ExampleCarouselImage or replace it with your image component
// import ExampleCarouselImage from "./ExampleCarouselImage"; 
import { MDBCardVideo } from 'mdbreact';
import '../PostShow.css';
const PostList = ({ location, userId }) => {
    const { userDataf } = useUserAuth();
    const [uidd,setUidd]=useState('');
    const [posts, setPosts] = useState([]);
    const [modalPost, setModalPost] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [index, setIndex] = useState(0);
    const [usernamee, setUsernamee] = useState(null);
    const [friendsPosts, setFriendsPosts] = useState([]);
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
    const handleLikeToggle = async (post) => {
        const { uid, username } = await userDataf();
        setUidd(uid);
        const postRef = doc(db, 'posts', post.id);
        const updatedLikedBy = post.likedBy || [];

        if (updatedLikedBy.includes(uid)) {
            updatedLikedBy.splice(updatedLikedBy.indexOf(uid), 1);
            await updateDoc(postRef, {
                likes: post.likes - 1,
                likedBy: updatedLikedBy
            });
            post.likes -= 1;
        } else {
            updatedLikedBy.push(uid);
            await updateDoc(postRef, {
                likes: post.likes + 1,
                likedBy: updatedLikedBy
            });
            post.likes += 1;
        }

        setFriendsPosts((prevPosts) =>
            prevPosts.map((p) => (p.id === post.id ? { ...p, likes: post.likes, likedBy: updatedLikedBy } : p))
        );
    };
    const formatTimeDifference = (timestamp) => {
        const now = Date.now();
        const diff = now - timestamp * 1000; // Convert seconds to milliseconds

        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const months = Math.floor(days / 30);
        const years = Math.floor(months / 12);

        if (years > 0) return `${years} year${years > 1 ? 's' : ''} ago`;
        if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`;
        if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
        if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
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
            {modalPost && (
                    <div className='' style={{padding:"5px"}}>
                        <div className="post-header">
                            <img src={profileImageUrl} alt="Profile" style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
                            <div>
                                <h3 id="uname">{modalPost.username}</h3>
                                <h6 style={{ paddingLeft: "12px" }} id=''>{formatTimeDifference(modalPost.createdAt.seconds)}</h6>
                                {/* <h6 id="uname">{new Date(post.createdAt.seconds * 1000).toLocaleString()}</h6> */}
                            </div>
                        </div>
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
                        <div className="like-section">
                            <span
                                className={`like-button`}
                            // onClick={() => handleLikeToggle(post)}
                            >
                                <i className={modalPost.likedBy && modalPost.likedBy.includes(uidd) ? 'icon-park-solid--like' : 'icon-park-outline--like1'} onClick={() => handleLikeToggle(modalPost)}></i>
                            </span>
                            <span className="comment-icon">
                                <i className="iconamoon--comment-thin"></i>
                            </span>
                        </div>
                        <p>{modalPost.likes} Likes</p>
                        <p><span id='uname1'>{modalPost.username}</span> {modalPost.caption}</p>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default PostList;
